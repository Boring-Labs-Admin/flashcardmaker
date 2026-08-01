'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { Confidence, StudyQueueCard } from '@/lib/types';

interface CoachingMessage {
  id: number;
  text: string;
}

interface StudySessionContextType {
  deckId: string;
  deckTitle: string;
  queue: StudyQueueCard[];
  currentCard: StudyQueueCard | null;
  cardsShownCount: number;
  totalCards: number;
  initialCardIndexOrder: number[];
  isRevealed: boolean;
  roundTimerSeconds: number;
  sessionRatings: Record<number, Confidence>;
  pointsEarned: number;
  masteryPct: number;
  gaugeValue: number;
  lastRating: Confidence | null;
  isComplete: boolean;
  coachingMessage: CoachingMessage | null;
  dismissCoaching: () => void;
  revealAnswer: () => void;
  rateCard: (confidence: Confidence) => void;
}

const StudySessionContext = createContext<StudySessionContextType | null>(null);

let coachingIdCounter = 0;

export function StudySessionProvider({
  deckId,
  deckTitle,
  initialQueue,
  initialMasteryPct,
  onSessionComplete,
  children,
}: {
  deckId: string;
  deckTitle: string;
  initialQueue: StudyQueueCard[];
  initialMasteryPct: number;
  onSessionComplete: (summary: { cardsStudied: number; pointsEarned: number; avgConfidence: number }) => void;
  children: ReactNode;
}) {
  const [queue, setQueue] = useState<StudyQueueCard[]>(initialQueue);
  const [cardsShownCount, setCardsShownCount] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [roundTimerSeconds, setRoundTimerSeconds] = useState(0);
  const [sessionRatings, setSessionRatings] = useState<Record<number, Confidence>>({});
  const [pointsEarned, setPointsEarned] = useState(0);
  const [masteryPct, setMasteryPct] = useState(initialMasteryPct);
  const [gaugeValue, setGaugeValue] = useState(0);
  const [lastRating, setLastRating] = useState<Confidence | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [coachingMessage, setCoachingMessage] = useState<CoachingMessage | null>(null);
  const [halfwayShown, setHalfwayShown] = useState(false);

  const totalCards = initialQueue.length;
  const initialCardIndexOrder = useRef(initialQueue.map(c => c.index)).current;
  const previousConfidenceRef = useRef<Record<number, Confidence | null>>(
    Object.fromEntries(initialQueue.map(c => [c.index, c.currentConfidence]))
  );
  const completedRef = useRef(false);
  const deltaSumRef = useRef(0);
  const deltaCountRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => setRoundTimerSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    showCoaching("Reveal the answer when you're ready.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showCoaching(text: string) {
    coachingIdCounter += 1;
    setCoachingMessage({ id: coachingIdCounter, text });
  }

  function dismissCoaching() {
    setCoachingMessage(null);
  }

  function revealAnswer() {
    setIsRevealed(true);
    showCoaching('Rate how confidently you knew the answer.');
  }

  async function rateCard(confidence: Confidence) {
    const card = queue[0];
    if (!card) return;

    const previous = previousConfidenceRef.current[card.index] ?? null;
    let points = confidence;
    if (previous !== null && confidence > previous) points += 2;

    // "Confidence Gained" gauge: average delta vs a neutral baseline (3) for
    // never-rated cards, or vs the card's prior rating — scaled onto -50..+50.
    const baseline = previous ?? 3;
    deltaSumRef.current += confidence - baseline;
    deltaCountRef.current += 1;
    const avgDelta = deltaSumRef.current / deltaCountRef.current;
    setGaugeValue(Math.max(-50, Math.min(50, Math.round(avgDelta * 12.5))));

    previousConfidenceRef.current[card.index] = confidence;
    setSessionRatings(prev => ({ ...prev, [card.index]: confidence }));
    setPointsEarned(prev => prev + points);
    setLastRating(confidence);
    setCardsShownCount(n => n + 1);

    // Save to the server (we want the authoritative mastery % back)
    try {
      const res = await fetch('/api/study/rate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId, cardIndex: card.index, confidence }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.masteryPct === 'number') setMasteryPct(data.masteryPct);
      }
    } catch {
      // Non-fatal — rating still applies within this session's local state
    }

    // Build the next queue state: cards rated 1-2 reappear later this session.
    // Always operate on the head of the queue so there's no index to go stale
    // as cards are removed and re-inserted mid-session.
    setQueue(prevQueue => {
      const rest = prevQueue.slice(1);
      if (confidence <= 2) {
        const insertAt = Math.min(3, rest.length);
        rest.splice(insertAt, 0, { ...card, currentConfidence: confidence });
        showCoaching(`You're seeing this card again because you rated it a ${confidence}. ${confidence}'s repeat ${confidence === 1 ? 'very often' : 'often'}.`);
      }
      return rest;
    });

    setIsRevealed(false);

    const studiedSoFar = Object.keys({ ...sessionRatings, [card.index]: confidence }).length;
    if (!halfwayShown && totalCards > 1 && studiedSoFar >= Math.ceil(totalCards / 2)) {
      setHalfwayShown(true);
      setTimeout(() => showCoaching("You're halfway there. Keep going until your goal!"), 1200);
    }
  }

  // When the queue empties, finish the session exactly once
  useEffect(() => {
    if (queue.length === 0 && totalCards > 0 && !completedRef.current) {
      completedRef.current = true;
      setIsComplete(true);
      const ratings = Object.values(sessionRatings);
      const avgConfidence = ratings.length > 0 ? ratings.reduce((s, r) => s + r, 0) / ratings.length : 0;
      onSessionComplete({
        cardsStudied: Object.keys(sessionRatings).length,
        pointsEarned,
        avgConfidence,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.length]);

  const currentCard = queue[0] ?? null;

  return (
    <StudySessionContext.Provider
      value={{
        deckId,
        deckTitle,
        queue,
        currentCard,
        cardsShownCount,
        totalCards,
        initialCardIndexOrder,
        isRevealed,
        roundTimerSeconds,
        sessionRatings,
        pointsEarned,
        masteryPct,
        gaugeValue,
        lastRating,
        isComplete,
        coachingMessage,
        dismissCoaching,
        revealAnswer,
        rateCard,
      }}
    >
      {children}
    </StudySessionContext.Provider>
  );
}

export function useStudySession() {
  const ctx = useContext(StudySessionContext);
  if (!ctx) throw new Error('useStudySession must be used within a StudySessionProvider');
  return ctx;
}
