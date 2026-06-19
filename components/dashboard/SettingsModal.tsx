'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PLANS } from '@/lib/plans';
import { useDashboard, SettingsTab } from '@/lib/dashboard-context';

const mono: React.CSSProperties = { fontFamily: '"IBM Plex Mono", monospace' };

const CREDIT_PACKS = [
  { label: '1 generation',   price: '£0.99', perUnit: '£0.99 each',  saving: null,         best: false, productKey: 'credits_1'  },
  { label: '5 generations',  price: '£3.49', perUnit: '£0.70 each',  saving: 'Save 29%',   best: false, productKey: 'credits_5'  },
  { label: '10 generations', price: '£5.99', perUnit: '£0.60 each',  saving: 'Best value', best: true,  productKey: 'credits_10' },
];

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'account', label: 'Account' },
  { id: 'billing', label: 'Billing' },
  { id: 'support', label: 'Support' },
];

export default function SettingsModal() {
  const { user } = useAuth();
  const {
    isSettingsOpen, setSettingsOpen, settingsTab, setSettingsTab,
    planData, isAdmin, checkoutLoading, handleCheckout, handlePortal,
    deleteError, deleteLoading, handleDeleteAccount,
    paymentSuccess, dismissPaymentSuccess, setHelpOpen,
  } = useDashboard();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isSettingsOpen) return null;

  const isPlus = planData?.plan === 'plus';
  const freeBanked = planData?.free_banked ?? 0;
  const paidCredits = planData?.paid_credits ?? 0;
  const totalRemaining = freeBanked + paidCredits;
  const maxGenerations = PLANS.free.maxBanked as number;

  return (
    <div className="modal-overlay active" onClick={() => setSettingsOpen(false)}>
      <div className="modal modal-settings" onClick={(e) => e.stopPropagation()}>
        <div className="modal-settings-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`modal-settings-tab${settingsTab === tab.id ? ' active' : ''}`}
              onClick={() => setSettingsTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button className="modal-close" style={{ margin: 0, textAlign: 'left' }} onClick={() => setSettingsOpen(false)}>✕ Close</button>
        </div>

        <div className="modal-settings-content">
          {/* ── ACCOUNT ── */}
          {settingsTab === 'account' && (
            <div style={{ ...mono, textAlign: 'left' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Account</h3>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.09em', opacity: 0.45, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Name</div>
                <div style={{ fontSize: '0.95rem' }}>{user?.user_metadata?.full_name || '—'}</div>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.09em', opacity: 0.45, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Email</div>
                <div style={{ fontSize: '0.95rem' }}>{user?.email}</div>
              </div>

              {deleteError && <div className="error-message">{deleteError}</div>}

              <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
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

          {/* ── BILLING ── */}
          {settingsTab === 'billing' && (
            <div style={{ ...mono, textAlign: 'left' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Billing</h3>

              {paymentSuccess && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
                  background: '#E6F4EC', border: '1.5px solid #6FCF97', borderRadius: 10,
                  padding: '0.75rem 1.1rem', marginBottom: '1.5rem', gap: '1rem',
                }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#007a3d' }}>
                    ✓ Payment successful — your plan has been updated.
                  </span>
                  <button onClick={dismissPaymentSuccess} style={{
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem',
                    color: '#007a3d', lineHeight: 1, padding: 0,
                  }}>×</button>
                </div>
              )}

              {(isPlus || isAdmin) ? (
                <div style={{
                  border: '2px solid #004AAD', borderRadius: 12, padding: '1.5rem',
                  background: '#004AAD', color: 'white', maxWidth: 560,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>⚡ Flashcard Maker Plus</span>
                    <span style={{
                      background: '#F5C518', color: '#004AAD', borderRadius: 20, padding: '0.15rem 0.65rem',
                      fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}>Active</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
                    {[
                      'Generate decks from any topic with AI',
                      'Unlimited generations',
                      '60 cards per deck',
                      '100,000 character input',
                      'Up to 20 files per generation',
                      'Priority processing enabled',
                    ].map(line => (
                      <div key={line} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.82rem', opacity: 0.9 }}>
                        <span style={{ color: '#F5C518', flexShrink: 0 }}>✓</span>{line}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handlePortal}
                    disabled={checkoutLoading === 'portal'}
                    style={{
                      background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: 7, padding: '0.5rem 1rem', fontSize: '0.78rem', fontFamily: 'inherit',
                      fontWeight: 700, cursor: checkoutLoading === 'portal' ? 'not-allowed' : 'pointer',
                      color: 'white', opacity: checkoutLoading === 'portal' ? 0.65 : 1,
                    }}>
                    {checkoutLoading === 'portal' ? 'Opening…' : 'Manage Subscription'}
                  </button>
                </div>
              ) : (
                <div className="plan-grid">
                  {/* COL 1: Current Plan */}
                  <div style={{ border: '1.5px solid #C7D9F5', borderRadius: 12, padding: '1.25rem', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.09em', opacity: 0.45, textTransform: 'uppercase' }}>Current Plan</span>
                      <span style={{
                        background: '#EEF4FF', color: '#004AAD', borderRadius: 20, padding: '0.15rem 0.65rem',
                        fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase',
                        border: '1px solid #C7D9F5',
                      }}>Free</span>
                    </div>
                    <div style={{
                      marginBottom: '1rem', padding: '0.6rem 0.75rem',
                      background: totalRemaining === 0 ? '#FFF5F5' : '#EEF4FF', borderRadius: 7,
                      fontSize: '0.8rem', color: totalRemaining === 0 ? '#c00' : '#004AAD', fontWeight: 600,
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {CREDIT_PACKS.map(pack => (
                        <button
                          key={pack.label}
                          onClick={() => handleCheckout(pack.productKey)}
                          disabled={checkoutLoading === pack.productKey}
                          style={{
                            border: pack.best ? '2px solid #004AAD' : '1.5px solid #E0E8F5',
                            borderRadius: 8, padding: '0.55rem 0.75rem',
                            background: pack.best ? '#EEF4FF' : 'white',
                            cursor: checkoutLoading === pack.productKey ? 'not-allowed' : 'pointer',
                            textAlign: 'left', width: '100%',
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
                        'Generate decks from any topic with AI',
                        'Unlimited deck generation',
                        'Create larger decks (up to 60 cards)',
                        'Paste entire chapters (up to 100,000 chars)',
                        'Upload up to 20 files at once',
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
            </div>
          )}

          {/* ── SUPPORT ── */}
          {settingsTab === 'support' && (
            <div style={{ ...mono, textAlign: 'left' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Support</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, opacity: 0.8 }}>
                If you are having any problems please see our{' '}
                <button
                  onClick={() => { setSettingsOpen(false); setHelpOpen(true); }}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#004AAD', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}
                >
                  Help
                </button>{' '}
                page or email us at{' '}
                <a href="mailto:support@flashcardmaker.co.uk" style={{ color: '#004AAD', fontWeight: 700 }}>
                  support@flashcardmaker.co.uk
                </a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
