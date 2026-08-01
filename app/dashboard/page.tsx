'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, ArrowLeft, Plus, FileText, Sparkles, Wand2 } from 'lucide-react';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import ClassPicker from '@/components/class/ClassPicker';
import ClassCreationFlow from '@/components/class/ClassCreationFlow';
import CreateDeckModal from '@/components/class/CreateDeckModal';
import { useDashboard } from '@/lib/dashboard-context';
import { Deck } from '@/lib/types';
import { parseImportText, ImportDelimiter } from '@/lib/importParser';

type View = 'chooser' | 'import' | 'ai-content' | 'ai-topic';

const DELIMITER_OPTIONS: { value: ImportDelimiter; label: string }[] = [
  { value: 'tab', label: 'Tab-separated (Question [TAB] Answer)' },
  { value: 'comma', label: 'Comma-separated (Question, Answer)' },
  { value: 'newline-pair', label: 'Paragraph pairs (Question [blank line] Answer)' },
];

function CreateFlashcardsContent() {
  const { handleDeckSaved, handleClassCreated, classes, refetchClasses } = useDashboard();
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlClassId = searchParams.get('classId');

  const [selectedClassId, setSelectedClassId] = useState<string | null>(urlClassId);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [view, setView] = useState<View>('chooser');
  const [savedTo, setSavedTo] = useState<{ deckTitle: string; className: string | null } | null>(null);

  const [importTitle, setImportTitle] = useState('');
  const [importDelimiter, setImportDelimiter] = useState<ImportDelimiter>('tab');
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');

  const parsedCards = useMemo(() => parseImportText(importText, importDelimiter), [importText, importDelimiter]);

  useEffect(() => {
    if (urlClassId) setSelectedClassId(urlClassId);
  }, [urlClassId]);

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

  const handleSaved = async (deck: Deck) => {
    handleDeckSaved(deck);
    setSavedTo(null);
    await attachToClass(deck);
    setView('chooser');
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
        <p className="dashboard-page-subtitle">Type your own cards, import a list, or let AI build the deck for you.</p>
      </div>

      <ClassPicker
        classes={classes}
        selectedId={selectedClassId}
        onSelect={setSelectedClassId}
        onCreateNew={() => setShowCreateClass(true)}
      />

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
          <div className="modal-title" style={{ textAlign: 'center' }}>Make Flashcards</div>
          <div className="make-flashcards-columns">
            <div className="make-flashcards-col">
              <h3>Manual</h3>
              <button className="make-flashcards-manual-btn" onClick={() => setShowManualModal(true)}>
                <Plus size={22} /><span>Type Flashcards</span>
              </button>
            </div>
            <div className="make-flashcards-divider">— OR —</div>
            <div className="make-flashcards-col make-flashcards-col-ai">
              <h3>AI-Powered</h3>
              <button className="make-flashcards-ai-btn" onClick={() => setView('import')}>
                <FileText size={18} /><span>Import/Paste Flashcards</span>
              </button>
              <button className="make-flashcards-ai-btn" onClick={() => setView('ai-content')}>
                <Sparkles size={18} /><span>Summarise From Content</span>
              </button>
              <button className="make-flashcards-ai-btn" onClick={() => setView('ai-topic')}>
                <Wand2 size={18} /><span>Just Tell AI What I Want</span>
              </button>
            </div>
          </div>
          <p className="modal-note">💡 You can always switch between manual and automatic creation once you are in Edit mode.</p>
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

      {(view === 'ai-content' || view === 'ai-topic') && (
        <div className="create-flashcards-card">
          <button className="create-flashcards-back" onClick={() => setView('chooser')}><ArrowLeft size={16} /> Back</button>
          <FlashcardGenerator hideFeatures onDeckSaved={handleSaved} initialTab={view === 'ai-content' ? 'paste' : 'topic'} />
        </div>
      )}

      {showManualModal && (
        <CreateDeckModal
          classId={selectedClassId}
          onCreated={() => setShowManualModal(false)}
          onCancel={() => setShowManualModal(false)}
        />
      )}

      {showCreateClass && (
        <ClassCreationFlow
          onComplete={(cls) => { handleClassCreated(cls); setSelectedClassId(cls.id); setShowCreateClass(false); }}
          onCancel={() => setShowCreateClass(false)}
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
