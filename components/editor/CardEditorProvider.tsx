'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { Flashcard } from '@/lib/types';
import { useDashboard } from '@/lib/dashboard-context';

export type EditorMode = 'simple' | 'advanced' | 'source';
export type EditorTab = 'preview' | 'edit' | 'browse';

const AUTOSAVE_DEBOUNCE_MS = 1000;
const UNDO_STACK_LIMIT = 20;

interface CardEditorContextType {
  deckId: string;
  deckTitle: string;
  cards: Flashcard[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  selectedIndices: Set<number>;
  toggleSelect: (i: number, checked: boolean) => void;
  selectAll: () => void;
  clearSelection: () => void;
  mode: EditorMode;
  setMode: (m: EditorMode) => void;
  tab: EditorTab;
  setTab: (t: EditorTab) => void;
  updateCard: (index: number, updates: Partial<Flashcard>) => void;
  addCard: () => number;
  deleteCard: (index: number) => void;
  duplicateCard: (index: number) => void;
  bulkDelete: (indices: number[]) => void;
  bulkDuplicate: (indices: number[]) => void;
  bulkMove: (indices: number[], targetDeckId: string) => Promise<boolean>;
  replaceAllCards: (cards: Flashcard[]) => void;
  appendCards: (cards: Flashcard[]) => void;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  saving: boolean;
  saveNow: () => void;
  discardChanges: () => void;
  undo: () => void;
  canUndo: boolean;
}

const CardEditorContext = createContext<CardEditorContextType | null>(null);

let cardIdCounter = 0;
function newCardId() {
  cardIdCounter += 1;
  return `new-${Date.now()}-${cardIdCounter}`;
}

export function CardEditorProvider({
  deckId,
  deckTitle,
  initialCards,
  children,
}: {
  deckId: string;
  deckTitle: string;
  initialCards: Flashcard[];
  children: ReactNode;
}) {
  const { handleDeckLocalUpdate, decks } = useDashboard();
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [mode, setModeState] = useState<EditorMode>('simple');
  const [tab, setTab] = useState<EditorTab>('edit');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [undoStack, setUndoStack] = useState<Flashcard[][]>([]);

  const lastSavedCardsRef = useRef<Flashcard[]>(initialCards);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUndoPushRef = useRef(0);
  const UNDO_CHECKPOINT_MS = 1500;

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('card_editor_mode') : null;
    if (stored === 'simple' || stored === 'advanced' || stored === 'source') setModeState(stored);
  }, []);

  const setMode = (m: EditorMode) => {
    setModeState(m);
    localStorage.setItem('card_editor_mode', m);
  };

  // Structural edits (add/delete/duplicate/import) always get an undo checkpoint.
  const pushUndo = (snapshot: Flashcard[]) => {
    setUndoStack(prev => [...prev.slice(-(UNDO_STACK_LIMIT - 1)), snapshot]);
    lastUndoPushRef.current = Date.now();
  };

  // Field edits (typing) only get a checkpoint once per ~1.5s — otherwise every
  // keystroke would push a snapshot and Ctrl+Z would only ever rewind one character.
  const pushUndoThrottled = (snapshot: Flashcard[]) => {
    if (Date.now() - lastUndoPushRef.current < UNDO_CHECKPOINT_MS) return;
    pushUndo(snapshot);
  };

  const mutate = (next: Flashcard[], recordUndo = true) => {
    if (recordUndo) pushUndo(cards);
    setCards(next);
    setHasUnsavedChanges(true);
  };

  const updateCard = (index: number, updates: Partial<Flashcard>) => {
    pushUndoThrottled(cards);
    setCards(prev => prev.map((c, i) => i === index ? { ...c, ...updates } : c));
    setHasUnsavedChanges(true);
  };

  const addCard = (): number => {
    const card: Flashcard = { id: newCardId(), question: '', answer: '' };
    mutate([...cards, card]);
    return cards.length;
  };

  const deleteCard = (index: number) => {
    mutate(cards.filter((_, i) => i !== index));
    setSelectedIndices(prev => {
      const next = new Set(Array.from(prev).filter(i => i !== index).map(i => i > index ? i - 1 : i));
      return next;
    });
    setActiveIndex(i => Math.max(0, Math.min(i, cards.length - 2)));
  };

  const duplicateCard = (index: number) => {
    const card = cards[index];
    if (!card) return;
    const copy: Flashcard = { ...card, id: newCardId() };
    const next = [...cards.slice(0, index + 1), copy, ...cards.slice(index + 1)];
    mutate(next);
  };

  const bulkDelete = (indices: number[]) => {
    const toRemove = new Set(indices);
    mutate(cards.filter((_, i) => !toRemove.has(i)));
    clearSelection();
  };

  const bulkDuplicate = (indices: number[]) => {
    const sorted = [...indices].sort((a, b) => a - b);
    const next = [...cards];
    let offset = 1;
    sorted.forEach(i => {
      const card = cards[i];
      if (!card) return;
      next.splice(i + offset, 0, { ...card, id: newCardId() });
      offset += 1;
    });
    mutate(next);
    clearSelection();
  };

  const bulkMove = async (indices: number[], targetDeckId: string): Promise<boolean> => {
    const toMove = indices.map(i => cards[i]).filter(Boolean);
    if (toMove.length === 0) return false;

    const targetDeck = decks.find(d => d.id === targetDeckId);
    if (!targetDeck) return false;

    try {
      const res = await fetch('/api/decks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: targetDeckId, flashcards: [...targetDeck.flashcards, ...toMove.map(c => ({ ...c, id: newCardId() }))] }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      handleDeckLocalUpdate(data.deck);
    } catch {
      return false;
    }

    bulkDelete(indices);
    return true;
  };

  const replaceAllCards = (next: Flashcard[]) => mutate(next);
  const appendCards = (extra: Flashcard[]) => mutate([...cards, ...extra]);

  const toggleSelect = (i: number, checked: boolean) => {
    setSelectedIndices(prev => {
      const next = new Set(prev);
      if (checked) next.add(i); else next.delete(i);
      return next;
    });
  };
  const selectAll = () => setSelectedIndices(new Set(cards.map((_, i) => i)));
  const clearSelection = () => setSelectedIndices(new Set());

  const doSave = async (toSave: Flashcard[]) => {
    setSaving(true);
    try {
      const res = await fetch('/api/decks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deckId, flashcards: toSave }),
      });
      if (res.ok) {
        const data = await res.json();
        lastSavedCardsRef.current = toSave;
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        handleDeckLocalUpdate(data.deck);
      }
    } catch {
      // Non-fatal — autosave will retry on the next change, and the user can hit Save manually
    } finally {
      setSaving(false);
    }
  };

  // Debounced autosave — 1s after the last change
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => doSave(cards), AUTOSAVE_DEBOUNCE_MS);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, hasUnsavedChanges]);

  const saveNow = () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    doSave(cards);
  };

  const discardChanges = () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setCards(lastSavedCardsRef.current);
    setHasUnsavedChanges(false);
  };

  const undo = () => {
    setUndoStack(prev => {
      if (prev.length === 0) return prev;
      const snapshot = prev[prev.length - 1];
      setCards(snapshot);
      setHasUnsavedChanges(true);
      return prev.slice(0, -1);
    });
  };

  return (
    <CardEditorContext.Provider
      value={{
        deckId,
        deckTitle,
        cards,
        activeIndex,
        setActiveIndex,
        selectedIndices,
        toggleSelect,
        selectAll,
        clearSelection,
        mode,
        setMode,
        tab,
        setTab,
        updateCard,
        addCard,
        deleteCard,
        duplicateCard,
        bulkDelete,
        bulkDuplicate,
        bulkMove,
        replaceAllCards,
        appendCards,
        lastSaved,
        hasUnsavedChanges,
        saving,
        saveNow,
        discardChanges,
        undo,
        canUndo: undoStack.length > 0,
      }}
    >
      {children}
    </CardEditorContext.Provider>
  );
}

export function useCardEditor() {
  const ctx = useContext(CardEditorContext);
  if (!ctx) throw new Error('useCardEditor must be used within a CardEditorProvider');
  return ctx;
}
