'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { StudyQueueCard } from '@/lib/types';
import StudySessionScreens from '@/components/study/StudySessionScreens';
import CBRIntroScreen from '@/components/study/CBRIntroScreen';
import { CBR_INTRO_SEEN_KEY } from '@/components/study/cbrConstants';

function ClassStudyContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = params.id as string;
  const mode = searchParams.get('mode') === 'random' ? 'random' : 'progressive';

  const [queue, setQueue] = useState<StudyQueueCard[] | null>(null);
  const [classTitle, setClassTitle] = useState('Set');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [introSeen, setIntroSeen] = useState(true);

  useEffect(() => {
    setIntroSeen(typeof window !== 'undefined' && localStorage.getItem(CBR_INTRO_SEEN_KEY) === 'true');

    fetch(`/api/classes/${classId}/study`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setQueue(data.queue);
          if (data.classTitle) setClassTitle(data.classTitle);
        }
      })
      .catch(() => setError('Failed to load study queue. Please try again.'))
      .finally(() => setLoading(false));
  }, [classId, mode]);

  const handleExit = () => router.push(`/dashboard/classes/${classId}`);

  const handleSessionComplete = async (summaries: { deckId: string; cardsStudied: number; pointsEarned: number; avgConfidence: number }[]) => {
    try {
      await Promise.all(summaries.map(summary =>
        fetch('/api/study/complete-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(summary),
        })
      ));
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

  if (error || !queue) {
    return (
      <div className="cbr-fullscreen-status">
        <p>{error || 'This set has no cards to study.'}</p>
        <Link href={`/dashboard/classes/${classId}`} className="btn-outline">← Back to set</Link>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="cbr-fullscreen-status">
        <p>You&apos;re all caught up — no cards are due for review right now.</p>
        <Link href={`/dashboard/classes/${classId}`} className="btn-outline">← Back to set</Link>
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
      sessionTitle={classTitle}
      classId={classId}
      initialQueue={queue}
      initialMasteryPct={0}
      onSessionComplete={handleSessionComplete}
      onExit={handleExit}
    />
  );
}

export default function ClassStudyPage() {
  return (
    <div className="cbr-page-root">
      <Suspense>
        <ClassStudyContent />
      </Suspense>
    </div>
  );
}
