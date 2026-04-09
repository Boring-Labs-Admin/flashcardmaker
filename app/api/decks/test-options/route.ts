import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { GoogleGenAI } from '@google/genai';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { TestOptions } from '@/lib/types';

export const maxDuration = 60;

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

  // Cache hit — return stored options immediately
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

  const systemInstruction = `You are a quiz question expert. For each flashcard provided, generate exactly 3 plausible but incorrect answer distractors that a student might confuse with the correct answer.

Rules:
- Each distractor must be clearly wrong but believable — not obviously ridiculous
- Distractors should be similar in style, length, and format to the correct answer
- Never repeat the correct answer as a distractor
- Never repeat distractors within the same card
- Return ONLY a valid JSON object where each key is the card ID and the value is an array of exactly 3 strings
- No explanation text, no extra fields`;

  const userMessage = `Generate 3 wrong-answer distractors for each of these flashcards:\n${JSON.stringify(
    deck.flashcards.map((c: { id: string; question: string; answer: string }) => ({
      id: c.id,
      question: c.question,
      answer: c.answer,
    }))
  )}\n\nReturn format: { "<card_id>": ["wrong1", "wrong2", "wrong3"], ... }`;

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
          maxOutputTokens: 4000,
        },
      });
      break;
    } catch (err) {
      lastError = err;
      if (attempt === 0) await new Promise(r => setTimeout(r, 1500));
    }
  }

  if (!response) {
    console.error('Gemini error generating test options:', String(lastError));
    return NextResponse.json({ error: 'Failed to generate test options. Please try again.' }, { status: 500 });
  }

  let parsed: TestOptions;
  try {
    const text = response.text;
    if (!text) throw new Error('Empty response');
    parsed = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: 'Failed to process test options. Please try again.' }, { status: 500 });
  }

  // Validate all card IDs are present with exactly 3 non-empty strings
  for (const card of deck.flashcards) {
    const wrongs = parsed[card.id];
    if (
      !Array.isArray(wrongs) ||
      wrongs.length !== 3 ||
      wrongs.some((w: unknown) => typeof w !== 'string' || !w.trim())
    ) {
      console.error('Invalid test options for card:', card.id, wrongs);
      return NextResponse.json({ error: 'Generated options were incomplete. Please try again.' }, { status: 500 });
    }
  }

  // Store in DB
  const { error: updateError } = await supabaseAdmin
    .from('decks')
    .update({ test_options: parsed })
    .eq('id', deckId)
    .eq('user_id', session.user.id);

  if (updateError) {
    console.error('Failed to store test options:', updateError.message);
    // Still return the options so the user can test — just won't be cached
  }

  return NextResponse.json({ test_options: parsed });
}
