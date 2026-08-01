'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import { useDashboard } from '@/lib/dashboard-context';
import { Deck } from '@/lib/types';

function CreateFlashcardsContent() {
  const { handleDeckSaved, refetchClasses } = useDashboard();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');

  const handleSaved = async (deck: Deck) => {
    handleDeckSaved(deck);
    if (classId) {
      try {
        await fetch('/api/decks', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: deck.id, classId }),
        });
        refetchClasses();
      } catch {
        // Non-fatal — deck is still saved, just not attached to the class
      }
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="dashboard-page-title">Create Flashcards</h1>
        <p className="dashboard-page-subtitle">Upload notes, paste text, or generate from a topic — your deck is ready in seconds.</p>
      </div>
      <FlashcardGenerator hideFeatures onDeckSaved={handleSaved} />
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
