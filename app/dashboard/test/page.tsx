'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ClipboardCheck } from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';
import TestMode from '@/components/TestMode';
import Link from 'next/link';

function TestYourselfContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { decks, fetching, handleTestOptionsGenerated } = useDashboard();

  const deckId = searchParams.get('deckId');
  const deck = deckId ? decks.find(d => d.id === deckId) : undefined;

  if (deck) {
    return (
      <TestMode
        deck={deck}
        onBack={() => router.push('/dashboard/test')}
        onTestOptionsGenerated={handleTestOptionsGenerated}
      />
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="dashboard-page-title">Test Yourself</h1>
        <p className="dashboard-page-subtitle">Pick a deck below to start a multiple-choice test.</p>
      </div>

      {fetching ? (
        <div className="loading">
          <div className="spinner"><Loader2 size={40} strokeWidth={2} /></div>
          <p style={{ opacity: 0.7, marginTop: '1rem' }}>Loading your decks...</p>
        </div>
      ) : decks.length === 0 ? (
        <div className="dashboard-empty">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--cobalt-blue)', opacity: 0.5 }}><ClipboardCheck size={64} strokeWidth={1.5} /></div>
          <h2 style={{ marginBottom: '0.5rem' }}>No decks to test yet</h2>
          <p style={{ opacity: 0.7, marginBottom: '1rem' }}>Create a deck first, then come back here to test yourself.</p>
          <Link href="/dashboard" className="btn-outline">Create Flashcards →</Link>
        </div>
      ) : (
        <div className="deck-grid">
          {decks.map(deck => (
            <button
              key={deck.id}
              className="test-deck-card"
              onClick={() => router.push(`/dashboard/test?deckId=${deck.id}`)}
            >
              <span className="test-deck-icon"><ClipboardCheck size={28} strokeWidth={1.75} /></span>
              <span className="test-deck-card-title">{deck.title}</span>
              <span className="test-deck-card-meta">{deck.flashcards.length} cards</span>
              <span className="test-deck-card-cta">Start Test →</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TestYourselfPage() {
  return (
    <Suspense>
      <TestYourselfContent />
    </Suspense>
  );
}
