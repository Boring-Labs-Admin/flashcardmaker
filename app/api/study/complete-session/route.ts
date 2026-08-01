import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// POST /api/study/complete-session — record a finished study round
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let deckId: string, cardsStudied: number, pointsEarned: number, avgConfidence: number | undefined;
  try {
    const body = await request.json();
    deckId = body.deckId;
    cardsStudied = body.cardsStudied;
    pointsEarned = body.pointsEarned;
    avgConfidence = body.avgConfidence;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!deckId || typeof cardsStudied !== 'number' || typeof pointsEarned !== 'number') {
    return NextResponse.json({ error: 'deckId, cardsStudied, and pointsEarned are required.' }, { status: 400 });
  }

  const userId = session.user.id;

  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select('id')
    .eq('id', deckId)
    .eq('user_id', userId)
    .single();

  if (deckError || !deck) {
    return NextResponse.json({ error: 'Deck not found.' }, { status: 404 });
  }

  const now = new Date().toISOString();

  const { error: insertError } = await supabaseAdmin
    .from('study_sessions')
    .insert({
      user_id: userId,
      deck_id: deckId,
      completed_at: now,
      cards_studied: cardsStudied,
      points_earned: pointsEarned,
      avg_confidence: avgConfidence ?? null,
    });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  await supabaseAdmin
    .from('decks')
    .update({ last_studied_at: now })
    .eq('id', deckId);

  return NextResponse.json({ success: true });
}
