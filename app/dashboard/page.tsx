'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Deck } from '@/lib/types';
import { UserPlanData, PLANS } from '@/lib/plans';
import NavBar from '@/components/NavBar';
import DeckCard from '@/components/DeckCard';
import SingleView from '@/components/SingleView';
import ViewToggle from '@/components/ViewToggle';
import SideBySideView from '@/components/SideBySideView';
import GridView from '@/components/GridView';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import TestMode from '@/components/TestMode';
import { ViewMode, TestOptions } from '@/lib/types';
import { getDecksBySubject } from '@/lib/library';
import Link from 'next/link';

const ADMIN_EMAIL = 'admin@boringlabs.co.uk';

const CREDIT_PACKS = [
  { label: '1 generation',   price: '£0.99', perUnit: '£0.99 each',  saving: null,         best: false, productKey: 'credits_1'  },
  { label: '5 generations',  price: '£3.49', perUnit: '£0.70 each',  saving: 'Save 29%',   best: false, productKey: 'credits_5'  },
  { label: '10 generations', price: '£5.99', perUnit: '£0.60 each',  saving: 'Best value', best: true,  productKey: 'credits_10' },
];

const mono: React.CSSProperties = { fontFamily: '"IBM Plex Mono", monospace' };

const SectionDivider = ({ label }: { label: string }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1.5px solid #E0E8F5',
    ...mono,
  }}>
    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.4, textTransform: 'uppercase' }}>{label}</span>
  </div>
);

