import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { calculateMasteryPct } from '@/lib/mastery';
import type { DeckMastery } from '@/lib/types';

// GET /api/decks/[id]/mastery — mastery breakdown for a single deck
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deckId = params.id;

  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select('id, flashcards')
    .eq('id', deckId)
    .eq('user_id', session.user.id)
    .single();

  if (deckError || !deck) {
    return NextResponse.json({ error: 'Deck not found.' }, { status: 404 });
  }

  const totalCards = Array.isArray(deck.flashcards) ? deck.flashcards.length : 0;
  const { masteryPct, ratedCount, avgConfidence } = await calculateMasteryPct(
    supabase, session.user.id, deckId, totalCards
  );

  return NextResponse.json({
    masteryPct,
    cardsStudied: ratedCount,
    totalCards,
    uniqueCardsStudied: ratedCount,
    avgConfidence,
  } satisfies DeckMastery);
}
