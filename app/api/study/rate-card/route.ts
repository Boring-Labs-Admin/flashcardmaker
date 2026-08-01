import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const NEXT_REVIEW_BY_CONFIDENCE: Record<number, number> = {
  1: 10 * 60 * 1000,
  2: 20 * 60 * 1000,
  3: 24 * 60 * 60 * 1000,
  4: 3 * 24 * 60 * 60 * 1000,
  5: 7 * 24 * 60 * 60 * 1000,
};

// POST /api/study/rate-card — save a 1-5 confidence rating for a card
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let deckId: string, cardIndex: number, confidence: number;
  try {
    const body = await request.json();
    deckId = body.deckId;
    cardIndex = body.cardIndex;
    confidence = body.confidence;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!deckId || typeof cardIndex !== 'number' || ![1, 2, 3, 4, 5].includes(confidence)) {
    return NextResponse.json({ error: 'deckId, cardIndex, and confidence (1-5) are required.' }, { status: 400 });
  }

  const userId = session.user.id;

  // Ownership check — deck must belong to this user
  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select('id, flashcards')
    .eq('id', deckId)
    .eq('user_id', userId)
    .single();

  if (deckError || !deck) {
    return NextResponse.json({ error: 'Deck not found.' }, { status: 404 });
  }

  const { error: rpcError } = await supabaseAdmin.rpc('record_card_confidence', {
    p_user_id: userId,
    p_deck_id: deckId,
    p_card_index: cardIndex,
    p_confidence: confidence,
  });

  if (rpcError) {
    return NextResponse.json({ error: rpcError.message }, { status: 500 });
  }

  // Recalculate mastery % — average confidence across all rated cards / 5 * 100
  const { data: confidenceRows, error: confError } = await supabaseAdmin
    .from('card_confidence')
    .select('confidence')
    .eq('user_id', userId)
    .eq('deck_id', deckId);

  let masteryPct = 0;
  if (!confError && confidenceRows && confidenceRows.length > 0) {
    const avg = confidenceRows.reduce((sum, r) => sum + r.confidence, 0) / confidenceRows.length;
    masteryPct = Math.round((avg / 5) * 10000) / 100;
  }

  await supabaseAdmin
    .from('decks')
    .update({ mastery_pct: masteryPct })
    .eq('id', deckId);

  const nextReview = new Date(Date.now() + NEXT_REVIEW_BY_CONFIDENCE[confidence]).toISOString();

  return NextResponse.json({ success: true, masteryPct, nextReview });
}
