import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { ClassPurpose, ClassRole, ClassSummary } from '@/lib/types';

// GET /api/classes — all classes for the logged-in user, with deck/mastery summary
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (classError) {
    return NextResponse.json({ error: classError.message }, { status: 500 });
  }

  const { data: decks, error: deckError } = await supabase
    .from('decks')
    .select('id, class_id, flashcards, mastery_pct, last_studied_at')
    .eq('user_id', userId)
    .not('class_id', 'is', null);

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

  const today = new Date().toISOString().split('T')[0];

  const summaries: ClassSummary[] = (classes ?? []).map(cls => {
    const classDecks = (decks ?? []).filter(d => d.class_id === cls.id);
    const totalCards = classDecks.reduce((sum, d) => sum + (Array.isArray(d.flashcards) ? d.flashcards.length : 0), 0);
    const weightedConfidenceSum = classDecks.reduce((sum, d) => {
      const cardCount = Array.isArray(d.flashcards) ? d.flashcards.length : 0;
      return sum + ((d.mastery_pct ?? 0) / 100) * cardCount * 5;
    }, 0);
    const masteryPct = totalCards > 0 ? Math.round((weightedConfidenceSum / (totalCards * 5)) * 10000) / 100 : 0;
    const cardsStudied = classDecks.reduce((sum, d) => sum + (studiedCountByDeck.get(d.id) ?? 0), 0);
    const studiedToday = classDecks.some(d => d.last_studied_at?.split('T')[0] === today);

    return {
      ...cls,
      deckCount: classDecks.length,
      totalCards,
      masteryPct,
      cardsStudied,
      studiedToday,
    };
  });

  return NextResponse.json({ classes: summaries });
}

// POST /api/classes — create a new class
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let title: string, purpose: ClassPurpose | undefined, role: ClassRole | undefined;
  try {
    const body = await request.json();
    title = body.title;
    purpose = body.purpose;
    role = body.role;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!title || !title.trim()) {
    return NextResponse.json({ error: 'title is required.' }, { status: 400 });
  }

  const COVER_COLORS = ['#e91e8c', '#ff6b00', '#ffd600', '#4caf50', '#00bcd4', '#6366f1', '#ec4899', '#f97316', '#84cc16', '#06b6d4', '#8b5cf6', '#ef4444'];
  const coverColor = COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)];

  const { data, error } = await supabase
    .from('classes')
    .insert({
      user_id: session.user.id,
      title: title.trim(),
      purpose: purpose ?? null,
      role: role ?? 'student',
      cover_color: coverColor,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ class: data });
}
