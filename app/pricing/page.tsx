import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing — Free & Plus Plans | Flashcard Maker',
  description:
    'Start free with 1 generation per day. Upgrade to Plus for unlimited generations, 60-card decks, and priority processing. From £4.99/month or £39/year.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/pricing' },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Pricing — Free & Plus Plans | Flashcard Maker',
    description:
      'Start free with 1 generation per day. Upgrade to Plus for unlimited flashcard generations. From £4.99/month.',
    url: 'https://flashcardmaker.co.uk/pricing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flashcard Maker Pricing',
    description: 'Free plan + Plus subscription from £4.99/month or £39/year.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Flashcard Maker',
  url: 'https://flashcardmaker.co.uk',
  applicationCategory: 'EducationApplication',
  offers: [
    {
      '@type': 'Offer',
      name: 'Free',
      price: '0',
      priceCurrency: 'GBP',
      description: '1 generation per day, banks up to 5, 30 cards per deck',
    },
    {
      '@type': 'Offer',
      name: 'Plus Monthly',
      price: '4.99',
      priceCurrency: 'GBP',
      description: 'Unlimited generations, 60 cards per deck, priority processing',
    },
    {
      '@type': 'Offer',
      name: 'Plus Annual',
      price: '39',
      priceCurrency: 'GBP',
      description: 'Unlimited generations, 60 cards per deck, priority processing — best value',
    },
  ],
};

const FREE_FEATURES = [
  '1 free generation/day',
  'Banks up to 5 unused generations',
  '30 cards per deck',
  'Save decks to Flashboard',
  'All 3 view modes',
  'Download decks as PDF',
];

const CREDIT_FEATURES = [
  'One-time purchase · no expiry',
  'Credits stack with free generations',
  '30 cards per deck',
];

const PLUS_FEATURES = [
  'Generate decks from any topic with AI',
  'Unlimited generations',
  '60 cards per deck',
  '100,000 character input',
  'Up to 20 files per generation',
  'Priority generation speed',
  'Everything in Free',
];

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
                <span style={{ color: '#004AAD', flexShrink: 0 }}>✓</span>{f}
              </li>
            ))}
          </ul>
        </div>

        {/* Credit Packs */}
        <div style={{ border: '2px solid #004AAD', borderRadius: 14, padding: '1.75rem', background: 'white' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Credit Packs</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#004AAD', marginBottom: '0.25rem' }}>From £0.99</div>
          <div style={{ fontSize: '0.82rem', opacity: 0.6, marginBottom: '1.5rem' }}>Available in your Flashboard</div>
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
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {CREDIT_FEATURES.map((f) => (
              <li key={f} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#004AAD', flexShrink: 0 }}>✓</span>{f}
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
          <div style={{ fontSize: '0.82rem', opacity: 0.65, marginBottom: '1.5rem' }}>or £50/year · available in your Flashboard</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {PLUS_FEATURES.map((f) => (
              <li key={f} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#F5C518', flexShrink: 0 }}>✓</span>{f}
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '2.5rem', opacity: 0.5, fontSize: '0.82rem' }}>
        Sign up to manage your plan · Questions?{' '}
        <a href="mailto:admin@boringlabs.co.uk" style={{ color: 'inherit' }}>admin@boringlabs.co.uk</a>
      </div>
    </main>
    </>
  );
}
