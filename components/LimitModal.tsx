'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import posthog from 'posthog-js';
import { CalendarClock, FileWarning, Zap, Scissors } from 'lucide-react';

type LimitReason = 'daily' | 'generations' | 'chars';

interface LimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: LimitReason;
  onSignIn?: () => void;
  charsOver?: number;
  onTrimText?: () => void;
}

const CONTENT: Record<LimitReason, { title: string; body: string; cta: string }> = {
  daily: {
    title: "You've used today's free generation",
    body: "Free accounts get 1 generation per day, banking up to 5. Sign up to start banking yours.",
    cta: 'Sign up free',
  },
  generations: {
    title: 'No generations remaining',
    body: 'You have used all your banked generations for today. Upgrade to Plus for unlimited access.',
    cta: 'Go to your Flashboard',
  },
  chars: {
    title: 'Text too long',
    body: 'The Free plan supports up to 20,000 characters (~10 pages). Upgrade to Plus for up to 100,000 characters — paste entire chapters and full documents.',
    cta: 'Go to your Flashboard',
  },
};

export default function LimitModal({ isOpen, onClose, reason, onSignIn, charsOver, onTrimText }: LimitModalProps) {
  useEffect(() => {
    if (isOpen) posthog.capture('limit_hit', { reason });
  }, [isOpen, reason]);

  if (!isOpen) return null;

  const { title, body, cta } = CONTENT[reason];
  const overText = charsOver && charsOver > 0
    ? ` Your text is ${charsOver.toLocaleString()} characters over the limit.`
    : '';

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
          background: 'white',
          borderRadius: 14,
          padding: '2rem',
          maxWidth: 420,
          width: '100%',
          fontFamily: '"IBM Plex Mono", monospace',
          boxShadow: '0 20px 60px rgba(0,74,173,0.18)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div style={{ color: '#004AAD', marginBottom: '0.75rem' }}>
          {reason === 'daily' ? <CalendarClock size={40} strokeWidth={1.75} /> : reason === 'chars' ? <FileWarning size={40} strokeWidth={1.75} /> : <Zap size={40} strokeWidth={1.75} />}
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#004AAD', marginBottom: '0.75rem', lineHeight: 1.3 }}>
          {title}
        </h2>

        {/* Body */}
        <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem', lineHeight: 1.6 }}>
          {body}{overText}
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {reason === 'chars' && onTrimText && (
            <button
              onClick={onTrimText}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                background: '#004AAD',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '0.7rem 1.25rem',
                fontSize: '0.88rem',
                fontFamily: 'inherit',
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <Scissors size={15} /> Trim text and try again
            </button>
          )}
          {reason === 'daily' && onSignIn ? (
            <button
              onClick={() => { onSignIn(); onClose(); }}
              style={{
                background: '#004AAD',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '0.7rem 1.25rem',
                fontSize: '0.88rem',
                fontFamily: 'inherit',
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%',
              }}
            >
              {cta}
            </button>
          ) : (
            <Link
              href="/dashboard"
              onClick={onClose}
              style={{
                display: 'block',
                textAlign: 'center',
                background: onTrimText ? 'transparent' : '#004AAD',
                color: onTrimText ? '#004AAD' : 'white',
                border: onTrimText ? '1.5px solid #E0E8F5' : 'none',
                borderRadius: 8,
                padding: '0.7rem 1.25rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                textDecoration: 'none',
                opacity: onTrimText ? 0.75 : 1,
              }}
            >
              {cta} →
            </Link>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1.5px solid #E0E8F5',
              borderRadius: 8,
              padding: '0.65rem 1.25rem',
              fontSize: '0.85rem',
              fontFamily: 'inherit',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#004AAD',
              opacity: 0.65,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
