'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Layers } from 'lucide-react';
import { Deck, ViewMode } from '@/lib/types';
import { useDashboard } from '@/lib/dashboard-context';
import DeckCard from '@/components/DeckCard';
import SingleView from '@/components/SingleView';
import SideBySideView from '@/components/SideBySideView';
import GridView from '@/components/GridView';
import ViewToggle from '@/components/ViewToggle';

export default function YourFlashcardsPage() {
  const router = useRouter();
  const { decks, fetching, deleteError, handleDelete, handleDeckUpdate } = useDashboard();
  const [studyingDeck, setStudyingDeck] = useState<Deck | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('single');

  const handleStudy = (deck: Deck) => {
    setStudyingDeck(deck);
    setCurrentIndex(0);
    setViewMode('single');
  };

  // Test still launches immediately — Test Yourself is for picking a deck when one isn't already chosen
  const handleTest = (deck: Deck) => {
    router.push(`/dashboard/test?deckId=${deck.id}`);
  };

  if (studyingDeck) {
    return (
      <div className="container">
        <div className="dashboard-study-header">
          <button className="back-btn" onClick={() => setStudyingDeck(null)}>← Back to Your Flashcards</button>
          <h2 className="dashboard-study-title">{studyingDeck.title}</h2>
        </div>
        <div className="tool-panel">
          <div className="tool-toolbar">
            <div className="tool-toolbar-left">
              <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
              {viewMode === 'single' && (
                <span className="progress">Card {currentIndex + 1} of {studyingDeck.flashcards.length}</span>
              )}
            </div>
          </div>
          <div className="tool-viewport">
            {viewMode === 'single' && (
              <SingleView
                flashcards={studyingDeck.flashcards}
                currentIndex={currentIndex}
                onNext={() => setCurrentIndex(i => Math.min(i + 1, studyingDeck.flashcards.length - 1))}
                onPrevious={() => setCurrentIndex(i => Math.max(i - 1, 0))}
              />
            )}
            {viewMode === 'side-by-side' && <SideBySideView flashcards={studyingDeck.flashcards} />}
            {viewMode === 'grid' && <GridView flashcards={studyingDeck.flashcards} />}
          </div>
        </div>
      </div>
    );
  }

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
