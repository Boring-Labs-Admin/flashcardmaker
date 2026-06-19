'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useDashboard, SettingsTab } from '@/lib/dashboard-context';

const mono: React.CSSProperties = { fontFamily: '"IBM Plex Mono", monospace' };

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'account', label: 'Account' },
  { id: 'billing', label: 'Billing' },
  { id: 'support', label: 'Support' },
];

export default function SettingsModal() {
  const { user } = useAuth();
  const {
    isSettingsOpen, setSettingsOpen, settingsTab, setSettingsTab,
    planData, isAdmin, checkoutLoading, handlePortal,
    deleteError, deleteLoading, handleDeleteAccount,
    setHelpOpen,
  } = useDashboard();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isSettingsOpen) return null;

  const isPlus = planData?.plan === 'plus';

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

              {(isPlus || isAdmin) ? (
                <div style={{
                  border: '2px solid #004AAD', borderRadius: 12, padding: '1.5rem',
                  background: '#004AAD', color: 'white', maxWidth: 480,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>⚡ Flashcard Maker Plus</span>
                    <span style={{
                      background: '#F5C518', color: '#004AAD', borderRadius: 20, padding: '0.15rem 0.65rem',
                      fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}>Active</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', opacity: 0.85, marginBottom: '1.5rem' }}>
                    Manage your payment details or cancel your subscription anytime.
                  </p>
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
                <div style={{
                  border: '1.5px dashed #C7D9F5', borderRadius: 12, padding: '2rem',
                  background: '#F7FAFF', maxWidth: 480, textAlign: 'center',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🚧</div>
                  <p style={{ fontSize: '0.88rem', opacity: 0.65, lineHeight: 1.6 }}>
                    Billing management is coming soon. To upgrade your plan in the meantime, use{' '}
                    <strong>Upgrade Plan</strong> from the menu.
                  </p>
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
