'use client';

import { useState } from 'react';
import { Flashcard, ViewMode } from '@/lib/types';
import SingleView from './SingleView';
import SideBySideView from './SideBySideView';
import GridView from './GridView';

const DEMO_CARDS: Flashcard[] = [
  { id: 'demo-1', question: 'What is the powerhouse of the cell?', answer: 'Mitochondria' },
  { id: 'demo-2', question: "What organelle controls the cell's activities and contains DNA?", answer: 'Nucleus' },
  { id: 'demo-3', question: 'What structure controls what enters and leaves the cell?', answer: 'Cell membrane' },
  { id: 'demo-4', question: 'Where does protein synthesis take place?', answer: 'Ribosomes' },
  { id: 'demo-5', question: 'What organelle stores water and helps support a plant cell?', answer: 'Vacuole' },
];

export default function StudyModesDemo() {
  const [mode, setMode] = useState<ViewMode>('single');
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="study-demo">
      <div className="mock-mode-tabs">
        <button className={`mock-mode-tab${mode === 'single' ? ' active' : ''}`} onClick={() => setMode('single')}>Single</button>
        <button className={`mock-mode-tab${mode === 'side-by-side' ? ' active' : ''}`} onClick={() => setMode('side-by-side')}>Side-by-side</button>
        <button className={`mock-mode-tab${mode === 'grid' ? ' active' : ''}`} onClick={() => setMode('grid')}>Grid</button>
      </div>
      <div className="study-demo-viewport">
        {mode === 'single' && (
          <SingleView
            flashcards={DEMO_CARDS}
            currentIndex={currentIndex}
            onNext={() => setCurrentIndex(i => Math.min(i + 1, DEMO_CARDS.length - 1))}
            onPrevious={() => setCurrentIndex(i => Math.max(i - 1, 0))}
          />
        )}
        {mode === 'side-by-side' && <SideBySideView flashcards={DEMO_CARDS} />}
        {mode === 'grid' && <GridView flashcards={DEMO_CARDS} />}
      </div>
    </div>
  );
}
