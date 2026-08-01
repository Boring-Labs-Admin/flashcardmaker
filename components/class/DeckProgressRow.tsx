'use client';

import { Check, Play, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClassDeckSummary } from '@/lib/types';

export function getMasteryColour(pct: number): string {
  if (pct >= 100) return '#00bcd4';
  if (pct >= 81) return '#4caf50';
  if (pct >= 61) return '#ffd600';
  if (pct >= 41) return '#ff6b00';
  if (pct >= 21) return '#e91e8c';
  return '#c7cdd6';
}

export default function DeckProgressRow({
  deck,
  onStudy,
  onDelete,
}: {
  deck: ClassDeckSummary;
  onStudy: () => void;
  onDelete: () => void;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const color = getMasteryColour(deck.masteryPct);

  return (
    <div className="deck-progress-row">
      <span className="deck-progress-check" style={{ color: deck.masteryPct >= 90 ? '#4caf50' : '#c7cdd6' }}>
        <Check size={16} />
      </span>
      <span className="deck-progress-pct">{deck.masteryPct.toFixed(0)}%</span>
      <div className="deck-progress-main">
        <button className="deck-progress-name deck-progress-name-link" onClick={() => router.push(`/dashboard/decks/${deck.id}/edit`)}>
          {deck.title}
        </button>
        <span className="deck-progress-count">{deck.cardsStudied} of {deck.cardCount} unique cards studied</span>
        <div className="deck-progress-track">
          <div className="deck-progress-fill" style={{ width: `${Math.min(100, deck.masteryPct)}%`, background: color }} />
        </div>
      </div>
      <div className="deck-progress-menu-wrap">
        {confirmDelete ? (
          <div className="deck-progress-confirm">
            <span>Delete?</span>
            <button onClick={() => { setConfirmDelete(false); onDelete(); }}>Yes</button>
            <button onClick={() => setConfirmDelete(false)}>No</button>
          </div>
        ) : (
          <>
            <button className="deck-progress-menu-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Deck options">
              <MoreHorizontal size={18} />
            </button>
            {menuOpen && (
              <div className="deck-progress-menu">
                <button className="danger" onClick={() => { setMenuOpen(false); setConfirmDelete(true); }}>Delete</button>
              </div>
            )}
          </>
        )}
      </div>
      <button className="deck-progress-play" onClick={onStudy} aria-label={`Study ${deck.title}`}>
        <Play size={16} fill="currentColor" />
      </button>
    </div>
  );
}
