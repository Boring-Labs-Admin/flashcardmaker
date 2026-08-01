import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Flashcard, StudyQueueCard } from '@/lib/types';

// POST /api/classes/[id]/study — merged CBR (or shuffled) queue across every deck in the class
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const classId = params.id;

  let mode: 'progressive' | 'random' = 'progressive';
  try {
    const body = await request.json();
    if (body.mode === 'random') mode = 'random';
  } catch {
    // No body / not JSON — default to progressive
  }

  const { data: cls, error: classError } = await supabase
    .from('classes')
    .select('id, title')
    .eq('id', classId)
    .eq('user_id', userId)
    .single();

  if (classError || !cls) {
    return NextResponse.json({ error: 'Class not found.' }, { status: 404 });
  }

  const { data: decks, error: deckError } = await supabase
    .from('decks')
    .select('id, title, flashcards')
    .eq('user_id', userId)
    .eq('class_id', classId);

  if (deckError) {
    return NextResponse.json({ error: deckError.message }, { status: 500 });
  }

  if (!decks || decks.length === 0) {
    return NextResponse.json({ queue: [], totalCards: 0, dueCards: 0 });
  }

  const deckIds = decks.map(d => d.id);
  const { data: confidenceRows, error: confError } = await supabase
    .from('card_confidence')
    .select('deck_id, card_index, confidence, next_review')
    .eq('user_id', userId)
    .in('deck_id', deckIds);

  if (confError) {
    return NextResponse.json({ error: confError.message }, { status: 500 });
  }

  const confidenceByDeckCard = new Map<string, { confidence: number; next_review: string | null }>();
  (confidenceRows ?? []).forEach(row => {
    confidenceByDeckCard.set(`${row.deck_id}:${row.card_index}`, row);
  });

  let totalCards = 0;
  const queue: StudyQueueCard[] = [];

  if (mode === 'random') {
    decks.forEach(deck => {
      const cards: Flashcard[] = deck.flashcards ?? [];
      totalCards += cards.length;
      cards.forEach((card, index) => {
        queue.push({ index, question: card.question, answer: card.answer, currentConfidence: null, deckId: deck.id, deckTitle: deck.title });
      });
    });
    // Fisher-Yates shuffle
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
  } else {
    const now = Date.now();
    const unrated: StudyQueueCard[] = [];
    const due: (StudyQueueCard & { nextReviewAt: number })[] = [];

    decks.forEach(deck => {
      const cards: Flashcard[] = deck.flashcards ?? [];
      totalCards += cards.length;
      cards.forEach((card, index) => {
        const row = confidenceByDeckCard.get(`${deck.id}:${index}`);
        const base: StudyQueueCard = { index, question: card.question, answer: card.answer, currentConfidence: null, deckId: deck.id, deckTitle: deck.title };
        if (!row) {
          unrated.push(base);
          return;
        }
        const nextReviewAt = row.next_review ? new Date(row.next_review).getTime() : 0;
        if (nextReviewAt <= now) {
          due.push({ ...base, currentConfidence: row.confidence as StudyQueueCard['currentConfidence'], nextReviewAt });
        }
      });
    });

    due.sort((a, b) => a.nextReviewAt - b.nextReviewAt);
    queue.push(...unrated, ...due.map(({ nextReviewAt: _nextReviewAt, ...rest }) => rest));
  }

  return NextResponse.json({
    queue,
    totalCards,
    dueCards: queue.length,
    classTitle: cls.title,
  });
}
