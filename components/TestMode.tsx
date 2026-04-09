'use client';

import { useState, useEffect, useCallback } from 'react';
import { Deck, TestOptions, TestCard } from '@/lib/types';

interface TestModeProps {
  deck: Deck;
  onBack: () => void;
  onTestOptionsGenerated: (deckId: string, options: TestOptions) => void;
}

type TestPhase = 'loading' | 'testing' | 'complete';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildTestCards(deck: Deck, options: TestOptions): TestCard[] {
  return deck.flashcards.map(card => ({
    flashcard: card,
    options: shuffle([card.answer, ...options[card.id]]),
    correctAnswer: card.answer,
  }));
}

function scoreMessage(score: number, total: number): string {
  const pct = score / total;
  if (pct === 1) return 'Perfect score!';
  if (pct >= 0.8) return 'Great work!';
  if (pct >= 0.6) return 'Good effort!';
  return 'Keep practising!';
}

export default function TestMode({ deck, onBack, onTestOptionsGenerated }: TestModeProps) {
  const [phase, setPhase] = useState<TestPhase>(deck.test_options ? 'testing' : 'loading');
  const [testOptions, setTestOptions] = useState<TestOptions | null>(deck.test_options ?? null);
  const [testCards, setTestCards] = useState<TestCard[]>(() =>
    deck.test_options ? buildTestCards(deck, deck.test_options) : []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (deck.test_options) return; // already have options, skip fetch

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/decks/test-options', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deckId: deck.id }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || 'Failed to generate test options. Please try again.');
          setPhase('loading'); // stay on loading to show error
          return;
        }
        const options: TestOptions = data.test_options;
        setTestOptions(options);
        onTestOptionsGenerated(deck.id, options);
        setTestCards(buildTestCards(deck, options));
        setPhase('testing');
      } catch {
        if (!cancelled) setError('Failed to connect. Please try again.');
      }
    })();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOptionSelect = useCallback((option: string) => {
    if (selectedOption !== null) return;
    const isCorrect = option === testCards[currentIndex].correctAnswer;
    setSelectedOption(option);
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      setSelectedOption(null);
      if (currentIndex < testCards.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setPhase('complete');
      }
    }, 1200);
  }, [selectedOption, testCards, currentIndex]);

  const handleTryAgain = () => {
    if (!testOptions) return;
    setTestCards(buildTestCards(deck, testOptions));
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setPhase('testing');
  };

  // ── LOADING / ERROR ──────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="test-mode-loading">
        {error ? (
          <>
            <div style={{ fontSize: '2rem' }}>⚠</div>
            <p style={{ fontWeight: 700, color: '#c00' }}>{error}</p>
            <button className="btn" onClick={() => { setError(null); window.location.reload(); }}>
              Try Again
            </button>
          </>
        ) : (
          <>
            <div className="spinner" style={{ fontSize: '2rem' }}>⚡</div>
            <p style={{ fontWeight: 700 }}>Generating test options…</p>
            <p className="test-mode-loading-sub">This only happens once per deck</p>
          </>
        )}
      </div>
    );
  }

  // ── COMPLETE ─────────────────────────────────────────
  if (phase === 'complete') {
    const total = testCards.length;
    const pct = Math.round((score / total) * 100);
    return (
      <div className="test-complete">
        <div className="test-complete-score">{score} / {total}</div>
        <div className="test-complete-pct">{pct}%</div>
        <div className="test-complete-msg">{scoreMessage(score, total)}</div>
        <div className="test-complete-actions">
          <button className="btn" onClick={handleTryAgain}>Try Again</button>
          <button className="btn deck-test-btn" onClick={onBack}>← Back to Flashboard</button>
        </div>
      </div>
    );
  }

  // ── TESTING ──────────────────────────────────────────
  const card = testCards[currentIndex];

  return (
    <div className="test-mode-inner">
      <div className="test-progress">
        Question {currentIndex + 1} / {testCards.length}
      </div>

      <div className="test-question-text">{card.flashcard.question}</div>

      <div className="test-options-grid">
        {card.options.map((option, i) => {
          let cls = 'test-option-btn';
          if (selectedOption !== null) {
            if (option === card.correctAnswer) cls += ' correct';
            else if (option === selectedOption) cls += ' incorrect';
            else cls += ' dimmed';
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => handleOptionSelect(option)}
              disabled={selectedOption !== null}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selectedOption !== null && (
        <div className="test-feedback">
          {selectedOption === card.correctAnswer
            ? '✓ Correct!'
            : `✗ Correct answer: ${card.correctAnswer}`}
        </div>
      )}
    </div>
  );
}
