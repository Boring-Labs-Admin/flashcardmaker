import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Flashcard } from '@/lib/types';

const EXTENSIONS_TO_TRY = ['jpg', 'png', 'webp', 'mp3'];

// DELETE /api/decks/[id]/cards/[index]/media — remove an image or audio clip from one card side
export async function DELETE(request: NextRequest, { params }: { params: { id: string; index: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const deckId = params.id;
  const cardIndex = parseInt(params.index, 10);

  let side: string, type: string;
  try {
    const body = await request.json();
    side = body.side;
    type = body.type;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if ((side !== 'question' && side !== 'answer') || (type !== 'image' && type !== 'audio')) {
    return NextResponse.json({ error: 'side ("question"|"answer") and type ("image"|"audio") are required.' }, { status: 400 });
  }

  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select('id, flashcards')
    .eq('id', deckId)
    .eq('user_id', userId)
    .single();

  if (deckError || !deck) {
    return NextResponse.json({ error: 'Deck not found.' }, { status: 404 });
  }

  const flashcards: Flashcard[] = Array.isArray(deck.flashcards) ? deck.flashcards : [];
  if (cardIndex < 0 || cardIndex >= flashcards.length) {
    return NextResponse.json({ error: 'Card index out of range.' }, { status: 400 });
  }

  // Try removing every possible extension for this side/type — cheap and avoids
  // needing to parse the stored URL back into a path.
  const paths = EXTENSIONS_TO_TRY.map(ext => `${userId}/${deckId}/${cardIndex}/${side}-${type}.${ext}`);
  await supabaseAdmin.storage.from('card-media').remove(paths);

  const fieldName = `${side}${type === 'image' ? 'Image' : 'Audio'}` as keyof Flashcard;
  const updatedCards = flashcards.map((card, i) => {
    if (i !== cardIndex) return card;
    const next = { ...card };
    delete next[fieldName];
    return next;
  });

  const { error: updateError } = await supabaseAdmin
    .from('decks')
    .update({ flashcards: updatedCards })
    .eq('id', deckId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
