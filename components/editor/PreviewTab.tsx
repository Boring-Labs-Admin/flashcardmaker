'use client';

import { useState } from 'react';
import LatexRenderer from '@/components/LatexRenderer';
import { useCardEditor } from './CardEditorProvider';

function PreviewCard({ index }: { index: number }) {
  const { cards } = useCardEditor();
  const card = cards[index];
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="preview-card">
      <div className="preview-card-number">{index + 1}</div>
      <div className="preview-card-body">
        {card.questionImage && <img className="preview-card-image" src={card.questionImage} alt="" />}
        <p className="preview-card-question"><LatexRenderer text={card.question || '(empty)'} /></p>
        {card.questionAudio && <audio controls src={card.questionAudio} />}

        {revealed && (
          <>
            <div className="preview-card-divider" />
            {card.answerImage && <img className="preview-card-image" src={card.answerImage} alt="" />}
            <p className="preview-card-answer"><LatexRenderer text={card.answer || '(empty)'} /></p>
            {card.answerAudio && <audio controls src={card.answerAudio} />}
          </>
        )}
      </div>
      <button className="preview-card-toggle" onClick={() => setRevealed(r => !r)}>
        {revealed ? 'Hide Answer' : 'Reveal Answer'}
      </button>
    </div>
  );
}

export default function PreviewTab() {
  const { cards } = useCardEditor();

  if (cards.length === 0) {
    return <div className="dashboard-empty"><p>No cards yet — add some in the Edit tab.</p></div>;
  }

  return (
    <div className="preview-tab">
      {cards.map((card, i) => <PreviewCard key={card.id} index={i} />)}
    </div>
  );
}
