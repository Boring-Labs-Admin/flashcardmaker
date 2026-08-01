import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Flashcard, StudyQueueCard } from '@/lib/types';

// GET /api/study/queue?deckId=uuid — ordered CBR study queue for a session
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deckId = request.nextUrl.searchParams.get('deckId');
  if (!deckId) {
    return NextResponse.json({ error: 'deckId query param required.' }, { status: 400 });
  }

  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select('id, flashcards')
    .eq('id', deckId)
    .eq('user_id', session.user.id)
    .single();

  if (deckError || !deck) {
    return NextResponse.json({ error: 'Deck not found.' }, { status: 404 });
  }

  const { data: confidenceRows, error: confError } = await supabase
    .from('card_confidence')
    .select('card_index, confidence, next_review')
    .eq('user_id', session.user.id)
    .eq('deck_id', deckId);

  if (confError) {
    return NextResponse.json({ error: confError.message }, { status: 500 });
  }

  const confidenceByIndex = new Map(
    (confidenceRows ?? []).map(row => [row.card_index, row])
  );

  const cards: Flashcard[] = deck.flashcards ?? [];
  const now = Date.now();

  const unrated: StudyQueueCard[] = [];
  const due: (StudyQueueCard & { nextReviewAt: number })[] = [];

  cards.forEach((card, index) => {
    const row = confidenceByIndex.get(index);
    if (!row) {
      unrated.push({ index, question: card.question, answer: card.answer, currentConfidence: null });
      return;
    }
    const nextReviewAt = row.next_review ? new Date(row.next_review).getTime() : 0;
    if (nextReviewAt <= now) {
      due.push({
        index,
        question: card.question,
        answer: card.answer,
        currentConfidence: row.confidence as StudyQueueCard['currentConfidence'],
        nextReviewAt,
      });
    }
  });

  due.sort((a, b) => a.nextReviewAt - b.nextReviewAt);

  const queue: StudyQueueCard[] = [
    ...unrated,
    ...due.map(({ nextReviewAt: _nextReviewAt, ...rest }) => rest),
  ];

  return NextResponse.json({
    queue,
    totalCards: cards.length,
    dueCards: queue.length,
  });
}
