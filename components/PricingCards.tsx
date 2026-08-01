'use client';

import { ReactNode } from 'react';
import { Check, Zap } from 'lucide-react';
import PricingCheckoutButtons from '@/components/PricingCheckoutButtons';
import PricingSignUpButton from '@/components/PricingSignUpButton';

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

function Tick({ light }: { light?: boolean }) {
  return <Check size={17} strokeWidth={3} className="tick-icon" color={light ? 'var(--yellow-bolt)' : undefined} />;
}

export default function PricingCards() {
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

      {/* Plus — highlighted */}
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
    </div>
  );
}
