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
import LimitModal from './LimitModal';

interface FlashcardGeneratorProps {
  onOpenModal?: () => void;
  topic?: string;
  hideFeatures?: boolean;
  onDeckSaved?: (deck: Deck) => void;
}

type LimitReason = 'daily' | 'generations' | 'chars';

export default function FlashcardGenerator({ topic, onOpenModal, hideFeatures, onDeckSaved }: FlashcardGeneratorProps) {
  const { user, signInWithGoogle } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitHit, setLimitHit] = useState<LimitReason | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [savedDeck, setSavedDeck] = useState<Deck | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openAuthModal = onOpenModal ?? (() => setIsModalOpen(true));

  useEffect(() => {
    if (flashcards.length === 0 || savedDeck) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [flashcards.length, savedDeck]);

  const handleSubmit = async (content: string | string[]) => {
    setIsLoading(true);
    setError(null);
    setLimitHit(null);
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
          setLimitHit(data.anonymous ? 'daily' : 'generations');
        } else if (response.status === 400 && data.error && /too long|characters/i.test(data.error)) {
          setLimitHit('chars');
        } else {
          setError(data.error || 'Something went wrong. Please try again.');
        }
        return;
      }
      setFlashcards(data.flashcards);
      setCurrentIndex(0);

      // Auto-save deck for logged-in users
      if (user) {
        const title = topic
          ? topic.charAt(0).toUpperCase() + topic.slice(1) + ' Flashcards'
          : 'My Deck';
        try {
          const saveRes = await fetch('/api/decks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, topic, flashcards: data.flashcards }),
          });
          if (saveRes.ok) {
            const saveData = await saveRes.json();
            setSavedDeck(saveData.deck);
            onDeckSaved?.(saveData.deck);
          }
        } catch {
          // Auto-save failed silently — user can still see their cards
          console.error('Auto-save failed');
        }
      }
    } catch {
      setError('Failed to connect. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFlashcards([]);
    setError(null);
    setLimitHit(null);
    setCurrentIndex(0);
    setSavedDeck(null);
  };

  const handleDownloadCSV = () => {
    const title = savedDeck?.title ?? (topic ? topic.charAt(0).toUpperCase() + topic.slice(1) + ' Flashcards' : 'My Deck');
    const rows = [
      ['Question', 'Answer'],
      ...flashcards.map(f => [f.question, f.answer]),
    ];
    const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const title = savedDeck?.title ?? (topic ? topic.charAt(0).toUpperCase() + topic.slice(1) + ' Flashcards' : 'My Deck');
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 74, 173);
    doc.text(title, 14, 18);
    doc.setDrawColor(0, 74, 173);
    doc.line(14, 22, 196, 22);

    let y = 30;
    flashcards.forEach((card) => {
      if (y > 255) { doc.addPage(); y = 20; }

      const qLines = doc.splitTextToSize(`Q: ${card.question}`, 170);
      const qHeight = Math.max(12, qLines.length * 5 + 6);
      doc.setFillColor(238, 244, 255);
      doc.setDrawColor(199, 217, 245);
      doc.roundedRect(14, y, 182, qHeight, 2, 2, 'FD');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 74, 173);
      doc.text(qLines, 18, y + 7);
      y += qHeight + 2;

      const aLines = doc.splitTextToSize(`A: ${card.answer}`, 170);
      const aHeight = Math.max(12, aLines.length * 5 + 6);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(199, 217, 245);
      doc.roundedRect(14, y, 182, aHeight, 2, 2, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 30, 50);
      doc.text(aLines, 18, y + 7);
      y += aHeight + 6;
    });

    doc.save(`${title}.pdf`);
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
              ) : !user ? (
                <button className="locked-btn" onClick={handleSaveClick}>
                  💾 Save deck <span className="locked-icon">🔒</span>
                </button>
              ) : null}
              {!user && (
                <button className="locked-btn" onClick={openAuthModal}>
                  📝 Test <span className="locked-icon">🔒</span>
                </button>
              )}
              {user ? (
                <>
                  <button className="locked-btn" onClick={handleDownloadCSV}>⬇ CSV</button>
                  <button className="locked-btn" onClick={handleDownloadPDF}>⬇ PDF</button>
                </>
              ) : (
                <button className="locked-btn" onClick={openAuthModal}>
                  ⬇️ Download <span className="locked-icon">🔒</span>
                </button>
              )}
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
          onSaved={(deck) => { setSavedDeck(deck); onDeckSaved?.(deck); }}
        />
      </>
    );
  }

  // ── INPUT ──────────────────────────────────────────
  return (
    <>
      {error && <div className="error-message">{error}</div>}

      <h2 className="section-title">Generate Flashcards</h2>
      <InputSection onSubmit={handleSubmit} isLoading={isLoading} />

      {!hideFeatures && <div className="features">
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
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Start For Free</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Generate one free deck per day without an account. Or sign up for free and save your decks to your Flashboard.</div>
        </div>
      </div>}

      <FlashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <LimitModal
        isOpen={limitHit !== null}
        onClose={() => setLimitHit(null)}
        reason={limitHit ?? 'daily'}
        onSignIn={signInWithGoogle}
      />
    </>
  );
}
