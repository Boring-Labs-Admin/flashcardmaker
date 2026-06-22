'use client';

import { useState } from 'react';
import { Deck, ViewMode } from '@/lib/types';
import SingleView from './SingleView';
import SideBySideView from './SideBySideView';
import TestMode from './TestMode';

const DEMO_DECK: Deck = {
  id: 'demo-cell-biology',
  user_id: 'demo',
  title: 'Cell Biology',
  topic: 'biology',
  created_at: new Date().toISOString(),
  flashcards: [
    { id: 'demo-1', question: 'What is the powerhouse of the cell?', answer: 'Mitochondria' },
    { id: 'demo-2', question: "What organelle controls the cell's activities and contains DNA?", answer: 'Nucleus' },
    { id: 'demo-3', question: 'What structure controls what enters and leaves the cell?', answer: 'Cell membrane' },
    { id: 'demo-4', question: 'Where does protein synthesis take place?', answer: 'Ribosomes' },
    { id: 'demo-5', question: 'What organelle stores water and helps support a plant cell?', answer: 'Vacuole' },
  ],
  test_options: {
    'demo-1': ['Nucleus', 'Ribosome', 'Golgi apparatus'],
    'demo-2': ['Mitochondria', 'Cytoplasm', 'Cell membrane'],
    'demo-3': ['Cell wall', 'Vacuole', 'Nucleus'],
    'demo-4': ['Mitochondria', 'Nucleus', 'Cell membrane'],
    'demo-5': ['Chloroplast', 'Nucleus', 'Mitochondria'],
  },
};

type DemoMode = Exclude<ViewMode, 'grid'> | 'test';

export default function StudyModesDemo() {
  const [mode, setMode] = useState<DemoMode>('single');
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="study-demo">
      <div className="mock-mode-tabs">
        <button className={`mock-mode-tab${mode === 'single' ? ' active' : ''}`} onClick={() => setMode('single')}>Flip</button>
        <button className={`mock-mode-tab${mode === 'side-by-side' ? ' active' : ''}`} onClick={() => setMode('side-by-side')}>List</button>
        <button className={`mock-mode-tab${mode === 'test' ? ' active' : ''}`} onClick={() => setMode('test')}>Test</button>
      </div>
      <div className="study-demo-viewport">
        {mode === 'single' && (
          <SingleView
            flashcards={DEMO_DECK.flashcards}
            currentIndex={currentIndex}
            onNext={() => setCurrentIndex(i => Math.min(i + 1, DEMO_DECK.flashcards.length - 1))}
            onPrevious={() => setCurrentIndex(i => Math.max(i - 1, 0))}
          />
        )}
        {mode === 'side-by-side' && <SideBySideView flashcards={DEMO_DECK.flashcards} />}
        {mode === 'test' && (
          <TestMode
            deck={DEMO_DECK}
            onBack={() => setMode('single')}
            onTestOptionsGenerated={() => {}}
          />
        )}
      </div>
    </div>
  );
}
