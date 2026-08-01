'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function BulkActionsDropdown({
  count,
  onDelete,
  onDuplicate,
  onMove,
}: {
  count: number;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="bulk-actions-wrap">
      <button className="bulk-actions-btn" onClick={() => setOpen(o => !o)}>
        Bulk Actions ({count}) <ChevronDown size={14} />
      </button>
      {open && (
        <div className="bulk-actions-menu" onMouseLeave={() => setOpen(false)}>
          {confirmDelete ? (
            <div className="bulk-actions-confirm">
              <span>Delete {count} card{count === 1 ? '' : 's'}?</span>
              <div>
                <button onClick={() => { setConfirmDelete(false); setOpen(false); onDelete(); }}>Yes</button>
                <button onClick={() => setConfirmDelete(false)}>No</button>
              </div>
            </div>
          ) : (
            <>
              <button className="danger" onClick={() => setConfirmDelete(true)}>Delete Selected</button>
              <button onClick={() => { setOpen(false); onMove(); }}>Move to Another Deck</button>
              <button onClick={() => { setOpen(false); onDuplicate(); }}>Duplicate Selected</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
