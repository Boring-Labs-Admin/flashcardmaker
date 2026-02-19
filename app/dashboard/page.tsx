'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Deck } from '@/lib/types';
import { UserPlanData } from '@/lib/plans';
import NavBar from '@/components/NavBar';
import DeckCard from '@/components/DeckCard';
import SingleView from '@/components/SingleView';
import ViewToggle from '@/components/ViewToggle';
import SideBySideView from '@/components/SideBySideView';
import GridView from '@/components/GridView';
import { ViewMode } from '@/lib/types';

const ADMIN_EMAIL = 'admin@boringlabs.co.uk';

const CREDIT_PACKS = [
  { label: '1 generation',   price: '£0.99', perUnit: '£0.99 each',  saving: null,         best: false },
  { label: '5 generations',  price: '£3.49', perUnit: '£0.70 each',  saving: 'Save 29%',   best: false },
  { label: '10 generations', price: '£5.99', perUnit: '£0.60 each',  saving: 'Best value', best: true  },
];

const mono: React.CSSProperties = { fontFamily: '"IBM Plex Mono", monospace' };

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [fetching, setFetching] = useState(true);
  const [studyingDeck, setStudyingDeck] = useState<Deck | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [planData, setPlanData] = useState<UserPlanData | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    fetch('/api/decks')
      .then(r => r.json())
      .then(data => setDecks(data.decks || []))
      .catch(() => setDecks([]))
      .finally(() => setFetching(false));

    if (user.email !== ADMIN_EMAIL) {
      fetch('/api/user/plan')
        .then(r => r.json())
        .then(data => { if (!data.anonymous) setPlanData(data); })
        .catch(() => {});
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/decks?id=${id}`, { method: 'DELETE' });
    if (res.ok) setDecks(prev => prev.filter(d => d.id !== id));
  };

  const handleStudy = (deck: Deck) => {
    setStudyingDeck(deck);
    setCurrentIndex(0);
    setViewMode('single');
  };

  if (loading || (!user && !loading)) return null;

  const isAdmin = user?.email === ADMIN_EMAIL;
  const isPlus = planData?.plan === 'plus';
  const freeBanked = planData?.free_banked ?? 0;
  const paidCredits = planData?.paid_credits ?? 0;
  const totalRemaining = freeBanked + paidCredits;

  // ── STUDY VIEW ────────────────────────────────────────
  if (studyingDeck) {
    return (
      <main>
        <NavBar />
        <div className="container">
          <div className="dashboard-study-header">
            <button className="back-btn" onClick={() => setStudyingDeck(null)}>← Back to Flashboard</button>
            <h2 className="dashboard-study-title">{studyingDeck.title}</h2>
          </div>
          <div className="tool-panel">
            <div className="tool-toolbar">
              <div className="tool-toolbar-left">
                <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
                {viewMode === 'single' && (
                  <span className="progress">Card {currentIndex + 1} of {studyingDeck.flashcards.length}</span>
                )}
              </div>
            </div>
            <div className="tool-viewport">
              {viewMode === 'single' && (
                <SingleView
                  flashcards={studyingDeck.flashcards}
                  currentIndex={currentIndex}
                  onNext={() => setCurrentIndex(i => Math.min(i + 1, studyingDeck.flashcards.length - 1))}
                  onPrevious={() => setCurrentIndex(i => Math.max(i - 1, 0))}
                />
              )}
              {viewMode === 'side-by-side' && <SideBySideView flashcards={studyingDeck.flashcards} />}
              {viewMode === 'grid' && <GridView flashcards={studyingDeck.flashcards} />}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────
  return (
    <main>
      <NavBar />
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚡</div>
          <h1 className="dashboard-title">Your Flashboard</h1>
          <p className="dashboard-subtitle">
            {fetching ? 'Loading your decks...' : `${decks.length} deck${decks.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>
      </div>

      <div className="container">

        {/* ── PLAN COLUMNS (non-admin only) ── */}
        {!isAdmin && planData && (
          <div style={{ marginBottom: '2.5rem', ...mono }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1.25fr',
              gap: '1rem',
              alignItems: 'stretch',
            }}>

              {/* ── COL 1: Current Plan (Status) ── */}
              <div style={{ border: '1.5px solid #C7D9F5', borderRadius: 12, padding: '1.25rem', background: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.09em', opacity: 0.45, textTransform: 'uppercase' }}>Current Plan</span>
                  <span style={{
                    background: isPlus ? '#F5C518' : '#EEF4FF',
                    color: '#004AAD',
                    borderRadius: 20,
                    padding: '0.15rem 0.65rem',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    border: '1px solid #C7D9F5',
                  }}>
                    {isPlus ? '⚡ Plus' : 'Free'}
                  </span>
                </div>

                {/* Generation status */}
                <div style={{
                  marginBottom: '1rem',
                  padding: '0.6rem 0.75rem',
                  background: totalRemaining === 0 ? '#FFF5F5' : '#EEF4FF',
                  borderRadius: 7,
                  fontSize: '0.8rem',
                  color: totalRemaining === 0 ? '#c00' : '#004AAD',
                  fontWeight: 600,
                }}>
                  {totalRemaining === 0
                    ? '⚠ No generations left'
                    : `✓ ${totalRemaining} generation${totalRemaining !== 1 ? 's' : ''} available`}
                  {(freeBanked > 0 || paidCredits > 0) && (
                    <div style={{ fontWeight: 400, fontSize: '0.72rem', opacity: 0.65, marginTop: '0.2rem' }}>
                      {freeBanked > 0 && `${freeBanked} free banked`}
                      {freeBanked > 0 && paidCredits > 0 && ' · '}
                      {paidCredits > 0 && `${paidCredits} paid`}
                    </div>
                  )}
                </div>

                {/* Plan limits */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {(isPlus ? [
                    '♾️  Unlimited generations',
                    '🃏  60 cards per deck',
                    '📝  20,000 char input',
                    '⚡  Priority processing',
                  ] : [
                    '📅  1 generation per day',
                    '🏦  Up to 5 banked',
                    '🃏  30 cards per deck',
                    '📝  5,000 char input',
                  ]).map(line => (
                    <div key={line} style={{ fontSize: '0.78rem', opacity: 0.6 }}>{line}</div>
                  ))}
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <Link href="/" style={{ fontSize: '0.78rem', color: '#004AAD', fontWeight: 700, textDecoration: 'none' }}>
                    ⚡ Create flashcards →
                  </Link>
                </div>
              </div>

              {/* ── COL 2: Credit Packs ── */}
              <div style={{ border: '1.5px solid #C7D9F5', borderRadius: 12, padding: '1.25rem', background: 'white' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.09em', opacity: 0.45, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Need more decks now?</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#004AAD' }}>Credit Packs</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.55, marginTop: '0.2rem' }}>One-time · stack · never expire</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem' }}>
                  {CREDIT_PACKS.map(pack => (
                    <div key={pack.label} style={{
                      border: pack.best ? '2px solid #004AAD' : '1.5px solid #E0E8F5',
                      borderRadius: 8,
                      padding: '0.55rem 0.75rem',
                      background: pack.best ? '#EEF4FF' : 'white',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                          {pack.best && '🏆 '}{pack.label}
                        </span>
                        <span style={{ fontWeight: 800, color: '#004AAD', fontSize: '0.9rem' }}>{pack.price}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{pack.perUnit}</span>
                        {pack.saving && (
                          <span style={{ fontSize: '0.67rem', fontWeight: 700, color: '#007a3d', background: '#E6F4EC', borderRadius: 4, padding: '0.1rem 0.35rem' }}>
                            {pack.saving}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button disabled style={{ width: '100%', background: '#E0E8F5', border: 'none', borderRadius: 7, padding: '0.55rem', fontSize: '0.78rem', fontFamily: 'inherit', fontWeight: 700, cursor: 'not-allowed', color: '#004AAD', opacity: 0.65 }}>
                  Coming soon
                </button>
              </div>

              {/* ── COL 3: Plus (Hero) ── */}
              <div style={{ border: '2.5px solid #004AAD', borderRadius: 12, padding: '1.25rem', background: '#004AAD', color: 'white', position: 'relative' }}>
                {!isPlus && (
                  <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#F5C518', color: '#004AAD', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em', padding: '0.15rem 0.65rem', borderRadius: 20, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Recommended
                  </div>
                )}

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.09em', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Use it regularly?</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>⚡ Flashcard Maker Plus</div>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {[
                    'Unlimited deck generation',
                    'Create larger decks (up to 60 cards)',
                    'Paste entire chapters (20,000 chars)',
                    'Faster processing, priority queue',
                  ].map(f => (
                    <li key={f} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', opacity: 0.9 }}>
                      <span style={{ color: '#F5C518', flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>£4.99</span>
                    <span style={{ opacity: 0.7, fontSize: '0.82rem' }}>/month</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>or £50/year <span style={{ opacity: 0.8 }}>— save 2 months</span></div>
                </div>

                <button disabled style={{ width: '100%', background: '#F5C518', border: 'none', borderRadius: 7, padding: '0.6rem', fontSize: '0.82rem', fontFamily: 'inherit', fontWeight: 800, cursor: 'not-allowed', color: '#004AAD' }}>
                  Coming soon
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── DECKS ── */}
        {fetching ? (
          <div className="loading">
            <div className="spinner">⚡</div>
            <p style={{ opacity: 0.7, marginTop: '1rem' }}>Loading your decks...</p>
          </div>
        ) : decks.length === 0 ? (
          <div className="dashboard-empty">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
            <h2 style={{ marginBottom: '0.5rem' }}>No decks saved yet</h2>
            <p style={{ opacity: 0.7, marginBottom: '2rem' }}>Generate some flashcards and save them to your Flashboard.</p>
            <Link href="/" className="btn" style={{ display: 'inline-block', width: 'auto', padding: '0.75rem 2rem', textDecoration: 'none' }}>
              ⚡ Create Flashcards
            </Link>
          </div>
        ) : (
          <div className="deck-grid">
            {decks.map(deck => (
              <DeckCard key={deck.id} deck={deck} onDelete={handleDelete} onStudy={handleStudy} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
