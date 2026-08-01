'use client';

import { useState } from 'react';
import { useStudySession } from './StudySessionProvider';
import { CONFIDENCE_COLORS, UNRATED_COLOR, formatRoundTimer } from './cbrConstants';

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
    deckTitle,
    currentCard,
    sessionRatings,
    initialCardIndexOrder,
    gaugeValue,
    masteryPct,
    roundTimerSeconds,
    cardsShownCount,
    totalCards,
  } = useStudySession();

  const [tab, setTab] = useState<'round' | 'overall'>('round');

  return (
    <aside className="cbr-sidebar">
      <div className="cbr-sidebar-top">
        <div className="cbr-sidebar-deck-name">{deckTitle}</div>
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
          <div className="cbr-overall-mastery">{masteryPct.toFixed(1)}%</div>
          <div className="cbr-overall-label">Mastery</div>
          <div className="cbr-overall-stat">{cardsShownCount} of {totalCards} cards studied this round</div>
        </div>
      )}

      <div className="cbr-dots">
        {initialCardIndexOrder.map(cardIndex => {
          const rating = sessionRatings[cardIndex];
          const isActive = currentCard?.index === cardIndex && !rating;
          const color = rating ? CONFIDENCE_COLORS[rating] : (isActive ? '#ffffff' : UNRATED_COLOR);
          return <span key={cardIndex} className="cbr-dot" style={{ background: color }} />;
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
