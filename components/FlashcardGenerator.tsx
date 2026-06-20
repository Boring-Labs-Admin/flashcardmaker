'use client';

import { useState, useEffect, useRef } from 'react';
import posthog from 'posthog-js';
import { Check, Save, Lock, ClipboardCheck, Download, Trash2, Files, Zap, Target } from 'lucide-react';
import { Flashcard, ViewMode, Deck } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { PLANS, UserPlanData } from '@/lib/plans';
import InputSection, { InputSectionHandle } from './InputSection';
import ViewToggle from './ViewToggle';
import SingleView from './SingleView';
import SideBySideView from './SideBySideView';
import GridView from './GridView';
import FlashboardModal, { FlashboardModalReason } from './FlashboardModal';
import SaveDeckModal from './SaveDeckModal';
import LimitModal from './LimitModal';
import DownloadModal from './DownloadModal';
import GeneratingLoader from './GeneratingLoader';

interface FlashcardGeneratorProps {
  onOpenModal?: (reason?: FlashboardModalReason) => void;
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
  const [charsOver, setCharsOver] = useState<number>(0);
  const [charLimit, setCharLimit] = useState<number>(PLANS.free.charLimit);
  const [isPlusUser, setIsPlusUser] = useState(false);
  const inputRef = useRef<InputSectionHandle>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState<FlashboardModalReason>('generic');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [savedDeck, setSavedDeck] = useState<Deck | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openAuthModal = onOpenModal ?? ((reason: FlashboardModalReason = 'generic') => {
    setModalReason(reason);
    setIsModalOpen(true);
  });

