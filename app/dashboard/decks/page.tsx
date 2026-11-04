'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Layers, Plus } from 'lucide-react';
import { Deck } from '@/lib/types';
import { useDashboard } from '@/lib/dashboard-context';
import DeckCard from '@/components/DeckCard';
import ClassCard from '@/components/class/ClassCard';
import ClassCreationFlow from '@/components/class/ClassCreationFlow';
import OnboardingModal, { ONBOARDING_MODAL_SEEN_KEY } from '@/components/class/OnboardingModal';

export default function YourFlashcardsPage() {
  const router = useRouter();
  const {
    decks, fetching, deleteError, handleDelete, handleDeckUpdate,
    classes, classesFetching, handleClassCreated,
  } = useDashboard();

  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const ready = !fetching && !classesFetching;

  useEffect(() => {
    if (!ready) return;
    if (classes.length === 0 && decks.length === 0) {
      if (typeof window !== 'undefined' && localStorage.getItem(ONBOARDING_MODAL_SEEN_KEY) !== 'true') {
        setShowOnboarding(true);
      }
    }
  }, [ready, classes.length, decks.length]);

  const dismissOnboarding = () => {
    localStorage.setItem(ONBOARDING_MODAL_SEEN_KEY, 'true');
    setShowOnboarding(false);
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
          {fetching ? 'Loading your decks...' : `${classes.length} set${classes.length !== 1 ? 's' : ''} · ${decks.length} deck${decks.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {deleteError && <div className="error-message">{deleteError}</div>}

      {!ready ? (
        <div className="loading">
          <div className="spinner"><Loader2 size={40} strokeWidth={2} /></div>
          <p style={{ opacity: 0.7, marginTop: '1rem' }}>Loading your decks...</p>
        </div>
      ) : (
        <>
          {classes.length === 0 && decks.length === 0 ? (
            <div className="dashboard-empty">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--cobalt-blue)', opacity: 0.5 }}><Layers size={64} strokeWidth={1.5} /></div>
              <h2 style={{ marginBottom: '0.5rem' }}>No decks saved yet</h2>
              <p style={{ opacity: 0.7, marginBottom: '1rem' }}>Create your first deck to get started.</p>
              <button className="btn-outline" onClick={() => router.push('/dashboard')}><Plus size={15} /> Create Deck</button>
            </div>
          ) : (
            <>
              <section style={{ marginBottom: '2.5rem' }}>
                <div className="section-row-header">
                  <h2 className="section-row-title">Decks</h2>
                  <button className="btn-outline" onClick={() => router.push('/dashboard')}><Plus size={15} /> Create Deck</button>
                </div>
                {decks.length > 0 ? (
                  <div className="deck-grid">
                    {decks.map(deck => (
                      <DeckCard key={deck.id} deck={deck} onDelete={handleDelete} onStudy={handleStudy} onUpdate={handleDeckUpdate} sets={classes} />
                    ))}
                  </div>
                ) : (
                  <p className="section-empty-hint">No decks yet. Create one to start studying.</p>
                )}
              </section>

              <section>
                <div className="section-row-header">
                  <h2 className="section-row-title">Sets</h2>
                  <button className="btn-outline" onClick={() => setShowCreateClass(true)}><Plus size={15} /> Add New Set</button>
                </div>
                {classes.length > 0 ? (
                  <div className="class-grid">
                    {classes.map(cls => <ClassCard key={cls.id} cls={cls} />)}
                  </div>
                ) : (
                  <p className="section-empty-hint">A Set groups several decks so you can study them together.</p>
                )}
              </section>
            </>
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
