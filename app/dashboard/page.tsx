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
  { label: '1 generation',  price: '£0.99' },
  { label: '5 generations', price: '£3.49' },
  { label: '10 generations', price: '£5.99' },
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [fetching, setFetching] = useState(true);
  const [studyingDeck, setStudyingDeck] = useState<Deck | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [planData, setPlanData] = useState<UserPlanData | null>(null);

  // Redirect non-authenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Fetch decks + plan once user is confirmed
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
    if (res.ok) {
      setDecks(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleStudy = (deck: Deck) => {
    setStudyingDeck(deck);
    setCurrentIndex(0);
    setViewMode('single');
  };

  // ── AUTH LOADING ──────────────────────────────────────
  if (loading || (!user && !loading)) {
    return null;
  }

  const isAdmin = user?.email === ADMIN_EMAIL;

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

  // Generation count label
  const genLabel = (() => {
    if (!planData || planData.plan === 'plus') return null;
    const total = (planData.free_banked ?? 0) + (planData.paid_credits ?? 0);
    if (total === 0) return { text: 'No generations remaining', warn: true };
    const parts: string[] = [];
    if (planData.free_banked > 0) parts.push(`${planData.free_banked} free banked`);
    if (planData.paid_credits > 0) parts.push(`${planData.paid_credits} credit${planData.paid_credits !== 1 ? 's' : ''}`);
    return { text: parts.join(' · '), warn: false };
  })();

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

        {/* ── PLAN SECTION (non-admin only) ── */}
        {!isAdmin && planData && (
          <div style={{ marginBottom: '2.5rem', border: '2px solid #004AAD', borderRadius: 14, overflow: 'hidden' }}>
            {/* Plan header */}
            <div style={{ background: '#004AAD', color: 'white', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 800, fontSize: '1rem' }}>Your Plan</span>
              <span style={{
                background: planData.plan === 'plus' ? '#F5C518' : 'rgba(255,255,255,0.2)',
                color: planData.plan === 'plus' ? '#004AAD' : 'white',
                borderRadius: 20,
                padding: '0.2rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                {planData.plan === 'plus' ? '⚡ Plus' : 'Free'}
              </span>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', background: 'white' }}>
              {/* Generation count */}
              {genLabel && (
                <div style={{
                  marginBottom: '1.25rem',
                  padding: '0.75rem 1rem',
                  background: genLabel.warn ? '#FFF5F5' : '#EEF4FF',
                  border: `1px solid ${genLabel.warn ? '#FFB3B3' : '#C7D9F5'}`,
                  borderRadius: 8,
                  fontSize: '0.9rem',
                  color: genLabel.warn ? '#c00' : '#004AAD',
                  fontWeight: 600,
                }}>
                  {genLabel.warn ? '⚠ ' : '✓ '}
                  {genLabel.text}
                  {genLabel.warn && (
                    <span style={{ fontWeight: 400, color: '#555', marginLeft: '0.4rem' }}>
                      — top up below to continue generating
                    </span>
                  )}
                </div>
              )}

              {planData.plan !== 'plus' && (
                <>
                  {/* Credit packs */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                      Top up with credits — one-time, stack, no expiry
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {CREDIT_PACKS.map((pack) => (
                        <div key={pack.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1.5px solid #C7D9F5', borderRadius: 8, padding: '0.6rem 0.9rem' }}>
                          <span style={{ fontSize: '0.875rem' }}>{pack.label}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontWeight: 800, color: '#004AAD', fontSize: '0.9rem' }}>{pack.price}</span>
                            <button disabled style={{ background: '#E0E8F5', border: 'none', borderRadius: 6, padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontFamily: 'inherit', fontWeight: 700, cursor: 'not-allowed', color: '#004AAD', opacity: 0.65 }}>
                              Coming soon
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Plus upgrade */}
                  <div style={{ background: '#004AAD', borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ color: 'white' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.25rem' }}>⚡ Upgrade to Flashcard Maker Plus</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Unlimited generations · 60 cards/deck · 20k input · Priority speed</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                      <div style={{ color: 'white', textAlign: 'right' }}>
                        <div style={{ fontWeight: 800 }}>£4.99<span style={{ fontWeight: 400, fontSize: '0.8rem', opacity: 0.8 }}>/mo</span></div>
                        <div style={{ fontSize: '0.72rem', opacity: 0.65 }}>or £50/year</div>
                      </div>
                      <button disabled style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 6, padding: '0.4rem 0.9rem', fontSize: '0.8rem', fontFamily: 'inherit', fontWeight: 700, cursor: 'not-allowed', color: 'white' }}>
                        Coming soon
                      </button>
                    </div>
                  </div>
                </>
              )}

              {planData.plan === 'plus' && (
                <div style={{ fontSize: '0.875rem', opacity: 0.6 }}>
                  Unlimited generations · 60 cards/deck · 20,000 character input
                </div>
              )}
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
