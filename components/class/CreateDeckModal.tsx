'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Deck } from '@/lib/types';
import { useDashboard } from '@/lib/dashboard-context';

export default function CreateDeckModal({
  classId,
  onCreated,
  onCancel,
}: {
  classId: string;
  onCreated: (deck: Deck) => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const { handleDeckSaved } = useDashboard();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), topic: description.trim() || undefined, flashcards: [], classId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to create deck.'); return; }
      // The editor page reads decks from dashboard-context, not the class page's own
      // fetch — without this the freshly created deck isn't there yet and the editor
      // shows "Deck not found." right after creation.
      handleDeckSaved(data.deck);
      onCreated(data.deck);
      router.push(`/dashboard/decks/${data.deck.id}/edit`);
    } catch {
      setError('Failed to create deck. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay active" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-x" onClick={onCancel} aria-label="Close"><X size={18} /></button>
        <div className="modal-title">Create A New Deck For Your Cards</div>

        <label className="modal-field-label">Title</label>
        <input
          className="deck-name-input"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Name your deck"
          disabled={saving}
          autoFocus
        />

        <label className="modal-field-label">Description</label>
        <textarea
          className="deck-name-input modal-textarea"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Provide a brief summary (optional)"
          disabled={saving}
        />

        {error && <div className="modal-error">{error}</div>}

        <button className="modal-btn" onClick={handleCreate} disabled={saving || !title.trim()}>
          {saving ? 'Creating…' : 'TYPE CARDS IN A NEW DECK'}
        </button>
        <button className="modal-close" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
