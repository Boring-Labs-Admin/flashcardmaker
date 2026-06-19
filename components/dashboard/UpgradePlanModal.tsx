'use client';

import { X } from 'lucide-react';
import PricingCards from '@/components/PricingCards';
import { useDashboard } from '@/lib/dashboard-context';

export default function UpgradePlanModal() {
  const { isUpgradeOpen, setUpgradeOpen } = useDashboard();
  if (!isUpgradeOpen) return null;

  return (
    <div className="modal-overlay active" onClick={() => setUpgradeOpen(false)}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="modal-title">Upgrade your plan</div>
          <div className="modal-subtitle">Start free. Upgrade when you need more.</div>
        </div>
        <PricingCards />
        <button className="modal-close" onClick={() => setUpgradeOpen(false)}><X size={14} /> Close</button>
      </div>
    </div>
  );
}
