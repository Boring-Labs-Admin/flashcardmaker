'use client';

import { useEffect, useState } from 'react';
import { useCardEditor } from './CardEditorProvider';

export default function SourceView() {
  const { cards, replaceAllCards } = useCardEditor();
  const [text, setText] = useState(() => JSON.stringify(cards, null, 2));
  const [error, setError] = useState('');

  useEffect(() => {
    setText(JSON.stringify(cards, null, 2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBlur = () => {
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error('Must be an array of cards.');
      for (const card of parsed) {
        if (typeof card.question !== 'string' || typeof card.answer !== 'string') {
          throw new Error('Every card needs a "question" and "answer" string.');
        }
      }
      setError('');
      replaceAllCards(parsed.map((c, i) => ({ id: c.id ?? `source-${Date.now()}-${i}`, ...c })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON.');
    }
  };

  return (
    <div className="source-view">
      <textarea
        className="source-textarea"
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={handleBlur}
        spellCheck={false}
      />
      {error && <div className="modal-error">{error}</div>}
    </div>
  );
}
