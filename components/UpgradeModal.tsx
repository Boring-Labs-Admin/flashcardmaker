'use client';

import { useAuth } from '@/lib/auth-context';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  anonymous?: boolean;
}

const CREDIT_PACKS = [
  { label: '1 Generation',  price: '£0.99',  gens: 1  },
  { label: '5 Generations', price: '£3.49',  gens: 5  },
  { label: '10 Generations', price: '£5.99', gens: 10 },
];

export default function UpgradeModal({ isOpen, onClose, anonymous }: UpgradeModalProps) {
  const { signInWithGoogle } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box upgrade-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#004AAD', margin: 0 }}>
              {anonymous ? "You've used today's free generation" : "You're out of generations"}
            </h2>
            <p style={{ margin: '0.4rem 0 0', opacity: 0.65, fontSize: '0.9rem' }}>
              {anonymous
                ? 'Sign up free to bank generations daily — or grab a credit pack.'
                : 'Top up with credits or go unlimited with Plus.'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', opacity: 0.4, lineHeight: 1, padding: '0.1rem 0.25rem', fontFamily: 'inherit' }}>✕</button>
        </div>

        {/* Sign up CTA for anonymous users */}
        {anonymous && (
          <div style={{ background: '#EEF4FF', border: '2px solid #004AAD', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Free account</div>
              <div style={{ fontSize: '0.82rem', opacity: 0.7, marginTop: '0.2rem' }}>Bank up to 5 generations • Save decks • No card required</div>
            </div>
            <button className="btn" style={{ whiteSpace: 'nowrap', padding: '0.5rem 1.1rem', fontSize: '0.85rem' }} onClick={signInWithGoogle}>
              Sign up free
            </button>
          </div>
        )}

        {/* Credit packs */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', opacity: 0.5, marginBottom: '0.6rem', textTransform: 'uppercase' }}>Credit Packs — one-time, stack, no expiry</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {CREDIT_PACKS.map((pack) => (
              <div key={pack.gens} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '2px solid #004AAD', borderRadius: 8, padding: '0.65rem 1rem' }}>
                <div>
                  <span style={{ fontWeight: 700 }}>{pack.label}</span>
                  <span style={{ opacity: 0.55, fontSize: '0.85rem', marginLeft: '0.5rem' }}>30 cards/deck</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: 800, color: '#004AAD' }}>{pack.price}</span>
                  <button disabled style={{ background: '#E0E8F5', border: 'none', borderRadius: 6, padding: '0.35rem 0.8rem', fontSize: '0.8rem', fontFamily: 'inherit', fontWeight: 700, cursor: 'not-allowed', color: '#004AAD', opacity: 0.6 }}>
                    Coming soon
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plus subscription */}
        <div style={{ background: '#004AAD', color: 'white', borderRadius: 10, padding: '1.1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>⚡ Flashcard Maker Plus</span>
              </div>
              <ul style={{ margin: 0, padding: '0 0 0 1.1rem', fontSize: '0.83rem', opacity: 0.85, lineHeight: 1.7 }}>
                <li>Unlimited generations</li>
                <li>60 cards per deck (double)</li>
                <li>20,000 character input limit</li>
                <li>Priority generation speed</li>
              </ul>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', minWidth: 120 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>£4.99<span style={{ fontWeight: 400, fontSize: '0.85rem', opacity: 0.8 }}>/mo</span></div>
                <div style={{ fontSize: '0.78rem', opacity: 0.7 }}>or £50/year</div>
              </div>
              <button disabled style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', borderRadius: 6, padding: '0.4rem 1rem', fontSize: '0.83rem', fontFamily: 'inherit', fontWeight: 700, cursor: 'not-allowed', color: 'white' }}>
                Coming soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
