'use client';

import FlashcardGenerator from '@/components/FlashcardGenerator';
import { useDashboard } from '@/lib/dashboard-context';

export default function CreateFlashcardsPage() {
  const { handleDeckSaved } = useDashboard();

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="dashboard-page-title">Create Flashcards</h1>
        <p className="dashboard-page-subtitle">Upload notes, paste text, or generate from a topic — your deck is ready in seconds.</p>
      </div>
      <FlashcardGenerator hideFeatures onDeckSaved={handleDeckSaved} />
    </div>
  );
}
