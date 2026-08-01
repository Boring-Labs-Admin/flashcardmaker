'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import ClassPicker from '@/components/class/ClassPicker';
import ClassCreationFlow from '@/components/class/ClassCreationFlow';
import { useDashboard } from '@/lib/dashboard-context';
import { Deck } from '@/lib/types';

function CreateFlashcardsContent() {
  const { handleDeckSaved, handleClassCreated, classes, refetchClasses } = useDashboard();
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlClassId = searchParams.get('classId');

  const [selectedClassId, setSelectedClassId] = useState<string | null>(urlClassId);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [savedTo, setSavedTo] = useState<{ deckTitle: string; className: string | null } | null>(null);

  useEffect(() => {
    if (urlClassId) setSelectedClassId(urlClassId);
  }, [urlClassId]);

  const handleSaved = async (deck: Deck) => {
    handleDeckSaved(deck);
    setSavedTo(null);

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

  return (
    <div className="container">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="dashboard-page-title">Create Flashcards</h1>
        <p className="dashboard-page-subtitle">Upload notes, paste text, or generate from a topic — your deck is ready in seconds.</p>
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
            <button className="btn-outline" onClick={() => router.push(`/dashboard/classes/${selectedClassId}`)}>View Class</button>
          ) : (
            <button className="btn-outline" onClick={() => router.push('/dashboard/decks')}>View Your Flashcards</button>
          )}
        </div>
      )}

      <FlashcardGenerator hideFeatures onDeckSaved={handleSaved} />

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
