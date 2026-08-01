'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Layers, Plus } from 'lucide-react';
import { Deck } from '@/lib/types';
import { useDashboard } from '@/lib/dashboard-context';
import DeckCard from '@/components/DeckCard';
import ClassCard from '@/components/class/ClassCard';
import ClassCreationFlow from '@/components/class/ClassCreationFlow';
import OnboardingModal, { ONBOARDING_MODAL_SEEN_KEY } from '@/components/class/OnboardingModal';
import MigrationPrompt, { MIGRATION_PROMPT_DISMISSED_KEY } from '@/components/class/MigrationPrompt';

export default function YourFlashcardsPage() {
  const router = useRouter();
  const {
    decks, fetching, deleteError, handleDelete, handleDeckUpdate,
    classes, classesFetching, handleClassCreated, refetchClasses,
  } = useDashboard();

  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);

  const orphanDecks = useMemo(() => decks.filter(d => !d.class_id), [decks]);
  const ready = !fetching && !classesFetching;

  useEffect(() => {
    if (!ready) return;

    if (classes.length === 0 && decks.length === 0) {
      if (typeof window !== 'undefined' && localStorage.getItem(ONBOARDING_MODAL_SEEN_KEY) !== 'true') {
        setShowOnboarding(true);
      }
      return;
    }

    if (orphanDecks.length > 0) {
      if (typeof window !== 'undefined' && localStorage.getItem(MIGRATION_PROMPT_DISMISSED_KEY) !== 'true') {
        setShowMigrationPrompt(true);
      }
    }
  }, [ready, classes.length, decks.length, orphanDecks.length]);

  const dismissOnboarding = () => {
    localStorage.setItem(ONBOARDING_MODAL_SEEN_KEY, 'true');
    setShowOnboarding(false);
  };

  const dismissMigrationPrompt = () => {
    localStorage.setItem(MIGRATION_PROMPT_DISMISSED_KEY, 'true');
    setShowMigrationPrompt(false);
  };

  const mostCommonTopic = useMemo(() => {
    const counts = new Map<string, number>();
    orphanDecks.forEach(d => {
      const key = d.topic?.trim();
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    let best: string | null = null, bestCount = 0;
    counts.forEach((count, topic) => { if (count > bestCount) { best = topic; bestCount = count; } });
    return best ?? 'My Flashcards';
  }, [orphanDecks]);

  const handleOrganiseOrphans = async () => {
    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: mostCommonTopic }),
    });
    const data = await res.json();
    if (!res.ok) return;
    handleClassCreated({ ...data.class, deckCount: 0, totalCards: 0, masteryPct: 0, cardsStudied: 0, studiedToday: false });
    await Promise.all(orphanDecks.map(d => handleDeckUpdate(d.id, { classId: data.class.id })));
    await refetchClasses();
    dismissMigrationPrompt();
  };

  // Study launches the Confidence-Based Repetition session at /dashboard/study
  const handleStudy = (deck: Deck) => {
    router.push(`/dashboard/study?deckId=${deck.id}`);
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="dashboard-page-title">Your Flashcards</h1>
        <p className="dashboard-page-subtitle">
          {fetching ? 'Loading your decks...' : `${classes.length} class${classes.length !== 1 ? 'es' : ''} · ${decks.length} deck${decks.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {deleteError && <div className="error-message">{deleteError}</div>}

      {showMigrationPrompt && (
        <MigrationPrompt orphanTopic={mostCommonTopic} onOrganise={handleOrganiseOrphans} onDismiss={dismissMigrationPrompt} />
      )}

      {!ready ? (
        <div className="loading">
          <div className="spinner"><Loader2 size={40} strokeWidth={2} /></div>
          <p style={{ opacity: 0.7, marginTop: '1rem' }}>Loading your decks...</p>
        </div>
      ) : (
        <>
          {classes.length > 0 && (
            <section style={{ marginBottom: '2.5rem' }}>
              <div className="section-row-header">
                <h2 className="section-row-title">Classes</h2>
                <button className="btn-outline" onClick={() => setShowCreateClass(true)}><Plus size={15} /> Add New Class</button>
              </div>
              <div className="class-grid">
                {classes.map(cls => <ClassCard key={cls.id} cls={cls} />)}
              </div>
            </section>
          )}

          {classes.length === 0 && decks.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <button className="btn-outline" onClick={() => setShowCreateClass(true)}><Plus size={15} /> Add New Class</button>
            </div>
          )}

          {orphanDecks.length > 0 && (
            <section>
              {classes.length > 0 && <h2 className="section-row-title" style={{ marginBottom: '1rem' }}>Uncategorised</h2>}
              <div className="deck-grid">
                {orphanDecks.map(deck => (
                  <DeckCard key={deck.id} deck={deck} onDelete={handleDelete} onStudy={handleStudy} onUpdate={handleDeckUpdate} />
                ))}
              </div>
            </section>
          )}

          {classes.length === 0 && decks.length === 0 && (
            <div className="dashboard-empty">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--cobalt-blue)', opacity: 0.5 }}><Layers size={64} strokeWidth={1.5} /></div>
              <h2 style={{ marginBottom: '0.5rem' }}>No decks saved yet</h2>
              <p style={{ opacity: 0.7, marginBottom: '1rem' }}>Generate a deck under Create Flashcards to get started.</p>
              <button className="btn-outline" onClick={() => setShowCreateClass(true)}><Plus size={15} /> Add New Class</button>
            </div>
          )}
        </>
      )}

      {showOnboarding && (
        <OnboardingModal
          onFindFlashcards={() => { dismissOnboarding(); router.push('/library'); }}
          onMakeFlashcards={() => { dismissOnboarding(); setShowCreateClass(true); }}
          onJustGetSmarter={() => { dismissOnboarding(); router.push('/library'); }}
          onClose={dismissOnboarding}
        />
      )}

      {showCreateClass && (
        <ClassCreationFlow
          onComplete={(cls) => { handleClassCreated(cls); setShowCreateClass(false); router.push(`/dashboard/classes/${cls.id}`); }}
          onCancel={() => setShowCreateClass(false)}
        />
      )}
    </div>
  );
}
