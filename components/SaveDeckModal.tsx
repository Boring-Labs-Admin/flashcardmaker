'use client';
import { useState } from 'react';
import { Flashcard, Deck } from '@/lib/types';

interface SaveDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashcards: Flashcard[];
  topic?: string;
  onSaved: (deck: Deck) => void;
}

export default function SaveDeckModal({ isOpen, onClose, flashcards, topic, onSaved }: SaveDeckModalProps) {
  const [title, setTitle] = useState(topic ? `${topic.charAt(0).toUpperCase() + topic.slice(1)} Flashcards` : 'My Deck');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!title.trim()) { setError('Please enter a deck name.'); return; }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), topic: topic || null, flashcards }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save.'); return; }
      onSaved(data.deck);
      onClose();
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-logo">💾</div>
        <div className="modal-title">Save Your Deck</div>
        <div className="modal-subtitle">{flashcards.length} cards will be saved to your Flashboard.</div>
        <input
          className="deck-name-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="Deck name..."
          disabled={saving}
          autoFocus
        />
        {error && <div style={{ color: '#c00', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{error}</div>}
        <button className="modal-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save Deck'}
        </button>
        <button className="modal-close" onClick={onClose}>✕ Cancel</button>
      </div>
    </div>
  );
}