  useEffect(() => {
    fetch('/api/user/plan')
      .then(r => r.json())
      .then((data: UserPlanData) => {
        const plan = data.anonymous ? 'free' : data.plan;
        setCharLimit(PLANS[plan].charLimit);
        setIsPlusUser(!data.anonymous && data.plan === 'plus');
      })
      .catch(() => {}); // silently fail — default free limit already set
  }, []);

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
    posthog.capture('generate_clicked', { mode: 'content' });
    setIsLoading(true);
    setError(null);
    setLimitHit(null);
    setCharsOver(0);
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
          setCharsOver(data.charsOver ?? 0);
          setLimitHit('chars');
        } else {
          setError(data.error || 'Something went wrong. Please try again.');
        }
        return;
      }
      setFlashcards(data.flashcards);
      setCurrentIndex(0);
      posthog.capture('deck_generated', { mode: 'content', cardCount: data.flashcards.length, loggedIn: !!user });

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

  const handlePromptSubmit = async (prompt: string) => {
    posthog.capture('generate_clicked', { mode: 'prompt' });
    setIsLoading(true);
    setError(null);
    setLimitHit(null);
    setCharsOver(0);
    setSavedDeck(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '', topic: prompt, generationMode: 'prompt' }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setFlashcards(data.flashcards);
      setCurrentIndex(0);
      posthog.capture('deck_generated', { mode: 'prompt', cardCount: data.flashcards.length, loggedIn: !!user });

      if (user) {
        try {
          const saveRes = await fetch('/api/decks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: prompt.charAt(0).toUpperCase() + prompt.slice(1), topic: prompt, flashcards: data.flashcards }),
          });
          if (saveRes.ok) {
            const saveData = await saveRes.json();
            setSavedDeck(saveData.deck);
            onDeckSaved?.(saveData.deck);
          }
        } catch {
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

    const MARGIN = 14;
    const GAP = 8;
    const COL_W = (210 - MARGIN * 2 - GAP) / 2; // ~87mm each
    const Q_X = MARGIN;
    const A_X = MARGIN + COL_W + GAP;
    const LINE_H = 5;
    const CELL_PAD = 5;

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 74, 173);
    doc.text(title, MARGIN, 18);
    doc.setDrawColor(0, 74, 173);
    doc.line(MARGIN, 22, 210 - MARGIN, 22);

    // Column headers
    let y = 30;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 74, 173);
    doc.setFillColor(220, 234, 255);
    doc.setDrawColor(199, 217, 245);
    doc.roundedRect(Q_X, y, COL_W, 8, 1, 1, 'FD');
    doc.roundedRect(A_X, y, COL_W, 8, 1, 1, 'FD');
    doc.text('QUESTION', Q_X + CELL_PAD, y + 5.5);
    doc.text('ANSWER', A_X + CELL_PAD, y + 5.5);
    y += 11;

    // Rows
    doc.setFontSize(9);
    flashcards.forEach((card, i) => {
      const qLines = doc.splitTextToSize(card.question, COL_W - CELL_PAD * 2);
      const aLines = doc.splitTextToSize(card.answer, COL_W - CELL_PAD * 2);
      const rowH = Math.max(qLines.length, aLines.length) * LINE_H + CELL_PAD * 2;

      if (y + rowH > 282) { doc.addPage(); y = 20; }

      const rowBg = i % 2 === 0 ? [248, 250, 255] : [255, 255, 255];
      doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
      doc.setDrawColor(220, 228, 242);
      doc.roundedRect(Q_X, y, COL_W, rowH, 1, 1, 'FD');
      doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
      doc.roundedRect(A_X, y, COL_W, rowH, 1, 1, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 20, 40);
      doc.text(qLines, Q_X + CELL_PAD, y + CELL_PAD + LINE_H - 1);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 70);
      doc.text(aLines, A_X + CELL_PAD, y + CELL_PAD + LINE_H - 1);

      y += rowH + 2;
    });

    doc.save(`${title}.pdf`);
  };

  const handleSaveClick = () => {
    if (user) {
      setIsSaveModalOpen(true);
    } else {
      posthog.capture('save_prompt_shown', { reason: 'save' });
      openAuthModal('save');
    }
  };

  const handleTestClick = () => {
    posthog.capture('save_prompt_shown', { reason: 'test' });
    openAuthModal('test');
  };

  // ── LOADING ──────────────────────────────────────────
  if (isLoading) {
    return <GeneratingLoader />;
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
                <span className="saved-indicator"><Check size={15} strokeWidth={2.5} /> Saved to Flashboard</span>
              ) : !user ? (
                <button className="locked-btn" onClick={handleSaveClick} title="Create a free account to save this deck forever">
                  <Save size={15} /> Save forever <span className="locked-icon"><Lock size={12} /></span>
                </button>
              ) : null}
              {!user && (
                <button className="locked-btn" onClick={handleTestClick} title="Create a free account to test yourself on this deck">
                  <ClipboardCheck size={15} /> Test yourself <span className="locked-icon"><Lock size={12} /></span>
                </button>
              )}
              <button className="locked-btn" onClick={() => setIsDownloadModalOpen(true)}><Download size={15} /> Download</button>
              <button className="reset-btn" onClick={handleReset}>
                <Trash2 size={15} /> New deck
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

        <FlashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} reason={modalReason} />
        <DownloadModal
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
          onDownloadPDF={handleDownloadPDF}
          onDownloadCSV={handleDownloadCSV}
          isLoggedIn={!!user}
          onSignIn={() => { setIsDownloadModalOpen(false); openAuthModal(); }}
        />
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

      {!hideFeatures && <h2 className="section-title">Generate Flashcards</h2>}
      <InputSection
        ref={inputRef}
        onSubmit={handleSubmit}
        onPromptSubmit={handlePromptSubmit}
        isLoading={isLoading}
        charLimit={charLimit}
        isPlusUser={isPlusUser}
        isLoggedIn={!!user}
      />

      {!hideFeatures && <div className="features">
        <div className="feature">
          <div style={{ marginBottom: '1rem' }}><Files size={40} strokeWidth={1.75} /></div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Works With Anything</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Documents, notes, photos, PDFs — just upload and go</div>
        </div>
        <div className="feature">
          <div style={{ marginBottom: '1rem' }}><Zap size={40} strokeWidth={1.75} /></div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Instant Results</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Your full deck ready in seconds, no effort required</div>
        </div>
        <div className="feature">
          <div style={{ marginBottom: '1rem' }}><Target size={40} strokeWidth={1.75} /></div>
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
        charsOver={charsOver}
        onTrimText={limitHit === 'chars' ? () => {
          inputRef.current?.trimToLimit();
          setLimitHit(null);
        } : undefined}
      />
    </>
  );
}
