import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export const maxDuration = 30;

// POST /api/decks/[id]/cards/[index]/enhance — AI-improve a single card's wording
export async function POST(request: NextRequest, { params }: { params: { id: string; index: string } }) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Enhancement is not configured yet.' }, { status: 503 });
  }
  if (process.env.DISABLE_GENERATION === 'true') {
    return NextResponse.json({ error: 'AI features are temporarily unavailable. Please try again later.' }, { status: 503 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Ownership check
  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single();

  if (deckError || !deck) {
    return NextResponse.json({ error: 'Deck not found.' }, { status: 404 });
  }

  let question: string, answer: string;
  try {
    const body = await request.json();
    question = body.question;
    answer = body.answer;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!question?.trim() || !answer?.trim()) {
    return NextResponse.json({ error: 'question and answer are required.' }, { status: 400 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `Improve this flashcard. The question is: "${question}". The answer is: "${answer}".
Return an improved version with: a clearer question, a more complete but still concise answer, a helpful clarifier sentence for the answer side, and optionally a footnote with a mnemonic or extra context (omit if none is genuinely useful — do not invent a forced one).
Keep the improved question and answer faithful to the same fact — do not introduce new information that changes what's being tested. Use UK English spelling.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING },
      answer: { type: Type.STRING },
      answerClarifier: { type: Type.STRING, nullable: true },
      answerFootnote: { type: Type.STRING, nullable: true },
    },
    required: ['question', 'answer'],
    propertyOrdering: ['question', 'answer', 'answerClarifier', 'answerFootnote'],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        maxOutputTokens: 2048,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({ error: 'No response received. Please try again.' }, { status: 500 });
    }

    const enhanced = JSON.parse(text);
    return NextResponse.json({
      question: enhanced.question ?? question,
      answer: enhanced.answer ?? answer,
      answerClarifier: enhanced.answerClarifier || undefined,
      answerFootnote: enhanced.answerFootnote || undefined,
    });
  } catch (err) {
    console.error('Card enhance error:', String(err));
    return NextResponse.json({ error: 'Failed to enhance card. Please try again.' }, { status: 500 });
  }
}
