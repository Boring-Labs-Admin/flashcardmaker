'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function PricingCheckoutButtons() {
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = async (productKey: 'plus_monthly' | 'plus_yearly') => {
    if (!user) {
      router.push('/');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.5rem' }}>
      <button
        onClick={() => handleCheckout('plus_monthly')}
        disabled={!!loading}
        style={{
          width: '100%',
          background: '#F5C518',
          border: 'none',
          borderRadius: 8,
          padding: '0.75rem',
          fontSize: '0.9rem',
          fontFamily: '"IBM Plex Mono", monospace',
          fontWeight: 800,
          cursor: loading ? 'not-allowed' : 'pointer',
          color: '#004AAD',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading === 'plus_monthly' ? 'Opening…' : 'Get Plus — £4.99/month'}
      </button>
      <button
        onClick={() => handleCheckout('plus_yearly')}
        disabled={!!loading}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.35)',
          borderRadius: 8,
          padding: '0.65rem',
          fontSize: '0.82rem',
          fontFamily: '"IBM Plex Mono", monospace',
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          color: 'white',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading === 'plus_yearly' ? 'Opening…' : '£39/year — save 35%'}
      </button>
      {!user && (
        <p style={{ fontSize: '0.72rem', opacity: 0.55, textAlign: 'center', margin: '0.25rem 0 0' }}>
          Sign up free first, then upgrade instantly
        </p>
      )}
    </div>
  );
}
