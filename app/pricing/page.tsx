import Link from 'next/link';

const FREE_FEATURES = [
  '1 free generation/day',
  'Banks up to 5 unused generations',
  '30 cards per deck',
  '5,000 character input',
  'Up to 5 files',
  'Save decks to Flashboard',
  'All 3 view modes',
  'Download decks as PDF',
];

const CREDIT_FEATURES = [
  'No account required',
  'Credits stack — never expire',
  '30 cards per deck',
  '5,000 character input',
  'Up to 5 files',
];

const PLUS_FEATURES = [
  'Unlimited generations',
  '60 cards per deck',
  '20,000 character input',
  'Up to 20 files',
  'Priority generation speed',
  'Everything in Free',
];

export default function PricingPage() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1.5rem 4rem', fontFamily: '"IBM Plex Mono", monospace' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#004AAD', marginBottom: '0.5rem' }}>Simple Pricing</h1>
        <p style={{ opacity: 0.65, fontSize: '1rem' }}>Start free. Upgrade when you need more.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>

        {/* Free */}
        <div style={{ border: '2px solid #004AAD', borderRadius: 14, padding: '1.75rem', background: 'white' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Free</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#004AAD', marginBottom: '0.25rem' }}>£0</div>
          <div style={{ fontSize: '0.82rem', opacity: 0.6, marginBottom: '1.5rem' }}>No card required</div>
          <Link href="/" style={{ display: 'block', textAlign: 'center', background: '#EEF4FF', color: '#004AAD', border: '2px solid #004AAD', borderRadius: 8, padding: '0.6rem 1rem', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
            Get started free
          </Link>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {FREE_FEATURES.map((f) => (
              <li key={f} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#004AAD', flexShrink: 0 }}>✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Credit Packs */}
        <div style={{ border: '2px solid #004AAD', borderRadius: 14, padding: '1.75rem', background: 'white' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Credit Packs</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#004AAD', marginBottom: '0.25rem' }}>From £0.99</div>
          <div style={{ fontSize: '0.82rem', opacity: 0.6, marginBottom: '1.5rem' }}>One-time · no expiry</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {[
              { label: '1 generation', price: '£0.99' },
              { label: '5 generations', price: '£3.49' },
              { label: '10 generations', price: '£5.99' },
            ].map((pack) => (
              <div key={pack.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#EEF4FF', borderRadius: 7, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                <span>{pack.label}</span>
                <span style={{ fontWeight: 800, color: '#004AAD' }}>{pack.price}</span>
              </div>
            ))}
          </div>

          <button disabled style={{ display: 'block', width: '100%', textAlign: 'center', background: '#E0E8F5', color: '#004AAD', border: '2px solid #004AAD', borderRadius: 8, padding: '0.6rem 1rem', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'inherit', cursor: 'not-allowed', opacity: 0.65, marginBottom: '1.5rem' }}>
            Coming soon
          </button>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {CREDIT_FEATURES.map((f) => (
              <li key={f} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#004AAD', flexShrink: 0 }}>✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Plus */}
        <div style={{ border: '3px solid #004AAD', borderRadius: 14, padding: '1.75rem', background: '#004AAD', color: 'white', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#F5C518', color: '#004AAD', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', padding: '0.2rem 0.75rem', borderRadius: 20, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Most popular
          </div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.7, textTransform: 'uppercase', marginBottom: '0.5rem' }}>⚡ Flashcard Maker Plus</div>
          <div style={{ marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800 }}>£4.99</span>
            <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>/month</span>
          </div>
          <div style={{ fontSize: '0.82rem', opacity: 0.65, marginBottom: '1.5rem' }}>or £50/year — save 2 months</div>

          <button disabled style={{ display: 'block', width: '100%', textAlign: 'center', background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.5)', borderRadius: 8, padding: '0.6rem 1rem', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'inherit', cursor: 'not-allowed', marginBottom: '1.5rem' }}>
            Coming soon
          </button>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {PLUS_FEATURES.map((f) => (
              <li key={f} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#F5C518', flexShrink: 0 }}>✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem', opacity: 0.5, fontSize: '0.82rem' }}>
        Payments coming soon · Questions? <a href="mailto:admin@boringlabs.co.uk" style={{ color: 'inherit' }}>admin@boringlabs.co.uk</a>
      </div>
    </main>
  );
}
