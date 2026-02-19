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
  { label: '1 generation',   price: '£0.99', perUnit: '£0.99 each',  saving: null,        badge: null },
  { label: '5 generations',  price: '£3.49', perUnit: '£0.70 each',  saving: 'Save 29%',  badge: null },
  { label: '10 generations', price: '£5.99', perUnit: '£0.60 each',  saving: 'Best value', badge: '🏆' },
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
  const totalRemaining = planData ? (planData.free_banked ?? 0) + (planData.paid_credits ?? 0) : 0;

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

        {/* ── PLAN SECTION ── */}
        {!isAdmin && planData && (
          <div style={{ marginBottom: '2.5rem', border: '2px solid #004AAD', borderRadius: 14, overflow: 'hidden', fontFamily: '"IBM Plex Mono", monospace' }}>

            {/* Current plan status bar */}
            <div style={{ background: '#004AAD', color: 'white', padding: '0.9rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.75 }}>Current Plan</span>
                <span style={{
                  background: isPlus ? '#F5C518' : 'rgba(255,255,255,0.18)',
                  color: isPlus ? '#004AAD' : 'white',
                  borderRadius: 20,
                  padding: '0.2rem 0.75rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>
                  {isPlus ? '⚡ Plus' : 'Free'}
                </span>
              </div>
              {!isPlus && (
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                  Upgrade to Plus for unlimited access
                </span>
              )}
            </div>

            <div style={{ padding: '1.5rem', background: 'white' }}>

              {/* Free plan limits + generation count */}
              {!isPlus && (
                <div style={{ marginBottom: '1.75rem' }}>
                  {/* Generation count */}
                  <div style={{
                    padding: '0.85rem 1.1rem',
                    background: totalRemaining === 0 ? '#FFF5F5' : '#EEF4FF',
                    border: `1.5px solid ${totalRemaining === 0 ? '#FFB3B3' : '#C7D9F5'}`,
                    borderRadius: 9,
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: totalRemaining === 0 ? '#c00' : '#004AAD' }}>
                        {totalRemaining === 0
                          ? '⚠ No generations remaining'
                          : `✓ ${totalRemaining} generation${totalRemaining !== 1 ? 's' : ''} available`}
                      </div>
                      <div style={{ fontSize: '0.77rem', opacity: 0.6, marginTop: '0.2rem' }}>
                        {planData.free_banked > 0 && `${planData.free_banked} free banked`}
                        {planData.free_banked > 0 && planData.paid_credits > 0 && ' · '}
                        {planData.paid_credits > 0 && `${planData.paid_credits} paid credit${planData.paid_credits !== 1 ? 's' : ''}`}
                      </div>
                    </div>
                    <Link href="/" style={{ fontSize: '0.8rem', color: '#004AAD', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                      Create flashcards →
                    </Link>
                  </div>

                  {/* Free plan details */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem' }}>
                    {[
                      { icon: '📅', text: '1 generation per day' },
                      { icon: '🏦', text: 'Up to 5 banked' },
                      { icon: '🃏', text: '30 cards per deck' },
                      { icon: '📝', text: '5,000 character input' },
                    ].map(item => (
                      <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', opacity: 0.7 }}>
                        <span>{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Plus plan details */}
              {isPlus && (
                <div style={{ marginBottom: '1.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
                  {[
                    { icon: '♾️', text: 'Unlimited generations' },
                    { icon: '🃏', text: '60 cards per deck' },
                    { icon: '📝', text: '20,000 character input' },
                    { icon: '⚡', text: 'Priority processing' },
                  ].map(item => (
                    <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', opacity: 0.7 }}>
                      <span>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {!isPlus && (
                <>
                  {/* ── Section 1: Credit packs ── */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#004AAD', marginBottom: '0.2rem' }}>Need a few more decks?</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>One-time credit packs · stack with free generations · never expire</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {CREDIT_PACKS.map((pack) => (
                        <div key={pack.label} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: pack.badge ? '2px solid #004AAD' : '1.5px solid #C7D9F5',
                          borderRadius: 9,
                          padding: '0.65rem 1rem',
                          background: pack.badge ? '#EEF4FF' : 'white',
                        }}>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                              {pack.badge && <span style={{ marginRight: '0.35rem' }}>{pack.badge}</span>}
                              {pack.label}
                            </span>
                            <span style={{ fontSize: '0.75rem', opacity: 0.55, marginLeft: '0.5rem' }}>{pack.perUnit}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            {pack.saving && (
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#007a3d', background: '#E6F4EC', borderRadius: 4, padding: '0.15rem 0.4rem' }}>
                                {pack.saving}
                              </span>
                            )}
                            <span style={{ fontWeight: 800, color: '#004AAD', fontSize: '0.9rem' }}>{pack.price}</span>
                            <button disabled style={{ background: '#E0E8F5', border: 'none', borderRadius: 6, padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontFamily: 'inherit', fontWeight: 700, cursor: 'not-allowed', color: '#004AAD', opacity: 0.65 }}>
                              Coming soon
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', opacity: 0.3 }}>
                    <div style={{ flex: 1, height: 1, background: '#004AAD' }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>or</span>
                    <div style={{ flex: 1, height: 1, background: '#004AAD' }} />
                  </div>

                  {/* ── Section 2: Plus ── */}
                  <div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#004AAD', marginBottom: '0.2rem' }}>Use Flashcard Maker regularly?</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Unlimited access, bigger decks, and faster processing</div>
                    </div>
                    <div style={{ background: '#004AAD', borderRadius: 10, padding: '1.1rem 1.25rem', color: 'white' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.6rem' }}>⚡ Flashcard Maker Plus</div>
                          <ul style={{ margin: 0, padding: '0 0 0 1rem', fontSize: '0.83rem', lineHeight: 1.8, opacity: 0.9 }}>
                            <li>Unlimited deck generation — never run out</li>
                            <li>Create larger decks (up to 60 cards)</li>
                            <li>Paste entire chapters (20,000 characters)</li>
                            <li>Faster processing, priority queue</li>
                          </ul>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', minWidth: 120 }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, fontSize: '1.3rem', lineHeight: 1 }}>£4.99<span style={{ fontWeight: 400, fontSize: '0.82rem', opacity: 0.75 }}>/mo</span></div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.65, marginTop: '0.2rem' }}>or £50/year</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.1rem' }}>save 2 months</div>
                          </div>
                          <button disabled style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.45)', borderRadius: 7, padding: '0.45rem 1rem', fontSize: '0.82rem', fontFamily: 'inherit', fontWeight: 700, cursor: 'not-allowed', color: 'white', whiteSpace: 'nowrap' }}>
                            Coming soon
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
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
