import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coming Soon — Flashcard Maker',
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'white',
      fontFamily: '"IBM Plex Mono", monospace',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{
        border: '3px solid #004AAD',
        borderRadius: '16px',
        padding: '3rem 4rem',
        maxWidth: '480px',
        width: '100%',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#004AAD', marginBottom: '1rem' }}>
          Coming Soon
        </h1>
        <p style={{ fontSize: '1rem', lineHeight: 1.6, opacity: 0.7 }}>
          We&apos;re putting the finishing touches on things. Check back soon.
        </p>
      </div>
    </div>
  );
}
