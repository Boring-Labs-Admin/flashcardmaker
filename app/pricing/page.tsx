import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import PricingCards from '@/components/PricingCards';

export const metadata: Metadata = {
  title: 'Pricing | Free and Plus Plans | Flashcard Maker',
  description:
    'Start free with 1 generation per day. Upgrade to Flashcard Maker Plus for unlimited generations, AI topic generation, 60-card decks and priority processing. From £4.99/month or £39/year.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/pricing' },
  openGraph: {
    title: 'Pricing | Free and Plus Plans | Flashcard Maker',
    description:
      'Start free with 1 generation per day. Upgrade to Plus for unlimited flashcard generations. From £4.99/month.',
    url: 'https://flashcardmaker.co.uk/pricing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flashcard Maker Pricing',
    description: 'Free plan plus Plus subscription from £4.99/month or £39/year.',
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
      description: 'Unlimited generations, AI topic generation, 60 cards per deck, priority processing',
    },
    {
      '@type': 'Offer',
      name: 'Plus Annual',
      price: '39',
      priceCurrency: 'GBP',
      description: 'Unlimited generations, AI topic generation, 60 cards per deck, priority processing — best value',
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
        <NavBar />

        <div style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1.5rem 4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#004AAD', marginBottom: '0.5rem' }}>Simple Pricing</h1>
            <p style={{ opacity: 0.65, fontSize: '1rem' }}>Start free. Upgrade when you need more.</p>
          </div>

          <PricingCards />

          <div style={{ textAlign: 'center', marginTop: '2.5rem', opacity: 0.5, fontSize: '0.82rem' }}>
            Questions?{' '}
            <a href="mailto:admin@boringlabs.co.uk" style={{ color: 'inherit' }}>admin@boringlabs.co.uk</a>
          </div>
        </div>
      </main>
    </>
  );
}
