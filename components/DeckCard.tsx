'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Palette, Trash2, Zap, ListChecks, FolderInput } from 'lucide-react';
import { Deck, DeckMastery, ClassSummary } from '@/lib/types';
import MasteryRing from '@/components/MasteryRing';
import DeckHoverCard from '@/components/DeckHoverCard';
import ClassCoverIcon from '@/components/class/ClassCoverIcon';

const HOVER_DELAY_MS = 300;

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
  onUpdate: (id: string, updates: { title?: string; color?: string; classId?: string | null }) => void;
  sets?: ClassSummary[];
}

export default function DeckCard({ deck, onDelete, onStudy, onUpdate, sets }: DeckCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(deck.title);
  const [showColors, setShowColors] = useState(false);
  const [showSetPicker, setShowSetPicker] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showHoverCard, setShowHoverCard] = useState(false);
  const [hoverMastery, setHoverMastery] = useState<DeckMastery | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setShowSetPicker(false);
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

  const handleAssignSet = (e: React.MouseEvent, classId: string | null) => {
    e.stopPropagation();
    onUpdate(deck.id, { classId });
    setShowSetPicker(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(true);
    setShowColors(false);
    setShowSetPicker(false);
    setIsEditing(false);
  };

  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setShowHoverCard(true);
      if (!hoverMastery) {
        fetch(`/api/decks/${deck.id}/mastery`)
          .then(r => r.json())
          .then(data => { if (!data.error) setHoverMastery(data); })
          .catch(() => {});
      }
    }, HOVER_DELAY_MS);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setShowHoverCard(false);
  };

  return (
    <div
      className="deck-card"
      style={{ backgroundColor: bgColor }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!!deck.mastery_pct && deck.mastery_pct > 0 && (
        <div className="deck-mastery-ring-corner"><MasteryRing pct={deck.mastery_pct} size={40} strokeWidth={4} /></div>
      )}

      <div className="deck-card-top">
        {deck.topic && <span className="deck-topic-badge">{deck.topic}</span>}
        <div className="deck-card-actions">
          <button
            className="deck-action-btn"
            onClick={startEdit}
            title="Rename deck"
          ><Pencil size={15} /></button>
          <button
            className="deck-action-btn"
            onClick={(e) => { e.stopPropagation(); setShowColors(s => !s); setIsEditing(false); setShowSetPicker(false); }}
            title="Change colour"
          ><Palette size={15} /></button>
          {sets && (
            <button
              className="deck-action-btn"
              onClick={(e) => { e.stopPropagation(); setShowSetPicker(s => !s); setIsEditing(false); setShowColors(false); }}
              title="Assign to a set"
            ><FolderInput size={15} /></button>
          )}
          <button
            className="deck-delete-btn"
            onClick={handleDelete}
            title="Delete deck"
          ><Trash2 size={15} /></button>
        </div>
      </div>

      {showSetPicker && sets && (
        <div className="deck-set-picker" onClick={e => e.stopPropagation()}>
          <span className="deck-set-picker-label">Assign to a set</span>
          <div className="deck-set-picker-list">
            {deck.class_id && (
              <button className="deck-set-picker-item" onClick={e => handleAssignSet(e, null)}>Uncategorised</button>
            )}
            {sets.filter(s => s.id !== deck.class_id).map(s => (
              <button key={s.id} className="deck-set-picker-item" onClick={e => handleAssignSet(e, s.id)}>
                <ClassCoverIcon coverColor={s.cover_color} coverEmoji={s.cover_emoji} size={18} />
                {s.title}
              </button>
            ))}
            {sets.length === 0 && <p className="deck-set-picker-empty">No sets yet — create one first.</p>}
          </div>
        </div>
      )}

      {showHoverCard && !isEditing && !showColors && !showSetPicker && !confirmDelete && (
        <DeckHoverCard
          deck={deck}
          mastery={hoverMastery}
          onSelect={() => { setShowHoverCard(false); router.push(`/dashboard/decks/${deck.id}/edit`); }}
          onStudy={() => { setShowHoverCard(false); onStudy(deck); }}
        />
      )}

      {confirmDelete && (
        <div className="deck-confirm-delete">
          <span>Delete this deck?</span>
          <button
            className="deck-confirm-yes"
            onClick={(e) => { e.stopPropagation(); onDelete(deck.id); }}
          >Delete</button>
          <button
            className="deck-confirm-no"
            onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
          >Cancel</button>
        </div>
      )}

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

      {!!deck.mastery_pct && deck.mastery_pct > 0 && (
        <div className="deck-mastery">
          <div className="deck-mastery-track">
            <div className="deck-mastery-fill" style={{ width: `${Math.min(100, deck.mastery_pct)}%` }} />
          </div>
          <span className="deck-mastery-pct">{deck.mastery_pct.toFixed(0)}% mastery</span>
        </div>
      )}
      <div className="deck-btn-row">
        <button className="btn deck-study-btn" onClick={() => onStudy(deck)}><Zap size={15} /> Study</button>
        <button className="deck-action-btn deck-edit-cards-btn" onClick={() => router.push(`/dashboard/decks/${deck.id}/edit`)} title="Edit cards">
          <ListChecks size={15} />
        </button>
      </div>
    </div>
  );
}
