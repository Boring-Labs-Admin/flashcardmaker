'use client';

import { useState, useEffect, useCallback } from 'react';
import { Flashcard, ViewMode, Deck } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { PLANS, UserPlanData } from '@/lib/plans';
import InputSection from './InputSection';
import ViewToggle from './ViewToggle';
import SingleView from './SingleView';
import SideBySideView from './SideBySideView';
import GridView from './GridView';
import FlashboardModal from './FlashboardModal';
import SaveDeckModal from './SaveDeckModal';
import UpgradeModal from './UpgradeModal';

interface FlashcardGeneratorProps {
  onOpenModal?: () => void;
  topic?: string;
}

const ADMIN_EMAIL = 'admin@boringlabs.co.uk';

export default function FlashcardGenerator({ topic, onOpenModal }: FlashcardGeneratorProps) {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeAnonymous, setUpgradeAnonymous] = useState(false);
  const [savedDeck, setSavedDeck] = useState<Deck | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [planData, setPlanData] = useState<UserPlanData | null>(null);

  const openAuthModal = onOpenModal ?? (() => setIsModalOpen(true));
  const isAdmin = user?.email === ADMIN_EMAIL;

  const fetchPlan = useCallback(async () => {
    if (!user || isAdmin) return;
    try {
      const res = await fetch('/api/user/plan');
      if (res.ok) {
        const data = await res.json();
        if (!data.anonymous) setPlanData(data as UserPlanData);
      }
    } catch {
      // non-critical — silently fail
    }
  }, [user, isAdmin]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const handleSubmit = async (content: string | string[]) => {
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
          setUpgradeAnonymous(!!data.anonymous);
          setIsUpgradeModalOpen(true);
        } else {
          setError(data.error || 'Something went wrong. Please try again.');
        }
        return;
      }
      setFlashcards(data.flashcards);
      setCurrentIndex(0);
      // Refresh plan count after a successful generation
      fetchPlan();
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

  // Plan limits to pass to InputSection
  const charLimit = isAdmin ? PLANS.plus.charLimit : (planData?.plan === 'plus' ? PLANS.plus.charLimit : PLANS.free.charLimit);
  const fileLimit = isAdmin ? PLANS.plus.fileLimit : (planData?.plan === 'plus' ? PLANS.plus.fileLimit : PLANS.free.fileLimit);

  // Generation count label for logged-in free users
  const genCountLabel = (() => {
    if (!user || isAdmin || planData?.plan === 'plus') return null;
    if (!planData) return null;
    const total = (planData.free_banked ?? 0) + (planData.paid_credits ?? 0);
    if (total === 0) return { text: 'No generations remaining', warn: true };
    const parts: string[] = [];
    if (planData.free_banked > 0) parts.push(`${planData.free_banked} free banked`);
    if (planData.paid_credits > 0) parts.push(`${planData.paid_credits} credit${planData.paid_credits !== 1 ? 's' : ''}`);
    return { text: parts.join(' · '), warn: false };
  })();

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
      {error && <div className="error-message">{error}</div>}

      <InputSection
        onSubmit={handleSubmit}
        isLoading={isLoading}
        charLimit={charLimit}
        fileLimit={fileLimit}
      />

      {/* Generation count for logged-in free users */}
      {genCountLabel && (
        <div style={{ textAlign: 'center', fontSize: '0.82rem', marginTop: '0.75rem', opacity: genCountLabel.warn ? 1 : 0.6 }}>
          {genCountLabel.warn ? (
            <>
              <span style={{ color: '#c00' }}>No generations remaining — </span>
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                style={{ background: 'none', border: 'none', color: '#004AAD', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 700, padding: 0, textDecoration: 'underline' }}
              >
                upgrade
              </button>
            </>
          ) : (
            <>
              {genCountLabel.text}
              {' · '}
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                style={{ background: 'none', border: 'none', color: '#004AAD', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}
              >
                get more
              </button>
            </>
          )}
        </div>
      )}

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
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        anonymous={upgradeAnonymous}
      />
    </>
  );
}
