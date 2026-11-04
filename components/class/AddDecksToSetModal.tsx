'use client';

import { useMemo, useState } from 'react';
import { X, Check } from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';

// Lets the user pick existing decks to put into a Set. A deck belongs to at most one Set,
// so decks already in a different Set are shown with a "moves from" note rather than hidden.
export default function AddDecksToSetModal({
  classId,
  onDone,
  onClose,
}: {
  classId: string;
  onDone: () => void;
  onClose: () => void;
}) {
  const { decks, classes, handleDeckUpdate } = useDashboard();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const available = useMemo(() => decks.filter(d => d.class_id !== classId), [decks, classId]);
  const setTitle = (id: string | null | undefined) => classes.find(c => c.id === id)?.title;

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const handleAdd = async () => {
    if (selected.size === 0) return;
    setSaving(true);
    await Promise.all(Array.from(selected).map(id => handleDeckUpdate(id, { classId })));
    setSaving(false);
    onDone();
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="modal-title">Add decks to this set</div>

        {available.length === 0 ? (
          <p className="modal-note" style={{ margin: '1rem 0' }}>
            Every deck you have is already in this set. Create a new deck to add more.
          </p>
        ) : (
          <div className="add-decks-list">
            {available.map(deck => {
              const from = setTitle(deck.class_id);
              const on = selected.has(deck.id);
              return (
                <button key={deck.id} className={`add-decks-item${on ? ' selected' : ''}`} onClick={() => toggle(deck.id)}>
                  <span className="add-decks-check">{on && <Check size={13} strokeWidth={3} />}</span>
                  <span className="add-decks-info">
                    <b>{deck.title}</b>
                    <span>
                      {deck.flashcards.length} card{deck.flashcards.length === 1 ? '' : 's'}
                      {from && ` · moves from "${from}"`}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <button className="modal-btn" onClick={handleAdd} disabled={selected.size === 0 || saving}>
          {saving ? 'Adding…' : selected.size > 0 ? `Add ${selected.size} deck${selected.size === 1 ? '' : 's'}` : 'Select decks to add'}
        </button>
        <button className="modal-close" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