function DashboardContent() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [fetching, setFetching] = useState(true);
  const [studyingDeck, setStudyingDeck] = useState<Deck | null>(null);
  const [testingDeck, setTestingDeck] = useState<Deck | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [planData, setPlanData] = useState<UserPlanData | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  // Detect ?payment=success after returning from Stripe Checkout
  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      setPaymentSuccess(true);
      // Remove the query param without adding a history entry
      router.replace('/dashboard');
      // Refresh plan data so new plan/credits are reflected immediately
      fetch('/api/user/plan')
        .then(r => r.json())
        .then(data => { if (!data.anonymous) setPlanData(data); })
        .catch(() => {});
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!user) return;

    // Show cached decks instantly if available, then refresh silently in background
    // Cache is keyed by user ID so switching accounts never leaks one user's decks to another
    const cacheKey = `decks_cache_${user.id}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        setDecks(JSON.parse(cached));
        setFetching(false);
      } catch { /* ignore corrupt cache */ }
    } else {
      setFetching(true);
    }

    fetch('/api/decks')
      .then(r => r.json())
      .then(data => {
        const fresh = data.decks || [];
        setDecks(fresh);
        sessionStorage.setItem(cacheKey, JSON.stringify(fresh));
      })
      .catch(() => {})
      .finally(() => setFetching(false));

    if (user.email !== ADMIN_EMAIL) {
      fetch('/api/user/plan')
        .then(r => r.json())
        .then(data => { if (!data.anonymous) setPlanData(data); })
        .catch(() => {});
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    const res = await fetch(`/api/decks?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setDecks(prev => {
        const updated = prev.filter(d => d.id !== id);
        if (user) sessionStorage.setItem(`decks_cache_${user.id}`, JSON.stringify(updated));
        return updated;
      });
    } else {
      setDeleteError('Failed to delete deck. Please try again.');
    }
  };

  const handleStudy = (deck: Deck) => {
    setStudyingDeck(deck);
    setCurrentIndex(0);
    setViewMode('single');
  };

  const handleTest = (deck: Deck) => {
    setTestingDeck(deck);
  };

  const handleTestOptionsGenerated = (deckId: string, options: TestOptions) => {
    setDecks(prev => {
      const updated = prev.map(d => d.id === deckId ? { ...d, test_options: options } : d);
      if (user) sessionStorage.setItem(`decks_cache_${user.id}`, JSON.stringify(updated));
      return updated;
    });
    setTestingDeck(prev => prev?.id === deckId ? { ...prev, test_options: options } : prev);
  };

  const handleDeckSaved = (deck: Deck) => {
    setDecks(prev => {
      const updated = [deck, ...prev];
      if (user) sessionStorage.setItem(`decks_cache_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleCheckout = async (productKey: string) => {
    setCheckoutLoading(productKey);
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
      setCheckoutLoading(null);
    }
  };

  const handlePortal = async () => {
    setCheckoutLoading('portal');
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // silently reset
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    const res = await fetch('/api/user/delete', { method: 'DELETE' });
    if (res.ok) {
      await signOut();
      router.push('/');
    } else {
      setDeleteError('Failed to delete account. Please try again or contact support@flashcardmaker.co.uk');
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeckUpdate = async (id: string, updates: { title?: string; color?: string }) => {
    const res = await fetch('/api/decks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (res.ok) {
      const { deck } = await res.json();
      setDecks(prev => {
        const updated = prev.map(d => d.id === id ? deck : d);
        if (user) sessionStorage.setItem(`decks_cache_${user.id}`, JSON.stringify(updated));
        return updated;
      });
    }
  };

  if (loading || (!user && !loading)) return null;

  const isAdmin = user?.email === ADMIN_EMAIL;
  const isPlus = planData?.plan === 'plus';
  const freeBanked = planData?.free_banked ?? 0;
  const paidCredits = planData?.paid_credits ?? 0;
  const totalRemaining = freeBanked + paidCredits;
  const maxGenerations = PLANS.free.maxBanked as number;

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

  // ── TEST VIEW ─────────────────────────────────────────
  if (testingDeck) {
    return (
      <main>
        <NavBar />
        <TestMode
          deck={testingDeck}
          onBack={() => setTestingDeck(null)}
          onTestOptionsGenerated={handleTestOptionsGenerated}
        />
      </main>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────
  const firstName = user?.user_metadata?.full_name?.split(' ')[0];
  const titleName = firstName ? `${firstName}'s` : 'Your';

  return (
    <main>
      <NavBar />

      {/* ── HEADER ── */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚡</div>
          <h1 className="dashboard-title">{titleName} Flashboard</h1>
          <p className="dashboard-subtitle">
            {fetching ? 'Loading your decks...' : `${decks.length} deck${decks.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>
      </div>

      <div className="container">

        {/* ── PAYMENT SUCCESS BANNER ── */}
        {paymentSuccess && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
            background: '#E6F4EC', border: '1.5px solid #6FCF97', borderRadius: 10,
            padding: '0.75rem 1.1rem', marginBottom: '1.5rem', gap: '1rem',
            fontFamily: '"IBM Plex Mono", monospace',
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#007a3d' }}>
              ✓ Payment successful — your plan has been updated.
            </span>
            <button onClick={() => setPaymentSuccess(false)} style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem',
              color: '#007a3d', lineHeight: 1, padding: 0,
            }}>×</button>
          </div>
        )}

        {/* ── DECK LIBRARY (PRIMARY) ── */}
        {!fetching && (
          <div style={{ ...mono, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.4, textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Your Saved Decks
          </div>
        )}
        {deleteError && <div className="error-message">{deleteError}</div>}
        {fetching ? (
          <div className="loading">
            <div className="spinner">⚡</div>
            <p style={{ opacity: 0.7, marginTop: '1rem' }}>Loading your decks...</p>
          </div>
        ) : decks.length === 0 ? (
          <div className="dashboard-empty">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
            <h2 style={{ marginBottom: '0.5rem' }}>No decks saved yet</h2>
            <p style={{ opacity: 0.7 }}>Generate a deck below to get started.</p>
          </div>
        ) : (
          <div className="deck-grid">
            {decks.map(deck => (
              <DeckCard key={deck.id} deck={deck} onDelete={handleDelete} onStudy={handleStudy} onTest={handleTest} onUpdate={handleDeckUpdate} />
            ))}
          </div>
        )}

        {/* ── CREATE NEW DECK ── */}
        <div style={{ marginTop: decks.length === 0 ? '2rem' : '3rem' }}>
          <SectionDivider label="Create New Deck" />
          <FlashcardGenerator hideFeatures onDeckSaved={handleDeckSaved} />
        </div>

        {/* ── PLAN SECTION (SECONDARY — non-admin only for free view) ── */}
        {(isAdmin || planData) && (
          <div style={{ marginTop: '3rem', ...mono }}>

            <SectionDivider label="Your Plan" />

            {/* ── PLUS USER VIEW (also admin) ── */}
            {(isPlus || isAdmin) ? (
              <div style={{
                border: '2px solid #004AAD',
                borderRadius: 12,
                padding: '1.5rem',
                background: '#004AAD',
                color: 'white',
                maxWidth: 560,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem' }}>⚡ Flashcard Maker Plus</span>
                  <span style={{
                    background: '#F5C518',
                    color: '#004AAD',
                    borderRadius: 20,
                    padding: '0.15rem 0.65rem',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>Active</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  {[
                    'Unlimited generations',
                    '60 cards per deck',
                    '20,000 character input',
                    'Priority processing enabled',
                  ].map(line => (
                    <div key={line} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.82rem', opacity: 0.9 }}>
                      <span style={{ color: '#F5C518', flexShrink: 0 }}>✓</span>{line}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={handlePortal}
                    disabled={checkoutLoading === 'portal'}
                    className="plan-ghost-btn"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: 7,
                      padding: '0.5rem 1rem',
                      fontSize: '0.78rem',
                      fontFamily: 'inherit',
                      fontWeight: 700,
                      cursor: checkoutLoading === 'portal' ? 'not-allowed' : 'pointer',
                      color: 'white',
                      opacity: checkoutLoading === 'portal' ? 0.65 : 1,
                    }}>
                    {checkoutLoading === 'portal' ? 'Opening…' : 'Manage Subscription'}
                  </button>
                </div>
              </div>
            ) : (
              /* ── FREE USER VIEW — 3-column layout ── */
              <div className="plan-grid">

                {/* COL 1: Current Plan */}
                <div style={{ border: '1.5px solid #C7D9F5', borderRadius: 12, padding: '1.25rem', background: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.09em', opacity: 0.45, textTransform: 'uppercase' }}>Current Plan</span>
                    <span style={{
                      background: '#EEF4FF',
                      color: '#004AAD',
                      borderRadius: 20,
                      padding: '0.15rem 0.65rem',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      border: '1px solid #C7D9F5',
                    }}>Free</span>
                  </div>

                  <div style={{
                    marginBottom: '1rem',
                    padding: '0.6rem 0.75rem',
                    background: totalRemaining === 0 ? '#FFF5F5' : '#EEF4FF',
                    borderRadius: 7,
                    fontSize: '0.8rem',
                    color: totalRemaining === 0 ? '#c00' : '#004AAD',
                    fontWeight: 600,
                  }}>
                    {totalRemaining} / {maxGenerations} generations available
                    {totalRemaining < maxGenerations && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.35rem', fontSize: '0.72rem', fontWeight: 700, color: '#007a3d' }}>
                        <span style={{ background: '#E6F4EC', borderRadius: 4, padding: '0.1rem 0.4rem' }}>
                          +1 free generation added daily
                        </span>
                      </div>
                    )}
                    {paidCredits > 0 && (
                      <div style={{ fontWeight: 400, fontSize: '0.72rem', opacity: 0.65, marginTop: '0.2rem' }}>
                        includes {paidCredits} paid credit{paidCredits !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {[
                      '📅  1 generation per day',
                      '🏦  Up to 5 banked',
                      '🃏  30 cards per deck',
                      '📝  5,000 char input',
                    ].map(line => (
                      <div key={line} style={{ fontSize: '0.78rem', opacity: 0.6 }}>{line}</div>
                    ))}
                  </div>
                </div>

                {/* COL 2: Credit Packs */}
                <div style={{ border: '1.5px solid #C7D9F5', borderRadius: 12, padding: '1.25rem', background: 'white' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.09em', opacity: 0.45, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Need more decks now?</div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#004AAD' }}>Credit Packs</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.55, marginTop: '0.2rem' }}>One-time · stack · never expire</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0' }}>
                    {CREDIT_PACKS.map(pack => (
                      <button
                        key={pack.label}
                        onClick={() => handleCheckout(pack.productKey)}
                        disabled={checkoutLoading === pack.productKey}
                        className="plan-credit-btn"
                        style={{
                          border: pack.best ? '2px solid #004AAD' : '1.5px solid #E0E8F5',
                          borderRadius: 8,
                          padding: '0.55rem 0.75rem',
                          background: pack.best ? '#EEF4FF' : 'white',
                          cursor: checkoutLoading === pack.productKey ? 'not-allowed' : 'pointer',
                          textAlign: 'left',
                          width: '100%',
                          opacity: checkoutLoading === pack.productKey ? 0.65 : 1,
                          fontFamily: 'inherit',
                        }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                            {pack.best && '🏆 '}{pack.label}
                          </span>
                          <span style={{ fontWeight: 800, color: '#004AAD', fontSize: '0.9rem' }}>
                            {checkoutLoading === pack.productKey ? '…' : pack.price}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{pack.perUnit}</span>
                          {pack.saving && (
                            <span style={{ fontSize: '0.67rem', fontWeight: 700, color: '#007a3d', background: '#E6F4EC', borderRadius: 4, padding: '0.1rem 0.35rem' }}>
                              {pack.saving}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* COL 3: Plus Hero */}
                <div style={{ border: '2.5px solid #004AAD', borderRadius: 12, padding: '1.25rem', background: '#004AAD', color: 'white', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#F5C518', color: '#004AAD', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em', padding: '0.15rem 0.65rem', borderRadius: 20, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Recommended
                  </div>

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

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleCheckout('plus_monthly')}
                      disabled={!!checkoutLoading}
                      className="plan-plus-primary-btn"
                      style={{
                        width: '100%', background: '#F5C518', border: 'none', borderRadius: 7,
                        padding: '0.6rem', fontSize: '0.82rem', fontFamily: 'inherit', fontWeight: 800,
                        cursor: checkoutLoading ? 'not-allowed' : 'pointer', color: '#004AAD',
                        opacity: checkoutLoading ? 0.7 : 1,
                      }}>
                      {checkoutLoading === 'plus_monthly' ? 'Opening…' : 'Get Plus — £4.99/month'}
                    </button>
                    <button
                      onClick={() => handleCheckout('plus_yearly')}
                      disabled={!!checkoutLoading}
                      className="plan-ghost-btn"
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)',
                        borderRadius: 7, padding: '0.5rem', fontSize: '0.78rem', fontFamily: 'inherit', fontWeight: 700,
                        cursor: checkoutLoading ? 'not-allowed' : 'pointer', color: 'white',
                        opacity: checkoutLoading ? 0.7 : 1,
                      }}>
                      {checkoutLoading === 'plus_yearly' ? 'Opening…' : '£39/year — save 35%'}
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ── DELETE ACCOUNT ── */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
              {!showDeleteConfirm ? (
                <button onClick={() => setShowDeleteConfirm(true)} style={{
                  background: 'none', border: 'none', color: '#999', fontSize: '0.75rem',
                  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, padding: 0,
                  textDecoration: 'underline',
                }}>
                  Delete Account
                </button>
              ) : (
                <div style={{
                  background: '#FFF5F5', border: '1.5px solid #fca5a5',
                  borderRadius: 8, padding: '1rem', maxWidth: 480,
                }}>
                  <p style={{ fontSize: '0.82rem', color: '#b91c1c', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.5 }}>
                    ⚠ This will permanently delete your account and all saved flashcard decks. This cannot be undone.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading}
                      style={{
                        background: '#b91c1c', color: 'white', border: 'none', borderRadius: 6,
                        padding: '0.45rem 1rem', fontSize: '0.78rem', fontFamily: 'inherit',
                        fontWeight: 700, cursor: deleteLoading ? 'not-allowed' : 'pointer',
                        opacity: deleteLoading ? 0.7 : 1,
                      }}>
                      {deleteLoading ? 'Deleting…' : 'Yes, delete my account'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      style={{
                        background: 'none', border: '1.5px solid #ccc', borderRadius: 6,
                        padding: '0.45rem 1rem', fontSize: '0.78rem', fontFamily: 'inherit',
                        fontWeight: 700, cursor: 'pointer', color: '#555',
                      }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── FREE FLASHCARD LIBRARY ── */}
        <div style={{ marginTop: '3rem', ...mono }}>
          <SectionDivider label="Free Flashcard Library" />
          <p style={{ fontSize: '0.8rem', opacity: 0.55, marginBottom: '1.5rem' }}>
            Browse pre-made sets — click any deck to study it, or save it to your Flashboard.
          </p>
          <div className="dashboard-library-grid">
            {Object.entries(getDecksBySubject()).map(([subject, decks]) => (
              <div key={subject} className="library-subject-group">
                <div className="library-subject-heading">{subject}</div>
                {decks.map(deck => (
                  <Link key={deck.slug} href={`/library/${deck.slug}`} className="library-directory-row">
                    <span className="library-row-title">{deck.title}</span>
                    <span className="library-row-count">{deck.cards.length} cards</span>
                    <span className="library-row-arrow">→</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
