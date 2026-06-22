import type { Metadata } from 'next';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import NavBar from '@/components/NavBar';
import PricingCards from '@/components/PricingCards';
import ComparisonTable from '@/components/ComparisonTable';
import FaqAccordion from '@/components/FaqAccordion';

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

const FAQS = [
  {
    q: 'Do I need an account to make flashcards?',
    a: 'No — you can generate one free deck per day with no sign-up at all. Create a free account if you want to save your decks, test yourself, and bank up to 5 unused generations.',
  },
  {
    q: "What's the difference between credit packs and Plus?",
    a: 'Credit packs are a one-off top-up — pay once, use those generations whenever, they never expire. Plus is a subscription for unlimited generations, bigger decks, topic-only generation and priority speed. If you generate decks regularly, Plus works out cheaper; if you just need a few extra now and then, a credit pack is simpler.',
  },
  {
    q: 'Can I cancel Plus any time?',
    a: 'Yes. Manage or cancel your subscription anytime from your Flashboard — no minimum term, no cancellation fee.',
  },
  {
    q: 'Is the yearly plan really cheaper?',
    a: '£39/year works out to about £3.25/month — roughly 35% less than paying monthly at £4.99.',
  },
];

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <NavBar />

        <section className="header" style={{ textAlign: 'center' }}>
          <div className="header-content">
            <div className="pill" style={{ margin: '0 auto 1.25rem' }}><Zap size={13} /> Free to start · no card needed</div>
            <h1 className="header-title">Simple pricing, no surprises</h1>
            <p className="header-description" style={{ margin: '0 auto' }}>Make your first deck free today. Pay only when you want unlimited generations and bigger decks.</p>
          </div>
        </section>

        <div className="container">
          <div id="plans">
            <PricingCards />
          </div>

          <div className="subject-section" style={{ textAlign: 'center' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>At a glance</div>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>What you get on each plan</h2>
            <ComparisonTable />
          </div>

          <div className="subject-section" style={{ textAlign: 'center' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Questions</div>
            <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Good to know before you upgrade</h2>
            <FaqAccordion items={FAQS} />
            <p style={{ marginTop: '2rem', opacity: 0.6, fontSize: '0.85rem', fontFamily: 'var(--sans)' }}>
              Still have a question?{' '}
              <a href="mailto:support@flashcardmaker.co.uk" style={{ color: 'var(--cobalt-blue)', fontWeight: 700 }}>support@flashcardmaker.co.uk</a>
            </p>
          </div>

          <div className="subject-section">
            <div className="final-cta">
              <h2>Try it before you spend a penny.</h2>
              <p>Make your first deck free, then decide. No card needed to start.</p>
              <div className="final-cta-actions">
                <Link href="/#generator" className="btn-cta-light"><Zap size={16} /> Make my flashcards</Link>
                <a href="#plans" className="btn-cta-ghost">Get Plus</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
