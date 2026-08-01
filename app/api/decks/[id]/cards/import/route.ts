import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Flashcard } from '@/lib/types';
import { parseImportText, ImportDelimiter } from '@/lib/importParser';

// POST /api/decks/[id]/cards/import — bulk-append cards parsed from pasted text
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let text: string, delimiter: ImportDelimiter;
  try {
    const body = await request.json();
    text = body.text;
    delimiter = body.delimiter;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!text?.trim() || !['tab', 'comma', 'newline-pair'].includes(delimiter)) {
    return NextResponse.json({ error: 'text and a valid delimiter are required.' }, { status: 400 });
  }

  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select('id, flashcards')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single();

  if (deckError || !deck) {
    return NextResponse.json({ error: 'Deck not found.' }, { status: 404 });
  }

  const parsed = parseImportText(text, delimiter);
  if (parsed.length === 0) {
    return NextResponse.json({ error: 'No valid question/answer pairs were found.' }, { status: 400 });
  }

  const existing: Flashcard[] = Array.isArray(deck.flashcards) ? deck.flashcards : [];
  const newCards: Flashcard[] = parsed.map((pair, i) => ({
    id: `imported-${Date.now()}-${i}`,
    question: pair.question,
    answer: pair.answer,
  }));
  const updatedCards = [...existing, ...newCards];

  const { data: updatedDeck, error: updateError } = await supabase
    .from('decks')
    .update({ flashcards: updatedCards })
    .eq('id', params.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ deck: updatedDeck, importedCount: newCards.length });
}
