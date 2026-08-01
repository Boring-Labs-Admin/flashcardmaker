'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Pencil, Zap, Plus, Layers } from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';
import { ClassDetail, StudyMode } from '@/lib/types';
import MasteryRing from '@/components/MasteryRing';
import ClassCoverIcon from '@/components/class/ClassCoverIcon';
import ClassMoreMenu from '@/components/class/ClassMoreMenu';
import StudyModeToggle, { getStoredStudyMode } from '@/components/class/StudyModeToggle';
import DeckProgressRow from '@/components/class/DeckProgressRow';
import MakeFlashcardsModal from '@/components/class/MakeFlashcardsModal';
import CreateDeckModal from '@/components/class/CreateDeckModal';

const PURPOSE_LABELS: Record<string, string> = {
  job_skills: 'Job Skills',
  foreign_languages: 'Foreign Languages',
  professional_certification: 'Professional Certification',
  standardised_test: 'Standardised Test',
  school_university: 'School / University',
  general: 'General Learning/Other',
};

export default function ClassOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;
  const { isAdmin, planData, handleClassRemoved, refetchClasses } = useDashboard();
  const isPlusOrAdmin = isAdmin || planData?.plan === 'plus';

  const [detail, setDetail] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'intro' | 'decks' | 'learners'>('decks');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [studyMode, setStudyMode] = useState<StudyMode>('progressive');
  const [showMakeFlashcards, setShowMakeFlashcards] = useState(false);
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [actionError, setActionError] = useState('');

  const loadDetail = useCallback(() => {
    setLoading(true);
    fetch(`/api/classes/${classId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return; }
        setDetail(data);
        setTitleDraft(data.class.title);
      })
      .catch(() => setError('Failed to load set.'))
      .finally(() => setLoading(false));
  }, [classId]);

  useEffect(() => {
    loadDetail();
    setStudyMode(getStoredStudyMode(classId));
  }, [classId, loadDetail]);

  const saveTitle = async () => {
    setIsEditingTitle(false);
    if (!detail || !titleDraft.trim() || titleDraft.trim() === detail.class.title) return;
    const res = await fetch(`/api/classes/${classId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titleDraft.trim() }),
    });
    if (res.ok) {
      loadDetail();
      refetchClasses();
    }
  };

  const handleStudyAll = () => {
    router.push(`/dashboard/classes/${classId}/study?mode=${studyMode}`);
  };

  const handleStudyDeck = (deckId: string) => {
    router.push(`/dashboard/study?deckId=${deckId}`);
  };

  const handleDeleteDeck = async (deckId: string) => {
    const res = await fetch(`/api/decks?id=${deckId}`, { method: 'DELETE' });
    if (res.ok) { loadDetail(); refetchClasses(); }
  };

  const handleDuplicate = async () => {
    setActionError('');
    const res = await fetch(`/api/classes/${classId}/duplicate`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) { setActionError(data.error || 'Failed to duplicate set.'); return; }
    refetchClasses();
    router.push(`/dashboard/classes/${data.class.id}`);
  };

  const handleResetStats = async () => {
    setActionError('');
    const res = await fetch(`/api/classes/${classId}/reset-stats`, { method: 'POST' });
    if (!res.ok) { const data = await res.json(); setActionError(data.error || 'Failed to reset stats.'); return; }
    loadDetail();
  };

  const handleRemove = async () => {
    const res = await fetch(`/api/classes/${classId}`, { method: 'DELETE' });
    if (res.ok) {
      handleClassRemoved(classId);
      router.push('/dashboard/decks');
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"><Loader2 size={40} strokeWidth={2} /></div></div>;
  }

  if (error || !detail) {
    return (
      <div className="container">
        <p className="error-message">{error || 'Set not found.'}</p>
        <Link href="/dashboard/decks" className="btn-outline">← Back to Your Flashcards</Link>
      </div>
    );
  }

  const { class: cls, decks, totalCards, masteryPct } = detail;
  const cardsStudied = decks.reduce((s, d) => s + d.cardsStudied, 0);

  return (
    <div className="container">
      <div className="class-header">
        <ClassCoverIcon coverColor={cls.cover_color} coverEmoji={cls.cover_emoji} size={100} />
        <div className="class-info">
          {isEditingTitle ? (
            <input
              className="class-title-input"
              value={titleDraft}
              onChange={e => setTitleDraft(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={e => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') { setTitleDraft(cls.title); setIsEditingTitle(false); } }}
              autoFocus
            />
          ) : (
            <h1 className="class-title">
              {cls.title}
              <button className="class-title-edit" onClick={() => setIsEditingTitle(true)} aria-label="Rename set"><Pencil size={16} /></button>
            </h1>
          )}
          <div className="class-attribution">
            By: You · Cards Studied: <b>{cardsStudied} of {totalCards}</b>
          </div>
          <div className="class-actions">
            <button className="btn deck-study-btn" onClick={handleStudyAll} disabled={totalCards === 0}>
              <Zap size={15} /> Study
            </button>
            <ClassMoreMenu
              isPlusOrAdmin={isPlusOrAdmin}
              onImportMakeFlashcards={() => setShowMakeFlashcards(true)}
              onDuplicate={handleDuplicate}
              onResetStats={handleResetStats}
              onRemove={handleRemove}
              onRequireUpgrade={() => router.push('/pricing')}
            />
          </div>
          {actionError && <div className="error-message">{actionError}</div>}
        </div>
        <MasteryRing pct={masteryPct} size={100} strokeWidth={8} showLabel />
      </div>

      <div className="class-tabs">
        <button className={`class-tab${tab === 'intro' ? ' active' : ''}`} onClick={() => setTab('intro')}>Intro</button>
        <button className={`class-tab${tab === 'decks' ? ' active' : ''}`} onClick={() => setTab('decks')}>Decks ({decks.length})</button>
        <button className={`class-tab${tab === 'learners' ? ' active' : ''}`} onClick={() => setTab('learners')}>Learners (1)</button>
      </div>

      {tab === 'intro' && (
        <div className="class-intro-tab">
          <h4>Purpose</h4>
          <p>{cls.purpose ? PURPOSE_LABELS[cls.purpose] : 'Not set'}</p>
          <h4>Description</h4>
          <p>{cls.description || 'No description yet.'}</p>
        </div>
      )}

      {tab === 'decks' && (
        <>
          <div className="decks-toolbar">
            <StudyModeToggle classId={classId} mode={studyMode} onChange={setStudyMode} />
            <span className="decks-toolbar-hint">Progressive uses spaced repetition. Random shuffles cards.</span>
          </div>

          {decks.length === 0 ? (
            <div className="dashboard-empty">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--cobalt-blue)', opacity: 0.5 }}><Layers size={64} strokeWidth={1.5} /></div>
              <h2 style={{ marginBottom: '0.5rem' }}>No decks in this set yet</h2>
              <button className="btn" onClick={() => setShowMakeFlashcards(true)}><Plus size={15} /> Import/Make Flashcards</button>
            </div>
          ) : (
            <div className="deck-progress-list">
              {decks.map(deck => (
                <DeckProgressRow
                  key={deck.id}
                  deck={deck}
                  onStudy={() => handleStudyDeck(deck.id)}
                  onDelete={() => handleDeleteDeck(deck.id)}
                />
              ))}
              <button className="deck-progress-add" onClick={() => setShowMakeFlashcards(true)}>
                <Plus size={16} /> Create New Deck
              </button>
            </div>
          )}
        </>
      )}

      {tab === 'learners' && (
        <div className="class-intro-tab">
          <p>Learner rosters are coming in a future update.</p>
        </div>
      )}

      {showMakeFlashcards && (
        <MakeFlashcardsModal
          classId={classId}
          onTypeManually={() => setShowCreateDeck(true)}
          onClose={() => setShowMakeFlashcards(false)}
        />
      )}

      {showCreateDeck && (
        <CreateDeckModal
          classId={classId}
          onCreated={() => { setShowCreateDeck(false); loadDetail(); refetchClasses(); }}
          onCancel={() => setShowCreateDeck(false)}
        />
      )}
    </div>
  );
}
