'use client';

import { useState } from 'react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async (productKey: 'plus_monthly' | 'plus_yearly') => {
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
      // silently reset — user can retry
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#004AAD',
          borderRadius: 16,
          padding: '2rem',
          maxWidth: 400,
          width: '100%',
          fontFamily: '"IBM Plex Mono", monospace',
          boxShadow: '0 20px 60px rgba(0,74,173,0.35)',
          position: 'relative',
          color: 'white',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Recommended badge */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span style={{
            background: '#F5C518',
            color: '#004AAD',
            fontSize: '0.65rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            padding: '0.25rem 0.75rem',
            borderRadius: 20,
            textTransform: 'uppercase',
          }}>
            Recommended
          </span>
        </div>

        {/* Header */}
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Use it regularly?
        </div>
        <div style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          ⚡ Flashcard Maker Plus
        </div>

        {/* Features */}
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            'Unlimited deck generation',
            'Create larger decks (up to 60 cards)',
            'Paste entire chapters (up to 100,000 chars)',
            'Upload up to 20 files at once',
            'Faster processing, priority queue',
          ].map(feature => (
            <li key={feature} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#F5C518', fontWeight: 800 }}>✓</span>
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
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
              fontFamily: 'inherit',
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
              fontFamily: 'inherit',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              color: 'white',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading === 'plus_yearly' ? 'Opening…' : '£39/year — save 35%'}
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              padding: '0.6rem',
              fontSize: '0.82rem',
              fontFamily: 'inherit',
              fontWeight: 600,
              cursor: 'pointer',
              color: 'white',
              opacity: 0.55,
            }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
