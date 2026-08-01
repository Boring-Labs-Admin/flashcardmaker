'use client';

import { Deck, DeckMastery } from '@/lib/types';

interface DeckHoverCardProps {
  deck: Deck;
  mastery: DeckMastery | null;
  onSelect: () => void;
  onStudy: () => void;
}

// "Select" opens the card editor — the Brainscape-equivalent action for a deck's
// detail/edit view (see components/DeckCard.tsx for the wiring).
export default function DeckHoverCard({ deck, mastery, onSelect, onStudy }: DeckHoverCardProps) {
  return (
    <div className="deck-hover-card" onClick={e => e.stopPropagation()}>
      <div className="deck-hover-title">{deck.title}</div>
      <div className="deck-hover-by">By: You</div>
      <div className="deck-hover-stats">
        <div className="deck-hover-stat">
          <span className="deck-hover-stat-value">{deck.flashcards.length}</span>
          <span className="deck-hover-stat-label">Card Count</span>
        </div>
        <div className="deck-hover-stat">
          <span className="deck-hover-stat-value">{mastery ? mastery.uniqueCardsStudied : '…'}</span>
          <span className="deck-hover-stat-label">Cards Studied</span>
        </div>
        <div className="deck-hover-stat">
          <span className="deck-hover-stat-value">{(mastery?.masteryPct ?? deck.mastery_pct ?? 0).toFixed(1)}%</span>
          <span className="deck-hover-stat-label">Mastery</span>
        </div>
      </div>
      <div className="deck-hover-actions">
        <button className="deck-hover-select" onClick={onSelect}>Select</button>
        <button className="deck-hover-study" onClick={onStudy}>Study</button>
      </div>
    </div>
  );
}
