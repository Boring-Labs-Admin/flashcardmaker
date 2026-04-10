import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { GoogleGenAI } from '@google/genai';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { TestOptions } from '@/lib/types';

export const maxDuration = 60;

function isRateLimitError(err: unknown): boolean {
  const msg = String(err).toLowerCase();
  return msg.includes('429') || msg.includes('resource_exhausted') || msg.includes('too many requests') || msg.includes('quota');
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let deckId: string;
  try {
    const body = await request.json();
    deckId = body.deckId;
    if (!deckId) throw new Error('Missing deckId');
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Fetch deck (ownership check via user_id)
  const { data: deck, error: fetchError } = await supabaseAdmin
    .from('decks')
    .select('*')
    .eq('id', deckId)
    .eq('user_id', session.user.id)
    .single();

  if (fetchError || !deck) {
    return NextResponse.json({ error: 'Deck not found.' }, { status: 404 });
  }

  // Cache hit — return stored options immediately (no Gemini call)
  if (deck.test_options) {
    return NextResponse.json({ test_options: deck.test_options });
  }

  if (!deck.flashcards || deck.flashcards.length === 0) {
    return NextResponse.json({ error: 'Deck has no flashcards.' }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Generation not configured.' }, { status: 503 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const cards = deck.flashcards as { id: string; question: string; answer: string }[];

  const systemInstruction = `You are a quiz question expert. You will be given a list of flashcards, each with an ID, a question, and the correct answer. For each flashcard, generate exactly 3 plausible but incorrect answer distractors that a student studying this topic might confuse with the correct answer.

Rules:
- Study the correct answer carefully — distractors must be wrong versions of that specific answer
- Distractors should be similar in style, length, and format to the correct answer
- Distractors must be plausible enough that a student who hasn't studied might pick them
- Never include the correct answer as a distractor
- Never repeat distractors within the same card
- Return ONLY a valid JSON object — no explanation text, no markdown, no extra fields
- Every card ID in the input must have a corresponding key in the output`;

  // Build user message listing every card with its question and correct answer
  const cardList = cards.map((c, i) =>
    `Card ${i + 1}:\n  ID: ${c.id}\n  Question: ${c.question}\n  Correct answer: ${c.answer}`
  ).join('\n\n');

  const userMessage = `Here are the flashcards. Generate 3 wrong-answer distractors for each one:\n\n${cardList}\n\nReturn as JSON: { "<card_id>": ["distractor1", "distractor2", "distractor3"], ... }`;

  let response;
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-lite',
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          maxOutputTokens: 8000,
        },
      });
      break;
    } catch (err) {
      // 429 rate limit — don't retry, fail fast with a clear message
      if (isRateLimitError(err)) {
        console.error('Gemini rate limit hit for test-options:', String(err));
        return NextResponse.json(
          { error: 'Too many requests to the AI. Please wait a minute and try again.' },
          { status: 429 }
        );
      }
      lastError = err;
      if (attempt === 0) await new Promise(r => setTimeout(r, 2000));
    }
  }

  if (!response) {
    console.error('Gemini error generating test options:', String(lastError));
    return NextResponse.json({ error: 'Failed to generate test options. Please try again.' }, { status: 500 });
  }

  let parsed: Record<string, unknown>;
  try {
    const text = response.text;
    if (!text) throw new Error('Empty response');
    parsed = JSON.parse(text);
  } catch (parseErr) {
    console.error('Failed to parse Gemini response:', String(parseErr));
    return NextResponse.json({ error: 'Failed to process AI response. Please try again.' }, { status: 500 });
  }

  // Build validated options — lenient: skip cards with bad output rather than failing entirely
  const result: TestOptions = {};
  const skipped: string[] = [];

  for (const card of cards) {
    const wrongs = parsed[card.id];
    if (
      Array.isArray(wrongs) &&
      wrongs.length >= 3 &&
      wrongs.slice(0, 3).every((w: unknown) => typeof w === 'string' && (w as string).trim())
    ) {
      result[card.id] = [
        (wrongs[0] as string).trim(),
        (wrongs[1] as string).trim(),
        (wrongs[2] as string).trim(),
      ];
    } else {
      skipped.push(card.id);
    }
  }

  if (skipped.length > 0) {
    console.error(`Test options missing for ${skipped.length} card(s):`, skipped);
  }

  // Fail only if we got nothing at all
  if (Object.keys(result).length === 0) {
    return NextResponse.json({ error: 'AI returned no usable options. Please try again.' }, { status: 500 });
  }

  // Store in DB (only cards we have options for)
  const { error: updateError } = await supabaseAdmin
    .from('decks')
    .update({ test_options: result })
    .eq('id', deckId)
    .eq('user_id', session.user.id);

  if (updateError) {
    console.error('Failed to store test options:', updateError.message);
    // Still return so the user can test — just won't be cached
  }

  return NextResponse.json({ test_options: result });
}
