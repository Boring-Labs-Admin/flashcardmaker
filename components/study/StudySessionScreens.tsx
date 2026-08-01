'use client';

import { useEffect, useState } from 'react';
import { Confidence } from '@/lib/types';
import { StudySessionProvider, useStudySession } from './StudySessionProvider';
import StudyCard from './StudyCard';
import StudySidebar from './StudySidebar';
import CoachingTooltip from './CoachingTooltip';
import ConfidenceFeedbackScreen from './ConfidenceFeedbackScreen';
import RoundCompleteScreen from './RoundCompleteScreen';
import { CBR_RATING_EXPLAINED_KEY } from './cbrConstants';
import type { StudyQueueCard } from '@/lib/types';

const CBR_ROUND_EXPLAINED_KEY = 'cbr_round_complete_explained';

interface DeckSessionSummary {
  deckId: string;
  cardsStudied: number;
  pointsEarned: number;
  avgConfidence: number;
}

function Screens({ onExit }: { onExit: () => void }) {
  const { isComplete, pointsEarned, bonusPoints, lastRating } = useStudySession();
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
          bonusPoints={bonusPoints}
          showExplainer={!roundExplainerShown}
          onDismiss={dismissRoundComplete}
        />
      )}
    </>
  );
}

export default function StudySessionScreens({
  sessionTitle,
  primaryDeckId,
  classId,
  initialQueue,
  initialMasteryPct,
  onSessionComplete,
  onExit,
}: {
  sessionTitle: string;
  primaryDeckId?: string;
  classId?: string;
  initialQueue: StudyQueueCard[];
  initialMasteryPct: number;
  onSessionComplete: (perDeckSummaries: DeckSessionSummary[]) => void;
  onExit: () => void;
}) {
  return (
    <StudySessionProvider
      sessionTitle={sessionTitle}
      primaryDeckId={primaryDeckId}
      classId={classId}
      initialQueue={initialQueue}
      initialMasteryPct={initialMasteryPct}
      onSessionComplete={onSessionComplete}
    >
      <Screens onExit={onExit} />
    </StudySessionProvider>
  );
}
