'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { Confidence, StudyQueueCard } from '@/lib/types';
import { CONFIDENCE_REPEAT_FREQUENCY } from './cbrConstants';

const GAUGE_DELTA_BY_CONFIDENCE: Record<Confidence, number> = { 1: -10, 2: -5, 3: 0, 4: 5, 5: 10 };

// Composite key so single-deck and merged (class-wide) sessions share one model —
// a plain card index isn't unique once cards from several decks share a queue.
function cardKey(deckId: string, index: number): string {
  return `${deckId}:${index}`;
}

interface CoachingMessage {
  id: number;
  text: string;
}

interface DeckSessionSummary {
  deckId: string;
  cardsStudied: number;
  pointsEarned: number;
  avgConfidence: number;
}

interface StudySessionContextType {
  sessionTitle: string;
  primaryDeckId: string | undefined;
  classId: string | undefined;
  queue: StudyQueueCard[];
  currentCard: StudyQueueCard | null;
  cardsShownCount: number;
  totalCards: number;
  initialCardKeys: string[];
  isRevealed: boolean;
  roundTimerSeconds: number;
  sessionRatings: Record<string, Confidence>;
  pointsEarned: number;
  bonusPoints: number;
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
  sessionTitle,
  primaryDeckId,
  classId,
  initialQueue,
  initialMasteryPct,
  onSessionComplete,
  children,
}: {
  sessionTitle: string;
  // Set for single-deck sessions (Phase 1); omitted for merged class sessions,
  // where every StudyQueueCard already carries its own deckId.
  primaryDeckId?: string;
  // Set for merged class-wide sessions (Phase 3) — used only to fetch the right
  // "Overall" mastery endpoint in the sidebar, not for per-card rating logic.
  classId?: string;
  initialQueue: StudyQueueCard[];
  initialMasteryPct: number;
  onSessionComplete: (perDeckSummaries: DeckSessionSummary[]) => void;
  children: ReactNode;
}) {
  const [queue, setQueue] = useState<StudyQueueCard[]>(initialQueue);
  const [cardsShownCount, setCardsShownCount] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [roundTimerSeconds, setRoundTimerSeconds] = useState(0);
  const [sessionRatings, setSessionRatings] = useState<Record<string, Confidence>>({});
  const [pointsEarnedByDeck, setPointsEarnedByDeck] = useState<Record<string, number>>({});
  const [bonusPoints, setBonusPoints] = useState(0);
  const [masteryPct, setMasteryPct] = useState(initialMasteryPct);
  const [gaugeValue, setGaugeValue] = useState(0);
  const [lastRating, setLastRating] = useState<Confidence | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [coachingMessage, setCoachingMessage] = useState<CoachingMessage | null>(null);
  const [halfwayShown, setHalfwayShown] = useState(false);
  const [almostDoneShown, setAlmostDoneShown] = useState(false);

  const totalCards = initialQueue.length;
  const initialCardKeys = useRef(initialQueue.map(c => cardKey(c.deckId ?? primaryDeckId!, c.index))).current;
  const previousConfidenceRef = useRef<Record<string, Confidence | null>>(
    Object.fromEntries(initialQueue.map(c => [cardKey(c.deckId ?? primaryDeckId!, c.index), c.currentConfidence]))
  );
  const completedRef = useRef(false);
  const gaugeSumRef = useRef(0);

  const pointsEarned = Object.values(pointsEarnedByDeck).reduce((s, p) => s + p, 0);

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
    const deckId = card.deckId ?? primaryDeckId!;
    const key = cardKey(deckId, card.index);

    const previous = previousConfidenceRef.current[key] ?? null;
    // Base points = the rating itself. Bonuses are mutually exclusive: a first-ever
    // rating earns a small +1 for "getting started"; a later improvement earns +2.
    let bonus = 0;
    if (previous === null) bonus = 1;
    else if (confidence > previous) bonus = 2;
    const points = confidence + bonus;

    // "Confidence Gained" gauge: running sum of fixed per-rating deltas, clamped to -50..+50.
    gaugeSumRef.current = Math.max(-50, Math.min(50, gaugeSumRef.current + GAUGE_DELTA_BY_CONFIDENCE[confidence]));
    setGaugeValue(gaugeSumRef.current);

    previousConfidenceRef.current[key] = confidence;
    setSessionRatings(prev => ({ ...prev, [key]: confidence }));
    setPointsEarnedByDeck(prev => ({ ...prev, [deckId]: (prev[deckId] ?? 0) + points }));
    if (bonus > 0) setBonusPoints(prev => prev + bonus);
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
        // Single-deck sessions only — a merged session's ring reflects the class's
        // overall mastery, which the sidebar fetches separately, not any one deck.
        if (primaryDeckId && typeof data.masteryPct === 'number') setMasteryPct(data.masteryPct);
      }
    } catch {
      // Non-fatal — rating still applies within this session's local state
    }

    // Build the next queue state: cards rated 1-2 reappear later this session.
    // Always operate on the head of the queue so there's no index to go stale
    // as cards are removed and re-inserted mid-session.
    let remainingAfterThisCard = 0;
    setQueue(prevQueue => {
      const rest = prevQueue.slice(1);
      if (confidence <= 2) {
        const insertAt = Math.min(3, rest.length);
        rest.splice(insertAt, 0, { ...card, currentConfidence: confidence });
        showCoaching(`You're seeing this card again because you rated it a ${confidence}. ${confidence}'s repeat ${CONFIDENCE_REPEAT_FREQUENCY[confidence]}.`);
      }
      remainingAfterThisCard = rest.length;
      return rest;
    });

    setIsRevealed(false);

    const uniqueStudiedSoFar = Object.keys({ ...sessionRatings, [key]: confidence }).length;
    // Once every unique card has been rated at least once, anything left in the
    // queue is by definition a repeat — that's exactly when "almost done" applies.
    if (!halfwayShown && totalCards > 1 && uniqueStudiedSoFar >= Math.ceil(totalCards / 2)) {
      setHalfwayShown(true);
      setTimeout(() => showCoaching("You're halfway there. Keep going until your goal!"), 1200);
    } else if (!almostDoneShown && uniqueStudiedSoFar >= totalCards && remainingAfterThisCard > 0) {
      setAlmostDoneShown(true);
      setTimeout(() => showCoaching('Almost done! Just a few more repeating cards.'), 1200);
    }
  }

  // When the queue empties, finish the session exactly once
  useEffect(() => {
    if (queue.length === 0 && totalCards > 0 && !completedRef.current) {
      completedRef.current = true;
      setIsComplete(true);

      // Group ratings back out by deck so each deck gets its own study_sessions row
      // (and its own contribution to the streak/points total via complete-session).
      const byDeck = new Map<string, Confidence[]>();
      Object.entries(sessionRatings).forEach(([key, confidence]) => {
        const deckId = key.slice(0, key.lastIndexOf(':'));
        if (!byDeck.has(deckId)) byDeck.set(deckId, []);
        byDeck.get(deckId)!.push(confidence);
      });

      const summaries: DeckSessionSummary[] = Array.from(byDeck.entries()).map(([deckId, ratings]) => ({
        deckId,
        cardsStudied: ratings.length,
        pointsEarned: pointsEarnedByDeck[deckId] ?? 0,
        avgConfidence: ratings.reduce((s, r) => s + r, 0) / ratings.length,
      }));

      onSessionComplete(summaries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.length]);

  const currentCard = queue[0] ?? null;

  return (
    <StudySessionContext.Provider
      value={{
        sessionTitle,
        primaryDeckId,
        classId,
        queue,
        currentCard,
        cardsShownCount,
        totalCards,
        initialCardKeys,
        isRevealed,
        roundTimerSeconds,
        sessionRatings,
        pointsEarned,
        bonusPoints,
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
