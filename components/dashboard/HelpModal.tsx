'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard-context';

const FAQS = [
  {
    q: 'How do I create flashcards?',
    a: 'Go to "Create Flashcards" in the sidebar, then upload a file (PDF, Word doc or image), paste your notes as text, or — on Plus — generate a deck from any topic. Your deck is ready in seconds.',
  },
  {
    q: 'How do I save a deck?',
    a: 'Decks you generate while logged in are saved to "Your Flashcards" automatically. You can rename, recolour, study or delete any saved deck from there.',
  },
  {
    q: 'How many flashcards can I generate?',
    a: 'Free accounts get 1 generation per day (banking up to 5 unused) with up to 30 cards per deck. Plus accounts get unlimited generations with up to 60 cards per deck.',
  },
  {
    q: "What's the difference between Free and Plus?",
    a: 'Plus adds unlimited generations, AI topic generation (no notes needed), 60 cards per deck, a 100,000 character input limit, up to 20 files per generation, and priority processing speed. See "Upgrade Plan" in the user menu for full details.',
  },
  {
    q: 'How do I test myself on a deck?',
    a: 'Click "Test" on any deck in "Your Flashcards" to jump straight into a multiple-choice test, or open "Test Yourself" in the sidebar to pick a deck first.',
  },
  {
    q: 'What file types can I upload?',
    a: 'PDF, Word documents (.docx/.doc), and common image formats (JPG, PNG, GIF, WEBP, HEIC). Plain text can also be pasted directly.',
  },
  {
    q: 'How do I cancel or manage my subscription?',
    a: 'Open Settings → Billing and click "Manage Subscription" — this takes you to a secure Stripe portal where you can update payment details or cancel anytime.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Open Settings → Account and click "Delete Account". This permanently removes your account and all saved decks — this cannot be undone.',
  },
];

export default function HelpModal() {
  const { isHelpOpen, setHelpOpen } = useDashboard();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!isHelpOpen) return null;

  return (
    <div className="modal-overlay active" onClick={() => setHelpOpen(false)}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Help &amp; FAQ</div>
        <div className="modal-subtitle">Quick answers to common questions</div>

        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q} style={{ border: '1.5px solid #E0E8F5', borderRadius: 8, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left', background: isOpen ? '#EEF4FF' : 'white',
                    border: 'none', padding: '0.75rem 1rem', fontFamily: 'inherit', fontWeight: 700,
                    fontSize: '0.85rem', color: '#004AAD', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem',
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ flexShrink: 0 }}>{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', lineHeight: 1.6, opacity: 0.75 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button className="modal-close" onClick={() => setHelpOpen(false)}>✕ Close</button>
      </div>
    </div>
  );
}
