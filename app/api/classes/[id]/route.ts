import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { ClassDeckSummary, ClassDetail } from '@/lib/types';

// GET /api/classes/[id] — full class detail including decks with mastery data
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const classId = params.id;
  const userId = session.user.id;

  const { data: cls, error: classError } = await supabase
    .from('classes')
    .select('*')
    .eq('id', classId)
    .eq('user_id', userId)
    .single();

  if (classError || !cls) {
    return NextResponse.json({ error: 'Class not found.' }, { status: 404 });
  }

  const { data: decks, error: deckError } = await supabase
    .from('decks')
    .select('id, title, flashcards, mastery_pct, color, last_studied_at')
    .eq('user_id', userId)
    .eq('class_id', classId)
    .order('created_at', { ascending: true });

  if (deckError) {
    return NextResponse.json({ error: deckError.message }, { status: 500 });
  }

  const { data: confidenceRows } = await supabase
    .from('card_confidence')
    .select('deck_id')
    .eq('user_id', userId);

  const studiedCountByDeck = new Map<string, number>();
  (confidenceRows ?? []).forEach(row => {
    studiedCountByDeck.set(row.deck_id, (studiedCountByDeck.get(row.deck_id) ?? 0) + 1);
  });

  const deckSummaries: ClassDeckSummary[] = (decks ?? []).map(d => ({
    id: d.id,
    title: d.title,
    cardCount: Array.isArray(d.flashcards) ? d.flashcards.length : 0,
    masteryPct: d.mastery_pct ?? 0,
    cardsStudied: studiedCountByDeck.get(d.id) ?? 0,
    color: d.color,
    lastStudiedAt: d.last_studied_at,
  }));

  const totalCards = deckSummaries.reduce((sum, d) => sum + d.cardCount, 0);
  const weightedConfidenceSum = deckSummaries.reduce((sum, d) => sum + (d.masteryPct / 100) * d.cardCount * 5, 0);
  const masteryPct = totalCards > 0 ? Math.round((weightedConfidenceSum / (totalCards * 5)) * 10000) / 100 : 0;

  return NextResponse.json({
    class: cls,
    decks: deckSummaries,
    totalCards,
    masteryPct,
  } satisfies ClassDetail);
}

// PATCH /api/classes/[id] — update title, description, purpose, role, cover, or visibility
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  for (const key of ['title', 'description', 'purpose', 'role', 'cover_color', 'cover_emoji', 'is_public']) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update.' }, { status: 400 });
  }
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('classes')
    .update(updates)
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ class: data });
}

// DELETE /api/classes/[id] — decks inside cascade to class_id = NULL via the FK
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', params.id)
    .eq('user_id', session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
