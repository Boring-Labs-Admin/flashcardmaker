'use client';
import { useState, useRef, useEffect } from 'react';
import { Deck } from '@/lib/types';

const COLORS = [
  { hex: '#EBF0FA', label: 'Blue' },
  { hex: '#E8F5E9', label: 'Green' },
  { hex: '#F3E5F5', label: 'Purple' },
  { hex: '#FFF3E0', label: 'Orange' },
  { hex: '#FCE4EC', label: 'Pink' },
  { hex: '#FFF9C4', label: 'Yellow' },
];

interface DeckCardProps {
  deck: Deck;
  onDelete: (id: string) => void;
  onStudy: (deck: Deck) => void;
  onUpdate: (id: string, updates: { title?: string; color?: string }) => void;
}

export default function DeckCard({ deck, onDelete, onStudy, onUpdate }: DeckCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(deck.title);
  const [showColors, setShowColors] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const date = new Date(deck.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const bgColor = deck.color ?? '#EBF0FA';

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(deck.title);
    setIsEditing(true);
    setShowColors(false);
  };

  const saveTitle = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== deck.title) {
      onUpdate(deck.id, { title: trimmed });
    }
    setIsEditing(false);
  };

  const handleTitleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveTitle();
    if (e.key === 'Escape') { setEditTitle(deck.title); setIsEditing(false); }
  };

  const handleColorPick = (e: React.MouseEvent, hex: string) => {
    e.stopPropagation();
    onUpdate(deck.id, { color: hex });
    setShowColors(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${deck.title}"? This cannot be undone.`)) {
      onDelete(deck.id);
    }
  };

  return (
    <div className="deck-card" style={{ backgroundColor: bgColor }}>
      <div className="deck-card-top">
        {deck.topic && <span className="deck-topic-badge">{deck.topic}</span>}
        <div className="deck-card-actions">
          <button
            className="deck-action-btn"
            onClick={startEdit}
            title="Rename deck"
          >✏️</button>
          <button
            className="deck-action-btn"
            onClick={(e) => { e.stopPropagation(); setShowColors(s => !s); setIsEditing(false); }}
            title="Change colour"
          >🎨</button>
          <button
            className="deck-delete-btn"
            onClick={handleDelete}
            title="Delete deck"
          >🗑️</button>
        </div>
      </div>

      {showColors && (
        <div className="deck-color-picker">
          {COLORS.map(c => (
            <button
              key={c.hex}
              className="deck-color-swatch"
              style={{
                backgroundColor: c.hex,
                outline: deck.color === c.hex ? '2px solid #004AAD' : '2px solid transparent',
              }}
              onClick={(e) => handleColorPick(e, c.hex)}
              title={c.label}
            />
          ))}
        </div>
      )}

      {isEditing ? (
        <input
          ref={inputRef}
          className="deck-card-title-input"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={handleTitleKey}
          maxLength={80}
        />
      ) : (
        <h3 className="deck-card-title">{deck.title}</h3>
      )}

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
