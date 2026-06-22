'use client';

import { useState, ReactNode } from 'react';
import posthog from 'posthog-js';
import { Check, Zap } from 'lucide-react';
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
  'Up to 30 cards per deck',
  'Save decks to your Flashboard',
  'Flip, list & test study modes',
  'Download decks as PDF',
];

const PLUS_FEATURES: ReactNode[] = [
  <span key="unlimited"><b>Unlimited</b> generations</span>,
  <span key="topic">Generate decks from <b>any topic</b> with AI</span>,
  <span key="cards">Up to <b>60 cards</b> per deck</span>,
  '100,000 character input',
  'Up to 20 files per generation',
  'Priority generation speed',
  'Everything in Free',
];

const CREDIT_FEATURES = [
  'One-time purchase, no expiry',
  'Stacks with your free daily generation',
  'Up to 30 cards per deck',
];

function Tick({ light }: { light?: boolean }) {
  return <Check size={17} strokeWidth={3} className="tick-icon" color={light ? 'var(--yellow-bolt)' : undefined} />;
}

export default function PricingCards() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);

  const handleBuyCredits = async (productKey: string) => {
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
      // silently reset — user can retry
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="pricing-cards-grid">

      {/* Free */}
      <div className="tier">
        <div className="kicker">Free account</div>
        <div className="price">£0<small> /forever</small></div>
        <p className="sub">No card required</p>
        <PricingSignUpButton />
        <ul>
          {FREE_FEATURES.map((f) => (
            <li key={f}><Tick />{f}</li>
          ))}
        </ul>
      </div>

      {/* Plus — highlighted, middle */}
      <div className="tier pop">
        <span className="pop-badge">Most popular</span>
        <div className="kicker"><Zap size={13} /> Flashcard Maker Plus</div>
        <div className="price">£4.99<small> /month</small></div>
        <p className="sub">or £39/year — save 35%</p>
        <PricingCheckoutButtons />
        <ul>
          {PLUS_FEATURES.map((f, i) => (
            <li key={i}><Tick light />{f}</li>
          ))}
        </ul>
      </div>

      {/* Credit Packs */}
      <div className="tier">
        <div className="kicker">Credit packs</div>
        <div className="price">From £0.99</div>
        <p className="sub">One-off · never expires</p>
        <div className="packs">
          {CREDIT_PACKS.map((pack) => (
            <button
              key={pack.label}
              className="pack"
              onClick={() => handleBuyCredits(pack.productKey)}
              disabled={loading === pack.productKey}
            >
              <span>{pack.label}</span>
              <b>{loading === pack.productKey ? '…' : pack.price}</b>
            </button>
          ))}
        </div>
        <ul>
          {CREDIT_FEATURES.map((f) => (
            <li key={f}><Tick />{f}</li>
          ))}
        </ul>
      </div>

      <FlashboardModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </div>
  );
}
