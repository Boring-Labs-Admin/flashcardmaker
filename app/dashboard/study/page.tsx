'use client';

import { invalidateStatsCache } from '@/lib/statsCache';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useDashboard } from '@/lib/dashboard-context';
import { StudyQueueCard } from '@/lib/types';
import StudySessionScreens from '@/components/study/StudySessionScreens';
import CBRIntroScreen from '@/components/study/CBRIntroScreen';
import { CBR_INTRO_SEEN_KEY } from '@/components/study/cbrConstants';

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

  const handleSessionComplete = async (summaries: { deckId: string; cardsStudied: number; pointsEarned: number; avgConfidence: number }[]) => {
    try {
      await Promise.all(summaries.map(summary =>
        fetch('/api/study/complete-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(summary),
        })
      ));
      invalidateStatsCache();
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
    <StudySessionScreens
      sessionTitle={deck?.title ?? 'Deck'}
      primaryDeckId={deckId}
      initialQueue={queue}
      initialMasteryPct={deck?.mastery_pct ?? 0}
      onSessionComplete={handleSessionComplete}
      onExit={handleExit}
    />
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
