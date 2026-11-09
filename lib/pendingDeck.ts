import type { Flashcard } from '@/lib/types';

// A generated deck a logged-out visitor tried to save. Kept in this browser only, so it survives
// the trip to /login (or the Google round-trip) and is saved to their account once they're in.
const KEY = 'pending_deck';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export interface PendingDeck {
  title: string;
  topic: string | null;
  flashcards: Flashcard[];
  savedAt: number;
}

export function stashPendingDeck(flashcards: Flashcard[], topic?: string) {
  try {
    const title = topic ? `${topic.charAt(0).toUpperCase() + topic.slice(1)} Flashcards` : 'My Deck';
    const deck: PendingDeck = { title, topic: topic || null, flashcards, savedAt: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(deck));
  } catch {
    // Storage blocked or full: the user simply won't get the deck restored.
  }
}

// Reads and removes the stash. Returns null if there is none, it is stale, or it is malformed.
export function takePendingDeck(): PendingDeck | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    localStorage.removeItem(KEY);
    const deck = JSON.parse(raw) as PendingDeck;
    if (!deck || !Array.isArray(deck.flashcards) || deck.flashcards.length === 0) return null;
    if (Date.now() - (deck.savedAt || 0) > MAX_AGE_MS) return null;
    return deck;
  } catch {
    return null;
  }
}

export function restorePendingDeck(deck: PendingDeck) {
  try {
    localStorage.setItem(KEY, JSON.stringify(deck));
  } catch {
    // ignore
  }
}
