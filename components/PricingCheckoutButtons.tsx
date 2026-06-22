'use client';

import { useState } from 'react';
import posthog from 'posthog-js';
import { useAuth } from '@/lib/auth-context';
import FlashboardModal from '@/components/FlashboardModal';

export default function PricingCheckoutButtons() {
  const [loading, setLoading] = useState<string | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const { user } = useAuth();

  const handleCheckout = async (productKey: 'plus_monthly' | 'plus_yearly') => {
    posthog.capture('upgrade_clicked', { productKey });
    if (!user) {
      setShowSignIn(true);
      return;
    }
    setLoading(productKey);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productKey }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // silently reset
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.5rem' }}>
        <button
          onClick={() => handleCheckout('plus_monthly')}
          disabled={!!loading}
          className="btn-cta-light"
          style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading === 'plus_monthly' ? 'Opening…' : 'Get Plus — £4.99/mo'}
        </button>
        <button
          onClick={() => handleCheckout('plus_yearly')}
          disabled={!!loading}
          className="btn-cta-ghost"
          style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading === 'plus_yearly' ? 'Opening…' : '£39/year — save 35%'}
        </button>
        {!user && (
          <p style={{ fontSize: '0.72rem', opacity: 0.7, textAlign: 'center', margin: '0.25rem 0 0' }}>
            Sign up free first, then upgrade instantly
          </p>
        )}
      </div>

      <FlashboardModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  );
}
