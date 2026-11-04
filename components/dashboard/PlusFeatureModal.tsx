'use client';

import { Sparkles, X } from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';

// Shown when a free user tries a Plus-only feature. "Upgrade" opens the pricing modal.
export default function PlusFeatureModal({
  title,
  description,
  onClose,
}: {
  title: string;
  description: string;
  onClose: () => void;
}) {
  const { setUpgradeOpen } = useDashboard();

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal" style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--cobalt-blue)', marginBottom: '0.75rem' }}>
          <Sparkles size={36} strokeWidth={1.75} />
        </div>
        <div className="modal-title">{title}</div>
        <p className="modal-note" style={{ marginBottom: '1.25rem' }}>{description}</p>
        <button className="modal-btn" onClick={() => { onClose(); setUpgradeOpen(true); }}>Upgrade to Plus</button>
        <button className="modal-close" onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}
