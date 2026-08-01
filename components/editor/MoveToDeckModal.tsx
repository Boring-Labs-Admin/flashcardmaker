'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';
import { useCardEditor } from './CardEditorProvider';

export default function MoveToDeckModal({
  onMove,
  onClose,
}: {
  onMove: (targetDeckId: string) => Promise<boolean>;
  onClose: () => void;
}) {
  const { decks } = useDashboard();
  const { deckId } = useCardEditor();
  const [selected, setSelected] = useState<string | null>(null);
  const [moving, setMoving] = useState(false);
  const [error, setError] = useState('');

  const otherDecks = decks.filter(d => d.id !== deckId);

  const handleMove = async () => {
    if (!selected) return;
    setMoving(true);
    setError('');
    const ok = await onMove(selected);
    if (!ok) setError('Failed to move cards. Please try again.');
    setMoving(false);
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="modal-title">Move to Another Deck</div>

        {otherDecks.length === 0 ? (
          <p className="modal-note">You don&apos;t have any other decks yet.</p>
        ) : (
          <div className="move-deck-list">
            {otherDecks.map(d => (
              <label key={d.id} className="move-deck-option">
                <input type="radio" name="target-deck" checked={selected === d.id} onChange={() => setSelected(d.id)} />
                {d.title} <span className="move-deck-count">({d.flashcards.length} cards)</span>
              </label>
            ))}
          </div>
        )}

        {error && <div className="modal-error">{error}</div>}

        <button className="modal-btn" onClick={handleMove} disabled={!selected || moving}>
          {moving ? 'Moving…' : 'Move Cards'}
        </button>
        <button className="modal-close" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
