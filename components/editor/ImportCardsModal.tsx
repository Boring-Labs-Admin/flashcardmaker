'use client';

import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { useCardEditor } from './CardEditorProvider';

type Delimiter = 'tab' | 'comma' | 'newline-pair';

const DELIMITER_OPTIONS: { value: Delimiter; label: string }[] = [
  { value: 'tab', label: 'Tab-separated (Question [TAB] Answer)' },
  { value: 'comma', label: 'Comma-separated (Question, Answer)' },
  { value: 'newline-pair', label: 'Paragraph pairs (Question [blank line] Answer)' },
];

function parsePreview(text: string, delimiter: Delimiter): { question: string; answer: string }[] {
  const pairs: { question: string; answer: string }[] = [];

  if (delimiter === 'newline-pair') {
    const blocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
    for (let i = 0; i < blocks.length - 1; i += 2) {
      const question = blocks[i].trim();
      const answer = blocks[i + 1].trim();
      if (question && answer) pairs.push({ question, answer });
    }
    return pairs;
  }

  const sep = delimiter === 'tab' ? '\t' : ',';
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const idx = line.indexOf(sep);
    if (idx === -1) continue;
    const question = line.slice(0, idx).trim();
    const answer = line.slice(idx + 1).trim();
    if (question && answer) pairs.push({ question, answer });
  }
  return pairs;
}

export default function ImportCardsModal({ onClose }: { onClose: () => void }) {
  const { deckId, appendCards } = useCardEditor();
  const [delimiter, setDelimiter] = useState<Delimiter>('tab');
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');

  const parsedCards = useMemo(() => parsePreview(importText, delimiter), [importText, delimiter]);

  const handleImport = async () => {
    setImporting(true);
    setError('');
    try {
      const res = await fetch(`/api/decks/${deckId}/cards/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: importText, delimiter }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Import failed.'); return; }
      appendCards(data.deck.flashcards.slice(-data.importedCount));
      onClose();
    } catch {
      setError('Import failed. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="modal-title">Import / Paste Flashcards</div>
        <p className="modal-note" style={{ marginBottom: '1rem' }}>Paste your flashcards below. One card per line.</p>

        <label className="modal-field-label">Format</label>
        <select className="deck-name-input" value={delimiter} onChange={e => setDelimiter(e.target.value as Delimiter)}>
          {DELIMITER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>

        <textarea
          className="deck-name-input modal-textarea import-textarea"
          placeholder={'How big is a whale?\tMassive\nHow big is a goat?\tNot so massive'}
          value={importText}
          onChange={e => setImportText(e.target.value)}
          rows={8}
        />

        <div className="import-preview">
          <h4>Preview ({parsedCards.length} card{parsedCards.length === 1 ? '' : 's'} found)</h4>
          {parsedCards.slice(0, 5).map((card, i) => (
            <div key={i} className="import-preview-row">
              <span className="q">{card.question}</span>
              <span className="a">{card.answer}</span>
            </div>
          ))}
          {parsedCards.length > 5 && <p className="import-preview-more">…and {parsedCards.length - 5} more</p>}
        </div>

        {error && <div className="modal-error">{error}</div>}

        <button className="modal-btn" disabled={parsedCards.length === 0 || importing} onClick={handleImport}>
          {importing ? 'Importing…' : `Import ${parsedCards.length} Card${parsedCards.length === 1 ? '' : 's'}`}
        </button>
        <button className="modal-close" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
