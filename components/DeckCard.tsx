'use client';
import { Deck } from '@/lib/types';

interface DeckCardProps {
  deck: Deck;
  onDelete: (id: string) => void;
  onStudy: (deck: Deck) => void;
}

export default function DeckCard({ deck, onDelete, onStudy }: DeckCardProps) {
  const date = new Date(deck.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const handleDelete = () => {
    if (confirm(`Delete "${deck.title}"? This cannot be undone.`)) {
      onDelete(deck.id);
    }
  };

  return (
    <div className="deck-card">
      <div className="deck-card-top">
        {deck.topic && <span className="deck-topic-badge">{deck.topic}</span>}
        <button className="deck-delete-btn" onClick={handleDelete} title="Delete deck">🗑️</button>
      </div>
      <h3 className="deck-card-title">{deck.title}</h3>
      <div className="deck-card-meta">
        <span>{deck.flashcards.length} cards</span>
        <span>{date}</span>
      </div>
      <button className="btn deck-study-btn" onClick={() => onStudy(deck)}>
        ⚡ Study
      </button>
    </div>
  );
}
