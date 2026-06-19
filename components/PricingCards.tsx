'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import PricingCheckoutButtons from '@/components/PricingCheckoutButtons';
import PricingSignUpButton from '@/components/PricingSignUpButton';
import FlashboardModal from '@/components/FlashboardModal';

const CREDIT_PACKS = [
  { label: '1 generation',   price: '£0.99', productKey: 'credits_1'  },
  { label: '5 generations',  price: '£3.49', productKey: 'credits_5'  },
  { label: '10 generations', price: '£5.99', productKey: 'credits_10' },
];

const FREE_FEATURES = [
  '1 free generation per day',
  'Banks up to 5 unused generations',
  '30 cards per deck',
  'Save decks to Flashboard',
  'All 3 view modes',
  'Download decks as PDF',
];

const CREDIT_FEATURES = [
  'One-time purchase, no expiry',
  'Credits stack with free generations',
  '30 cards per deck',
];

const PLUS_FEATURES = [
  'Generate decks from any topic with AI',
  'Unlimited generations',
  '60 cards per deck',
  '100,000 character input',
  'Up to 20 files per generation',
  'Priority generation speed',
  'Everything in Free',
];

export default function PricingCards() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);

  const handleBuyCredits = async (productKey: string) => {
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
      // silently reset — user can retry
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="pricing-cards-grid">

      {/* Free */}
      <div style={{ border: '2px solid #004AAD', borderRadius: 14, padding: '1.75rem', background: 'white' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Free</div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#004AAD', marginBottom: '0.25rem' }}>£0</div>
        <div style={{ fontSize: '0.82rem', opacity: 0.6, marginBottom: '1.5rem' }}>No card required</div>
        <PricingSignUpButton />
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {FREE_FEATURES.map((f) => (
            <li key={f} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#004AAD', flexShrink: 0 }}>✓</span>{f}
            </li>
          ))}
        </ul>
      </div>

      {/* Credit Packs */}
      <div style={{ border: '2px solid #004AAD', borderRadius: 14, padding: '1.75rem', background: 'white' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Credit Packs</div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#004AAD', marginBottom: '0.25rem' }}>From £0.99</div>
        <div style={{ fontSize: '0.82rem', opacity: 0.6, marginBottom: '1.5rem' }}>Top up from your Flashboard</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {CREDIT_PACKS.map((pack) => (
            <button
              key={pack.label}
              onClick={() => handleBuyCredits(pack.productKey)}
              disabled={loading === pack.productKey}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#EEF4FF', border: 'none', borderRadius: 7, padding: '0.5rem 0.75rem',
                fontSize: '0.85rem', width: '100%', fontFamily: 'inherit',
                cursor: loading === pack.productKey ? 'not-allowed' : 'pointer',
                opacity: loading === pack.productKey ? 0.65 : 1,
              }}>
              <span>{pack.label}</span>
              <span style={{ fontWeight: 800, color: '#004AAD' }}>
                {loading === pack.productKey ? '…' : pack.price}
              </span>
            </button>
          ))}
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {CREDIT_FEATURES.map((f) => (
            <li key={f} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#004AAD', flexShrink: 0 }}>✓</span>{f}
            </li>
          ))}
        </ul>
      </div>

      {/* Plus */}
      <div style={{ border: '3px solid #004AAD', borderRadius: 14, padding: '1.75rem', background: '#004AAD', color: 'white', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#F5C518', color: '#004AAD', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', padding: '0.2rem 0.75rem', borderRadius: 20, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Most popular
        </div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.7, textTransform: 'uppercase', marginBottom: '0.5rem' }}>⚡ Flashcard Maker Plus</div>
        <div style={{ marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 800 }}>£4.99</span>
          <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>/month</span>
        </div>
        <div style={{ fontSize: '0.82rem', opacity: 0.65, marginBottom: '1.25rem' }}>or £39/year — save 35%</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {PLUS_FEATURES.map((f) => (
            <li key={f} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#F5C518', flexShrink: 0 }}>✓</span>{f}
            </li>
          ))}
        </ul>
        <PricingCheckoutButtons />
      </div>

      <FlashboardModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </div>
  );
}
