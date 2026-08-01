'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useCardEditor } from './CardEditorProvider';

interface EnhancedResult {
  question: string;
  answer: string;
  answerClarifier?: string;
  answerFootnote?: string;
}

function CompareField({ label, original, enhanced }: { label: string; original: string; enhanced: string }) {
  const changed = original.trim() !== enhanced.trim();
  return (
    <div className="enhance-compare-field">
      <span className="enhance-field-label">{label}</span>
      <div className="enhance-compare-cols">
        <div className="enhance-compare-col">
          <span className="enhance-col-label">Original</span>
          <p>{original}</p>
        </div>
        <div className={`enhance-compare-col${changed ? ' changed' : ''}`}>
          <span className="enhance-col-label">Enhanced</span>
          <p>{enhanced}</p>
        </div>
      </div>
    </div>
  );
}

export default function AIEnhanceModal({
  index,
  onClose,
}: {
  index: number;
  onClose: () => void;
}) {
  const { cards, updateCard, deckId } = useCardEditor();
  const original = cards[index];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enhanced, setEnhanced] = useState<EnhancedResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetch(`/api/decks/${deckId}/cards/${index}/enhance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: original.question, answer: original.answer }),
    })
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (data.error) { setError(data.error); return; }
        setEnhanced(data);
      })
      .catch(() => { if (!cancelled) setError('Failed to enhance card. Please try again.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const handleApply = () => {
    if (!enhanced) return;
    updateCard(index, {
      question: enhanced.question,
      answer: enhanced.answer,
      answerClarifier: enhanced.answerClarifier,
      answerFootnote: enhanced.answerFootnote,
    });
    onClose();
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="modal-title">AI Enhanced Flashcard</div>

        {loading ? (
          <div className="enhance-loading"><Loader2 size={32} className="cbr-spin" /><p>Enhancing your card…</p></div>
        ) : error ? (
          <div className="modal-error">{error}</div>
        ) : enhanced ? (
          <>
            <CompareField label="Question" original={original.question} enhanced={enhanced.question} />
            <CompareField label="Answer" original={original.answer} enhanced={enhanced.answer} />
            {enhanced.answerClarifier && (
              <div className="enhance-added-field"><span className="enhance-field-label">Added Clarifier</span><p>{enhanced.answerClarifier}</p></div>
            )}
            {enhanced.answerFootnote && (
              <div className="enhance-added-field"><span className="enhance-field-label">Added Footnote</span><p>{enhanced.answerFootnote}</p></div>
            )}
            <div className="modal-actions-row">
              <button className="btn" onClick={handleApply}>Apply Changes</button>
              <button className="btn-outline" onClick={onClose}>Discard</button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
