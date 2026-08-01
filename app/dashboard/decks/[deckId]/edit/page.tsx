'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Plus, List, Zap } from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';
import { CardEditorProvider, useCardEditor } from '@/components/editor/CardEditorProvider';
import CardRow from '@/components/editor/CardRow';
import CardNavigatorSidebar from '@/components/editor/CardNavigatorSidebar';
import PreviewTab from '@/components/editor/PreviewTab';
import BrowseTab from '@/components/editor/BrowseTab';
import SourceView from '@/components/editor/SourceView';
import AIEnhanceModal from '@/components/editor/AIEnhanceModal';
import ImportCardsModal from '@/components/editor/ImportCardsModal';

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
}

function EditorContent({ classTitle }: { classTitle: string | null }) {
  const {
    deckId, deckTitle, cards, mode, setMode, tab, setTab, activeIndex, setActiveIndex,
    addCard, duplicateCard, deleteCard, undo, lastSaved, hasUnsavedChanges, saving, saveNow, discardChanges,
  } = useCardEditor();
  const router = useRouter();
  const [enhanceIndex, setEnhanceIndex] = useState<number | null>(null);
  const [showImport, setShowImport] = useState(false);
  const rowRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const registerRef = (index: number, el: HTMLDivElement | null) => { rowRefs.current[index] = el; };

  const scrollToCard = (index: number) => {
    setTab('edit');
    setTimeout(() => rowRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const focusQuestion = (index: number) => {
    const row = rowRefs.current[index];
    const el = row?.querySelector<HTMLTextAreaElement>('.card-question-field textarea');
    el?.focus();
  };

  const handleAnswerTab = (index: number) => {
    if (index === cards.length - 1) {
      const newIndex = addCard();
      setTimeout(() => focusQuestion(newIndex), 50);
    } else {
      focusQuestion(index + 1);
    }
  };

  // Global shortcuts: Ctrl+Enter (add card), Ctrl+D (duplicate active), Ctrl+Z (undo — only
  // outside text fields, so it never fights the browser's own per-field undo), Delete (only
  // when the row container itself is focused, never while typing inside it).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isTextField = active?.tagName === 'TEXTAREA' || active?.tagName === 'INPUT';

      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        const newIndex = addCard();
        setTimeout(() => focusQuestion(newIndex), 50);
      } else if (e.ctrlKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateCard(activeIndex);
      } else if (e.ctrlKey && e.key.toLowerCase() === 'z' && !isTextField) {
        e.preventDefault();
        undo();
      } else if (e.key === 'Delete' && active?.classList.contains('card-row')) {
        e.preventDefault();
        deleteCard(activeIndex);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, cards.length]);

  const handleAddCard = () => {
    const newIndex = addCard();
    setTimeout(() => { rowRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth' }); focusQuestion(newIndex); }, 50);
  };

  return (
    <div className="container editor-container">
      <div className="editor-topbar">
        <div className="editor-breadcrumb">
          <button className="editor-back" onClick={() => router.back()}>←</button>
          {classTitle && <span>{classTitle}</span>}
          <span className="editor-deck-title">{deckTitle}</span>
        </div>
        <button className="btn deck-study-btn" onClick={() => router.push(`/dashboard/study?deckId=${deckId}`)}>
          <Zap size={15} /> Study Deck
        </button>
      </div>

      <div className="editor-tabs">
        <button className={`editor-tab${tab === 'preview' ? ' active' : ''}`} onClick={() => setTab('preview')}>Preview ({cards.length})</button>
        <button className={`editor-tab${tab === 'edit' ? ' active' : ''}`} onClick={() => setTab('edit')}>Edit ({cards.length})</button>
        <button className={`editor-tab${tab === 'browse' ? ' active' : ''}`} onClick={() => setTab('browse')}>Browse ({cards.length})</button>
      </div>

      {tab === 'edit' && (
        <>
          <div className="editor-mode-bar">
            <div className="editor-mode-tabs">
              <button className={mode === 'simple' ? 'active' : ''} onClick={() => setMode('simple')}>simple</button>
              <button className={mode === 'advanced' ? 'active' : ''} onClick={() => setMode('advanced')}>advanced</button>
              <button className={mode === 'source' ? 'active' : ''} onClick={() => setMode('source')}>source</button>
            </div>
            <div className="editor-mode-bar-right">
              {hasUnsavedChanges ? (
                <>
                  <button className="editor-discard-btn" onClick={discardChanges}>Discard Changes</button>
                  <button className="editor-save-btn" onClick={saveNow} disabled={saving}>{saving ? 'Saving…' : 'SAVE'}</button>
                </>
              ) : (
                <span className="editor-saved-at">{lastSaved ? `Saved at ${formatTime(lastSaved)}` : 'Not saved yet'}</span>
              )}
              {mode !== 'source' && (
                <>
                  <button className="editor-icon-btn" onClick={handleAddCard} title="Add card"><Plus size={16} /></button>
                  <button className="editor-icon-btn" onClick={() => setShowImport(true)} title="Import cards"><List size={16} /></button>
                </>
              )}
            </div>
          </div>

          <div className="editor-body">
            <CardNavigatorSidebar scrollToCard={scrollToCard} />
            <div className="editor-cards-area">
              {mode === 'source' ? (
                <SourceView />
              ) : (
                <>
                  {cards.map((card, i) => (
                    <div key={card.id} onKeyDownCapture={e => {
                      if (e.key === 'Tab' && !e.shiftKey && (e.target as HTMLElement).closest('.card-answer-field')) {
                        e.preventDefault();
                        handleAnswerTab(i);
                      }
                    }}>
                      <CardRow card={card} index={i} isNew={card.id.startsWith('new-')} onEnhance={setEnhanceIndex} registerRef={registerRef} />
                    </div>
                  ))}
                  <div className="editor-add-row">
                    <button className="editor-icon-btn" onClick={handleAddCard} title="Add card"><Plus size={16} /></button>
                    <button className="editor-icon-btn" onClick={() => setShowImport(true)} title="Import cards"><List size={16} /></button>
                    <span className="editor-tab-hint">Hit TAB to advance to next card</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {tab === 'preview' && <PreviewTab />}
      {tab === 'browse' && <BrowseTab onEditCard={i => { setTab('edit'); scrollToCard(i); }} />}

      {enhanceIndex !== null && <AIEnhanceModal index={enhanceIndex} onClose={() => setEnhanceIndex(null)} />}
      {showImport && <ImportCardsModal onClose={() => setShowImport(false)} />}
    </div>
  );
}

export default function CardEditorPage() {
  const params = useParams();
  const deckId = params.deckId as string;
  const { decks, fetching, classes } = useDashboard();

  const deck = useMemo(() => decks.find(d => d.id === deckId), [decks, deckId]);
  const classTitle = useMemo(() => {
    if (!deck?.class_id) return null;
    return classes.find(c => c.id === deck.class_id)?.title ?? null;
  }, [deck, classes]);

  if (fetching) {
    return <div className="loading"><div className="spinner"><Loader2 size={40} strokeWidth={2} /></div></div>;
  }

  if (!deck) {
    return (
      <div className="container">
        <p className="error-message">Deck not found.</p>
        <Link href="/dashboard/decks" className="btn-outline">← Back to Your Flashcards</Link>
      </div>
    );
  }

  return (
    <CardEditorProvider deckId={deck.id} deckTitle={deck.title} initialCards={deck.flashcards}>
      <EditorContent classTitle={classTitle} />
    </CardEditorProvider>
  );
}
