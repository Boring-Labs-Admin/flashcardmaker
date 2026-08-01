'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Pencil, Trash2 } from 'lucide-react';
import { Confidence } from '@/lib/types';
import { CONFIDENCE_COLORS, UNRATED_COLOR } from '@/components/study/cbrConstants';
import { useCardEditor } from './CardEditorProvider';

export default function BrowseTab({ onEditCard }: { onEditCard: (index: number) => void }) {
  const { deckId, cards, deleteCard } = useCardEditor();
  const [search, setSearch] = useState('');
  const [confidenceByIndex, setConfidenceByIndex] = useState<Record<number, Confidence | null>>({});

  useEffect(() => {
    fetch(`/api/study/queue?deckId=${deckId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) return;
        const map: Record<number, Confidence | null> = {};
        (data.queue ?? []).forEach((c: { index: number; currentConfidence: Confidence | null }) => {
          map[c.index] = c.currentConfidence;
        });
        setConfidenceByIndex(map);
      })
      .catch(() => {});
  }, [deckId]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return cards
      .map((card, i) => ({ card, i }))
      .filter(({ card }) => !term || card.question.toLowerCase().includes(term) || card.answer.toLowerCase().includes(term));
  }, [cards, search]);

  return (
    <div className="browse-tab">
      <div className="browse-search-wrap">
        <Search size={15} />
        <input type="search" placeholder="Search cards..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="browse-table-wrap">
        <table className="cards-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Confidence</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ card, i }) => {
              const confidence = confidenceByIndex[i];
              return (
                <tr key={card.id}>
                  <td>{i + 1}</td>
                  <td className="browse-cell-text">{card.question || '(empty)'}</td>
                  <td className="browse-cell-text">{card.answer || '(empty)'}</td>
                  <td>
                    <span
                      className="browse-confidence-dot"
                      style={{ background: confidence ? CONFIDENCE_COLORS[confidence] : UNRATED_COLOR }}
                      title={confidence ? `Rated ${confidence}` : 'Not yet rated'}
                    />
                  </td>
                  <td className="browse-actions">
                    <button onClick={() => onEditCard(i)} aria-label="Edit card"><Pencil size={14} /></button>
                    <button onClick={() => deleteCard(i)} aria-label="Delete card"><Trash2 size={14} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="browse-empty">No cards match your search.</p>}
      </div>
    </div>
  );
}
