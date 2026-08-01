'use client';

import { useState } from 'react';
import { ChevronsRight, ChevronsLeft, ArrowUpDown } from 'lucide-react';
import { useCardEditor } from './CardEditorProvider';
import BulkActionsDropdown from './BulkActionsDropdown';
import MoveToDeckModal from './MoveToDeckModal';

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

export default function CardNavigatorSidebar({
  scrollToCard,
}: {
  scrollToCard: (index: number) => void;
}) {
  const { cards, activeIndex, selectedIndices, toggleSelect, selectAll, clearSelection, bulkDelete, bulkDuplicate, bulkMove } = useCardEditor();
  const [expanded, setExpanded] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const [showMoveModal, setShowMoveModal] = useState(false);

  const allSelected = cards.length > 0 && selectedIndices.size === cards.length;
  const order = sortAsc ? cards.map((_, i) => i) : cards.map((_, i) => i).reverse();

  if (!expanded) {
    return (
      <div className="card-nav-collapsed">
        <button className="card-nav-expand" onClick={() => setExpanded(true)} aria-label="Expand card list">
          <ChevronsRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="card-navigator">
      <div className="nav-header">
        <span>CARDS</span>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <button className="nav-sort-btn" onClick={() => setSortAsc(s => !s)} aria-label="Toggle sort order" title="Sort">
            <ArrowUpDown size={13} />
          </button>
          <button className="card-nav-collapse" onClick={() => setExpanded(false)} aria-label="Collapse card list">
            <ChevronsLeft size={16} />
          </button>
        </div>
      </div>

      <div className="nav-toolbar">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={e => e.target.checked ? selectAll() : clearSelection()}
          aria-label="Select all cards"
        />
        {selectedIndices.size > 0 ? (
          <BulkActionsDropdown
            count={selectedIndices.size}
            onDelete={() => bulkDelete(Array.from(selectedIndices))}
            onDuplicate={() => bulkDuplicate(Array.from(selectedIndices))}
            onMove={() => setShowMoveModal(true)}
          />
        ) : (
          <span className="nav-toolbar-hint">Select cards for bulk actions</span>
        )}
      </div>

      <div className="nav-card-list">
        {order.map(i => {
          const card = cards[i];
          return (
            <div
              key={card.id}
              className={`nav-card-item${activeIndex === i ? ' active' : ''}`}
              onClick={() => scrollToCard(i)}
            >
              <input
                type="checkbox"
                checked={selectedIndices.has(i)}
                onChange={e => { e.stopPropagation(); toggleSelect(i, e.target.checked); }}
                onClick={e => e.stopPropagation()}
              />
              <div className="nav-card-item-text">
                <span className="nav-card-item-q">{i + 1}: {truncate(card.question || '(empty)', 30)}</span>
                <span className="nav-card-item-a">{truncate(card.answer || '(empty)', 20)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {showMoveModal && (
        <MoveToDeckModal
          onMove={async (targetDeckId) => {
            const ok = await bulkMove(Array.from(selectedIndices), targetDeckId);
            if (ok) setShowMoveModal(false);
            return ok;
          }}
          onClose={() => setShowMoveModal(false)}
        />
      )}
    </div>
  );
}
