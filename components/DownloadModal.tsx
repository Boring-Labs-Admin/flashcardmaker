'use client';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadPDF: () => void;
  onDownloadCSV: () => void;
  isLoggedIn: boolean;
  onSignIn: () => void;
}

const OVERLAY: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.55)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem',
};

const PANEL: React.CSSProperties = {
  background: 'white',
  borderRadius: 14,
  padding: '2rem',
  maxWidth: 420,
  width: '100%',
  fontFamily: '"IBM Plex Mono", monospace',
  boxShadow: '0 20px 60px rgba(0,74,173,0.18)',
};

export default function DownloadModal({
  isOpen, onClose, onDownloadPDF, onDownloadCSV, isLoggedIn, onSignIn,
}: DownloadModalProps) {
  if (!isOpen) return null;

  const handlePDF = () => { onDownloadPDF(); onClose(); };
  const handleCSV = () => { onDownloadCSV(); onClose(); };
  const handleSignIn = () => { onSignIn(); onClose(); };

  return (
    <div style={OVERLAY} onClick={onClose}>
      <div style={PANEL} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', lineHeight: 1 }}>⬇️</div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#004AAD', marginBottom: '0.4rem', lineHeight: 1.3 }}>
          Download your deck
        </h2>
        <p style={{ fontSize: '0.82rem', opacity: 0.6, marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Choose a format. PDF is always free — other formats require a free account.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* PDF — always free */}
          <div style={{
            border: '1.5px solid #004AAD',
            borderRadius: 10,
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#004AAD' }}>PDF</div>
              <div style={{ fontSize: '0.78rem', opacity: 0.6, marginTop: '0.15rem' }}>
                Side-by-side question &amp; answer layout
              </div>
            </div>
            <button
              onClick={handlePDF}
              style={{
                background: '#004AAD',
                color: 'white',
                border: 'none',
                borderRadius: 7,
                padding: '0.5rem 1rem',
                fontSize: '0.82rem',
                fontFamily: 'inherit',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Download free
            </button>
          </div>

          {/* CSV — requires account */}
          <div style={{
            border: '1.5px solid #E0E8F5',
            borderRadius: 10,
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            opacity: isLoggedIn ? 1 : 0.85,
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#004AAD' }}>
                CSV {!isLoggedIn && <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>🔒</span>}
              </div>
              <div style={{ fontSize: '0.78rem', opacity: 0.6, marginTop: '0.15rem' }}>
                Import into Anki, Quizlet, or spreadsheets
              </div>
            </div>
            {isLoggedIn ? (
              <button
                onClick={handleCSV}
                style={{
                  background: 'transparent',
                  color: '#004AAD',
                  border: '1.5px solid #004AAD',
                  borderRadius: 7,
                  padding: '0.5rem 1rem',
                  fontSize: '0.82rem',
                  fontFamily: 'inherit',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Download
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                style={{
                  background: 'transparent',
                  color: '#004AAD',
                  border: '1.5px solid #C7D9F5',
                  borderRadius: 7,
                  padding: '0.5rem 1rem',
                  fontSize: '0.82rem',
                  fontFamily: 'inherit',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Sign up free
              </button>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: '1rem',
            background: 'transparent',
            border: 'none',
            padding: '0.5rem 0',
            fontSize: '0.82rem',
            fontFamily: 'inherit',
            fontWeight: 600,
            cursor: 'pointer',
            color: '#004AAD',
            opacity: 0.45,
            width: '100%',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
