'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
          <div className="spinner">⚡</div>
          <p style={{ opacity: 0.7, marginTop: '1rem' }}>Loading your decks...</p>
        </div>
      ) : decks.length === 0 ? (
        <div className="dashboard-empty">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
          <h2 style={{ marginBottom: '0.5rem' }}>No decks to test yet</h2>
          <p style={{ opacity: 0.7, marginBottom: '1rem' }}>Create a deck first, then come back here to test yourself.</p>
          <Link href="/dashboard" className="btn-outline">Create Flashcards →</Link>
        </div>
      ) : (
        <div className="library-directory">
          <div className="library-subject-group">
            {decks.map(deck => (
              <button
                key={deck.id}
                className="library-directory-row"
                style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', font: 'inherit' }}
                onClick={() => router.push(`/dashboard/test?deckId=${deck.id}`)}
              >
                <span className="library-row-title">{deck.title}</span>
                <span className="library-row-count">{deck.flashcards.length} cards</span>
                <span className="library-row-arrow">→</span>
              </button>
            ))}
          </div>
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
