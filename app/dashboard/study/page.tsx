'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useDashboard } from '@/lib/dashboard-context';
import { Confidence, StudyQueueCard } from '@/lib/types';
import { StudySessionProvider, useStudySession } from '@/components/study/StudySessionProvider';
import StudyCard from '@/components/study/StudyCard';
import StudySidebar from '@/components/study/StudySidebar';
import CoachingTooltip from '@/components/study/CoachingTooltip';
import CBRIntroScreen from '@/components/study/CBRIntroScreen';
import ConfidenceFeedbackScreen from '@/components/study/ConfidenceFeedbackScreen';
import RoundCompleteScreen from '@/components/study/RoundCompleteScreen';
import { CBR_INTRO_SEEN_KEY, CBR_RATING_EXPLAINED_KEY } from '@/components/study/cbrConstants';

const CBR_ROUND_EXPLAINED_KEY = 'cbr_round_complete_explained';

function StudySessionScreens({ onExit }: { onExit: () => void }) {
  const { isComplete, pointsEarned, lastRating } = useStudySession();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<Confidence | null>(null);
  const [ratedOnce, setRatedOnce] = useState(false);
  const [roundExplainerShown] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem(CBR_ROUND_EXPLAINED_KEY) === 'true'
  );

  useEffect(() => {
    if (lastRating && !ratedOnce) {
      setRatedOnce(true);
      if (typeof window !== 'undefined' && !localStorage.getItem(CBR_RATING_EXPLAINED_KEY)) {
        setFeedbackRating(lastRating);
        setShowFeedback(true);
      }
    }
  }, [lastRating, ratedOnce]);

  const dismissFeedback = () => {
    localStorage.setItem(CBR_RATING_EXPLAINED_KEY, 'true');
    setShowFeedback(false);
  };

  const dismissRoundComplete = () => {
    localStorage.setItem(CBR_ROUND_EXPLAINED_KEY, 'true');
    onExit();
  };

  return (
    <>
      <div className="cbr-layout">
        <StudySidebar />
        <div className="cbr-main">
          <StudyCard />
        </div>
        <CoachingTooltip />
      </div>

      {showFeedback && feedbackRating && (
        <ConfidenceFeedbackScreen rating={feedbackRating} onDismiss={dismissFeedback} />
      )}

      {isComplete && !showFeedback && (
        <RoundCompleteScreen
          pointsEarned={pointsEarned}
          showExplainer={!roundExplainerShown}
          onDismiss={dismissRoundComplete}
        />
      )}
    </>
  );
}

function StudyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { decks } = useDashboard();
  const deckId = searchParams.get('deckId');

  const [queue, setQueue] = useState<StudyQueueCard[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [introSeen, setIntroSeen] = useState(true);

  const deck = decks.find(d => d.id === deckId);

  useEffect(() => {
    if (!deckId) {
      setError('No deck selected.');
      setLoading(false);
      return;
    }
    setIntroSeen(typeof window !== 'undefined' && localStorage.getItem(CBR_INTRO_SEEN_KEY) === 'true');

    fetch(`/api/study/queue?deckId=${deckId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setQueue(data.queue);
        }
      })
      .catch(() => setError('Failed to load study queue. Please try again.'))
      .finally(() => setLoading(false));
  }, [deckId]);

  const handleExit = () => router.push('/dashboard/decks');

  const handleSessionComplete = async (summary: { cardsStudied: number; pointsEarned: number; avgConfidence: number }) => {
    if (!deckId) return;
    try {
      await fetch('/api/study/complete-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deckId,
          cardsStudied: summary.cardsStudied,
          pointsEarned: summary.pointsEarned,
          avgConfidence: summary.avgConfidence,
        }),
      });
    } catch {
      // Non-fatal — the round complete screen still shows local results
    }
  };

  if (loading) {
    return (
      <div className="cbr-fullscreen-status">
        <Loader2 size={40} strokeWidth={2} className="cbr-spin" />
      </div>
    );
  }

  if (error || !queue || !deckId) {
    return (
      <div className="cbr-fullscreen-status">
        <p>{error || 'This deck has no cards to study.'}</p>
        <Link href="/dashboard/decks" className="btn-outline">← Back to Your Flashcards</Link>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="cbr-fullscreen-status">
        <p>You&apos;re all caught up — no cards are due for review right now.</p>
        <Link href="/dashboard/decks" className="btn-outline">← Back to Your Flashcards</Link>
      </div>
    );
  }

  if (!introSeen) {
    return (
      <CBRIntroScreen
        cardCount={queue.length}
        onStart={() => {
          localStorage.setItem(CBR_INTRO_SEEN_KEY, 'true');
          setIntroSeen(true);
        }}
      />
    );
  }

  return (
    <StudySessionProvider
      deckId={deckId}
      deckTitle={deck?.title ?? 'Deck'}
      initialQueue={queue}
      initialMasteryPct={deck?.mastery_pct ?? 0}
      onSessionComplete={handleSessionComplete}
    >
      <StudySessionScreens onExit={handleExit} />
    </StudySessionProvider>
  );
}

export default function StudyPage() {
  return (
    <div className="cbr-page-root">
      <Suspense>
        <StudyPageContent />
      </Suspense>
    </div>
  );
}
