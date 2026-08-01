'use client';

import { useEffect, useState } from 'react';
import { useStudySession } from './StudySessionProvider';
import { CONFIDENCE_COLORS, UNRATED_COLOR, formatRoundTimer } from './cbrConstants';
import MasteryRing from '@/components/MasteryRing';

// Semicircle speedometer, -50 (top-left) to +50 (top-right), needle rotates around a fixed pivot.
function ConfidenceGauge({ value }: { value: number }) {
  const clamped = Math.max(-50, Math.min(50, value));
  const angle = (clamped / 50) * 90; // -90deg .. +90deg

  return (
    <svg viewBox="0 0 200 110" className="cbr-gauge-svg">
      <defs>
        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c2185b" />
          <stop offset="50%" stopColor="#7b5fc4" />
          <stop offset="100%" stopColor="#2196f3" />
        </linearGradient>
      </defs>
      <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="url(#gaugeGradient)" strokeWidth="10" strokeLinecap="round" />
      <g transform={`translate(100 100) rotate(${angle})`}>
        <path d="M 0 -70 L -6 -6 A 6 6 0 1 0 6 -6 Z" fill="currentColor" />
      </g>
      <circle cx="100" cy="100" r="7" fill="currentColor" />
    </svg>
  );
}

export default function StudySidebar() {
  const {
    primaryDeckId,
    classId,
    sessionTitle,
    currentCard,
    sessionRatings,
    initialCardKeys,
    gaugeValue,
    masteryPct,
    roundTimerSeconds,
    totalCards,
  } = useStudySession();

  const [tab, setTab] = useState<'round' | 'overall'>('round');
  const [overallStat, setOverallStat] = useState<{ uniqueCardsStudied: number; totalCards: number } | null>(null);

  useEffect(() => {
    if (tab !== 'overall' || overallStat) return;
    const url = primaryDeckId ? `/api/decks/${primaryDeckId}/mastery` : `/api/classes/${classId}`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.error) return;
        if (primaryDeckId) {
          setOverallStat({ uniqueCardsStudied: data.uniqueCardsStudied, totalCards: data.totalCards });
        } else {
          const studied = (data.decks ?? []).reduce((s: number, d: { cardsStudied: number }) => s + d.cardsStudied, 0);
          setOverallStat({ uniqueCardsStudied: studied, totalCards: data.totalCards });
        }
      })
      .catch(() => {});
  }, [tab, primaryDeckId, classId, overallStat]);

  return (
    <aside className="cbr-sidebar">
      <div className="cbr-sidebar-top">
        <div className="cbr-sidebar-deck-name">{sessionTitle}</div>
        <div className="cbr-sidebar-tabs">
          <button className={`cbr-tab${tab === 'round' ? ' active' : ''}`} onClick={() => setTab('round')}>This Round</button>
          <button className={`cbr-tab${tab === 'overall' ? ' active' : ''}`} onClick={() => setTab('overall')}>Overall</button>
        </div>
      </div>

      {tab === 'round' ? (
        <div className="cbr-gauge-wrap">
          <ConfidenceGauge value={gaugeValue} />
          <div className="cbr-gauge-scale">
            <span>-50</span>
            <span>50</span>
          </div>
          <div className="cbr-gauge-label">Confidence Gained</div>
        </div>
      ) : (
        <div className="cbr-overall-wrap">
          <MasteryRing pct={masteryPct} size={110} strokeWidth={8} />
          <div className="cbr-overall-stat">
            {overallStat ? `${overallStat.uniqueCardsStudied} of ${overallStat.totalCards}` : `… of ${totalCards}`} unique cards studied
          </div>
        </div>
      )}

      <div className="cbr-dots">
        {initialCardKeys.map(key => {
          const rating = sessionRatings[key];
          const activeKey = currentCard ? `${currentCard.deckId ?? primaryDeckId}:${currentCard.index}` : null;
          const isActive = activeKey === key && !rating;
          const color = rating ? CONFIDENCE_COLORS[rating] : (isActive ? '#ffffff' : UNRATED_COLOR);
          return <span key={key} className="cbr-dot" style={{ background: color }} />;
        })}
      </div>

      <div className="cbr-round-timer">
        This Round:
        <br />
        {formatRoundTimer(roundTimerSeconds)}
      </div>
    </aside>
  );
}
