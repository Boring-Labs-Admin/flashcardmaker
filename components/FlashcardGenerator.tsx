'use client';

import { useState, useEffect } from 'react';
import { Flashcard, ViewMode, Deck } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import InputSection from './InputSection';
import ViewToggle from './ViewToggle';
import SingleView from './SingleView';
import SideBySideView from './SideBySideView';
import GridView from './GridView';
import FlashboardModal from './FlashboardModal';
import SaveDeckModal from './SaveDeckModal';

interface FlashcardGeneratorProps {
  onOpenModal?: () => void;
  topic?: string;
}

export default function FlashcardGenerator({ topic, onOpenModal }: FlashcardGeneratorProps) {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [savedDeck, setSavedDeck] = useState<Deck | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openAuthModal = onOpenModal ?? (() => setIsModalOpen(true));

  useEffect(() => {
    try {
      const lastDate = localStorage.getItem('fcm_last_generation');
      const today = new Date().toISOString().split('T')[0];
      if (lastDate === today) setIsRateLimited(true);
    } catch {
      // localStorage unavailable (private browsing, SSR, etc.)
    }
  }, []);

  const handleSubmit = async (content: string | string[]) => {
    if (isRateLimited) {
      setError("You've created your free deck for today. Come back tomorrow.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSavedDeck(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, topic }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 429) {
          setIsRateLimited(true);
          setError("You've created your free deck for today. Come back tomorrow.");
        } else {
          setError(data.error || 'Something went wrong. Please try again.');
        }
        return;
      }
      setFlashcards(data.flashcards);
      setCurrentIndex(0);
      try {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('fcm_last_generation', today);
      } catch {
        // localStorage unavailable
      }
      setIsRateLimited(true);
    } catch {
      setError('Failed to connect. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFlashcards([]);
    setError(null);
    setCurrentIndex(0);
    setSavedDeck(null);
  };

  const handleSaveClick = () => {
    if (user) {
      setIsSaveModalOpen(true);
    } else {
      openAuthModal();
    }
  };

  // ── LOADING ──────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner">⚡</div>
        <h2 style={{ fontSize: '2rem', marginTop: '1rem' }}>Creating Your Flashcards</h2>
        <p style={{ opacity: 0.7 }}>Reading your content and building your deck...</p>
      </div>
    );
  }

  // ── RESULTS ──────────────────────────────────────────
  if (flashcards.length > 0) {
    return (
      <>
        <div className="tool-panel">
          {/* Toolbar */}
          <div className="tool-toolbar">
            <div className="tool-toolbar-left">
              <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
              {viewMode === 'single' && (
                <span className="progress">
                  Card {currentIndex + 1} of {flashcards.length}
                </span>
              )}
            </div>
            <div className="tool-toolbar-right">
              {savedDeck ? (
                <span className="saved-indicator">✓ Saved to Flashboard</span>
              ) : (
                <button className="locked-btn" onClick={handleSaveClick}>
                  💾 Save deck {!user && <span className="locked-icon">🔒</span>}
                </button>
              )}
              <button className="locked-btn" onClick={openAuthModal}>
                ⬇️ Download {!user && <span className="locked-icon">🔒</span>}
              </button>
              <button className="reset-btn" onClick={handleReset}>
                🗑️ New deck
              </button>
            </div>
          </div>

          {/* Viewport */}
          <div className="tool-viewport">
            {viewMode === 'single' && (
              <SingleView
                flashcards={flashcards}
                currentIndex={currentIndex}
                onNext={() => setCurrentIndex(i => Math.min(i + 1, flashcards.length - 1))}
                onPrevious={() => setCurrentIndex(i => Math.max(i - 1, 0))}
              />
            )}
            {viewMode === 'side-by-side' && <SideBySideView flashcards={flashcards} />}
            {viewMode === 'grid' && <GridView flashcards={flashcards} />}
          </div>
        </div>

        <FlashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <SaveDeckModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          flashcards={flashcards}
          topic={topic}
          onSaved={(deck) => setSavedDeck(deck)}
        />
      </>
    );
  }

  // ── INPUT ──────────────────────────────────────────
  return (
    <>
      {isRateLimited && (
        <div className="limit-banner">
          <strong>You've created your free deck for today.</strong> Come back tomorrow.
        </div>
      )}
      {error && <div className="error-message">{error}</div>}

      <InputSection onSubmit={handleSubmit} isLoading={isLoading} />

      <div className="features">
        <div className="feature">
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📚</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Works With Anything</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Documents, notes, photos, PDFs — just upload and go</div>
        </div>
        <div className="feature">
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Instant Results</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Your full deck ready in seconds, no effort required</div>
        </div>
        <div className="feature">
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>100% Free</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>One free deck per day, no account needed</div>
        </div>
      </div>

      <FlashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
