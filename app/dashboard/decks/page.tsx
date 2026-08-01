'use client';

import { useRouter } from 'next/navigation';
import { Loader2, Layers } from 'lucide-react';
import { Deck } from '@/lib/types';
import { useDashboard } from '@/lib/dashboard-context';
import DeckCard from '@/components/DeckCard';

export default function YourFlashcardsPage() {
  const router = useRouter();
  const { decks, fetching, deleteError, handleDelete, handleDeckUpdate } = useDashboard();

  // Study now launches the Confidence-Based Repetition session at /dashboard/study
  const handleStudy = (deck: Deck) => {
    router.push(`/dashboard/study?deckId=${deck.id}`);
  };

  // Test still launches immediately — Test Yourself is for picking a deck when one isn't already chosen
  const handleTest = (deck: Deck) => {
    router.push(`/dashboard/test?deckId=${deck.id}`);
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="dashboard-page-title">Your Flashcards</h1>
        <p className="dashboard-page-subtitle">
          {fetching ? 'Loading your decks...' : `${decks.length} deck${decks.length !== 1 ? 's' : ''} saved`}
        </p>
      </div>

      {deleteError && <div className="error-message">{deleteError}</div>}

      {fetching ? (
        <div className="loading">
          <div className="spinner"><Loader2 size={40} strokeWidth={2} /></div>
          <p style={{ opacity: 0.7, marginTop: '1rem' }}>Loading your decks...</p>
        </div>
      ) : decks.length === 0 ? (
        <div className="dashboard-empty">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--cobalt-blue)', opacity: 0.5 }}><Layers size={64} strokeWidth={1.5} /></div>
          <h2 style={{ marginBottom: '0.5rem' }}>No decks saved yet</h2>
          <p style={{ opacity: 0.7 }}>Generate a deck under Create Flashcards to get started.</p>
        </div>
      ) : (
        <div className="deck-grid">
          {decks.map(deck => (
            <DeckCard key={deck.id} deck={deck} onDelete={handleDelete} onStudy={handleStudy} onTest={handleTest} onUpdate={handleDeckUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
