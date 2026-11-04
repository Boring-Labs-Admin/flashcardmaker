'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, ArrowLeft, Plus, FileText, UploadCloud, Wand2, Sparkles, X } from 'lucide-react';
import CreateFromSource from '@/components/dashboard/CreateFromSource';
import CreateDeckModal from '@/components/class/CreateDeckModal';
import { useDashboard } from '@/lib/dashboard-context';
import { Deck } from '@/lib/types';
import { parseImportText, ImportDelimiter } from '@/lib/importParser';

type View = 'chooser' | 'import' | 'paste' | 'upload' | 'topic';

const DELIMITER_OPTIONS: { value: ImportDelimiter; label: string }[] = [
  { value: 'tab', label: 'Tab-separated (Question [TAB] Answer)' },
  { value: 'comma', label: 'Comma-separated (Question, Answer)' },
  { value: 'newline-pair', label: 'Paragraph pairs (Question [blank line] Answer)' },
];

function CreateFlashcardsContent() {
  const { handleDeckSaved, classes, refetchClasses, planData, setUpgradeOpen } = useDashboard();
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlClassId = searchParams.get('classId');
  const startParam = searchParams.get('start');
  const isPlus = planData?.plan === 'plus';

  // The Set (if any) comes from the URL, e.g. when arriving from a Set page.
  const selectedClassId = urlClassId;
  const [showManualModal, setShowManualModal] = useState(false);
  const [showTopicUpgrade, setShowTopicUpgrade] = useState(false);
  const [view, setView] = useState<View>(startParam === 'notes' ? 'paste' : 'chooser');
  const [savedTo, setSavedTo] = useState<{ deckTitle: string; className: string | null } | null>(null);

  const [importTitle, setImportTitle] = useState('');
  const [importDelimiter, setImportDelimiter] = useState<ImportDelimiter>('tab');
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');

  const parsedCards = useMemo(() => parseImportText(importText, importDelimiter), [importText, importDelimiter]);

  // Free users get an upgrade card instead of the topic generator.
  const openTopic = () => {
    if (isPlus) setView('topic');
    else setShowTopicUpgrade(true);
  };

  useEffect(() => {
    // Plan data loads asynchronously — if it turns out the user is Plus, drop the upgrade card.
    if (isPlus) setShowTopicUpgrade(false);
    if (startParam === 'topic') openTopic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startParam, isPlus]);

  const attachToClass = async (deck: Deck) => {
    if (selectedClassId) {
      try {
        await fetch('/api/decks', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: deck.id, classId: selectedClassId }),
        });
        await refetchClasses();
      } catch {
        // Non-fatal — deck is still saved, just not attached to the class
      }
    }
    const className = selectedClassId ? classes.find(c => c.id === selectedClassId)?.title ?? null : null;
    setSavedTo({ deckTitle: deck.title, className });
  };

  const handleImportCreate = async () => {
    if (!importTitle.trim() || parsedCards.length === 0) return;
    setImporting(true);
    setImportError('');
    try {
      const res = await fetch('/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: importTitle.trim(), flashcards: parsedCards, classId: selectedClassId }),
      });
      const data = await res.json();
      if (!res.ok) { setImportError(data.error || 'Import failed.'); return; }
      handleDeckSaved(data.deck);
      setSavedTo(null);
      await attachToClass(data.deck);
      setImportTitle('');
      setImportText('');
      setView('chooser');
    } catch {
      setImportError('Import failed. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="dashboard-page-title">Create Flashcards</h1>
        <p className="dashboard-page-subtitle">Type your own cards, turn your notes into a deck, or generate one from a topic.</p>
      </div>

      {savedTo && (
        <div className="create-saved-banner">
          <CheckCircle2 size={18} />
          <span>
            <b>{savedTo.deckTitle}</b> saved{savedTo.className ? <> to <b>{savedTo.className}</b></> : ' — uncategorised'}.
          </span>
          {selectedClassId ? (
            <button className="btn-outline" onClick={() => router.push(`/dashboard/classes/${selectedClassId}`)}>View Set</button>
          ) : (
            <button className="btn-outline" onClick={() => router.push('/dashboard/decks')}>View Your Flashcards</button>
          )}
        </div>
      )}

      {view === 'chooser' && (
        <div className="create-flashcards-card">
          <div className="modal-title" style={{ textAlign: 'center' }}>How do you want to make your cards?</div>
          <div className="make-options">
            <button className="make-option make-option-manual" onClick={() => setShowManualModal(true)}>
              <Plus size={26} />
              <b>Type them yourself</b>
              <span>Start a blank deck and write your own cards.</span>
            </button>
            <button className="make-option" onClick={() => setView('paste')}>
              <FileText size={26} />
              <b>Paste your notes</b>
              <span>Drop in a big batch of text and we&apos;ll turn it into cards.</span>
            </button>
            <button className="make-option" onClick={() => setView('upload')}>
              <UploadCloud size={26} />
              <b>Upload documents</b>
              <span>PDFs, Word docs, text files or photos of your notes.</span>
            </button>
            <button className="make-option" onClick={openTopic}>
              <Wand2 size={26} />
              <b>Generate from a topic {!isPlus && <span className="gen-tab-badge">PLUS</span>}</b>
              <span>Type a topic and a full deck is written for you.</span>
            </button>
          </div>
          <p className="modal-note">
            Already have a list of questions and answers?{' '}
            <button className="make-link" onClick={() => setView('import')}>Import it as a list</button>
          </p>
        </div>
      )}

      {view === 'import' && (
        <div className="create-flashcards-card">
          <button className="create-flashcards-back" onClick={() => setView('chooser')}><ArrowLeft size={16} /> Back</button>
          <div className="modal-title" style={{ textAlign: 'center' }}>Import / Paste Flashcards</div>
          <p className="modal-note" style={{ marginBottom: '1rem', textAlign: 'center' }}>Already have a list of questions and answers? Paste them in below.</p>

          <label className="modal-field-label">Deck Title</label>
          <input
            className="deck-name-input"
            type="text"
            value={importTitle}
            onChange={e => setImportTitle(e.target.value)}
            placeholder="Name your deck"
            disabled={importing}
          />

          <label className="modal-field-label">Format</label>
          <select className="deck-name-input" value={importDelimiter} onChange={e => setImportDelimiter(e.target.value as ImportDelimiter)}>
            {DELIMITER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>

          <textarea
            className="deck-name-input modal-textarea import-textarea"
            placeholder={'How big is a whale?\tMassive\nHow big is a goat?\tNot so massive'}
            value={importText}
            onChange={e => setImportText(e.target.value)}
            rows={8}
          />

          <div className="import-preview">
            <h4>Preview ({parsedCards.length} card{parsedCards.length === 1 ? '' : 's'} found)</h4>
            {parsedCards.slice(0, 5).map((card, i) => (
              <div key={i} className="import-preview-row">
                <span className="q">{card.question}</span>
                <span className="a">{card.answer}</span>
              </div>
            ))}
            {parsedCards.length > 5 && <p className="import-preview-more">…and {parsedCards.length - 5} more</p>}
          </div>

          {importError && <div className="modal-error">{importError}</div>}

          <button
            className="modal-btn"
            disabled={!importTitle.trim() || parsedCards.length === 0 || importing}
            onClick={handleImportCreate}
          >
            {importing ? 'Importing…' : `Import ${parsedCards.length} Card${parsedCards.length === 1 ? '' : 's'}`}
          </button>
        </div>
      )}

      {(view === 'paste' || view === 'upload' || view === 'topic') && (
        <div className="create-flashcards-card">
          <button className="create-flashcards-back" onClick={() => setView('chooser')}><ArrowLeft size={16} /> Back</button>
          <CreateFromSource mode={view} classId={selectedClassId} />
        </div>
      )}

      {showTopicUpgrade && (
        <div className="modal-overlay active" onClick={() => setShowTopicUpgrade(false)}>
          <div className="modal" style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setShowTopicUpgrade(false)} aria-label="Close"><X size={18} /></button>
            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--cobalt-blue)', marginBottom: '0.75rem' }}><Sparkles size={36} strokeWidth={1.75} /></div>
            <div className="modal-title">Generating from a topic is a Plus feature</div>
            <p className="modal-note" style={{ marginBottom: '1.25rem' }}>
              Upgrade to Plus to type any topic and get a full deck written for you. You can still type cards yourself, paste notes or upload documents for free.
            </p>
            <button className="modal-btn" onClick={() => { setShowTopicUpgrade(false); setUpgradeOpen(true); }}>Upgrade to Plus</button>
            <button className="modal-close" onClick={() => setShowTopicUpgrade(false)}>Maybe later</button>
          </div>
        </div>
      )}

      {showManualModal && (
        <CreateDeckModal
          classId={selectedClassId}
          onCreated={() => setShowManualModal(false)}
          onCancel={() => setShowManualModal(false)}
        />
      )}

    </div>
  );
}

export default function CreateFlashcardsPage() {
  return (
    <Suspense>
      <CreateFlashcardsContent />
    </Suspense>
  );
}
