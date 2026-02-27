import type { Metadata } from 'next';
import HomeContent from '@/components/HomeContent';

export const metadata: Metadata = {
  title: 'Flashcard Maker: Flashcards, flashcards, and more flashcards',
  description: 'Create flashcards in seconds from PDFs, notes or slides. Start free and generate your first revision deck instantly. Sign up to a free account to save them to your Flashboard.',
  alternates: {
    canonical: 'https://flashcardmaker.co.uk',
  },
  openGraph: {
    title: 'Flashcard Maker: Flashcards, flashcards, and more flashcards',
    description: 'Create flashcards in seconds from PDFs, notes or slides. Start free and generate your first revision deck instantly.',
    url: 'https://flashcardmaker.co.uk',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flashcard Maker: Flashcards, flashcards, and more flashcards',
    description: 'Create flashcards in seconds from PDFs, notes or slides. Start free and generate your first revision deck instantly.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Flashcard Maker',
  url: 'https://flashcardmaker.co.uk',
  description: 'Turn documents, notes and photos into flashcards instantly using AI.',
  applicationCategory: 'EducationApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'GBP',
    description: 'Free plan — 1 generation per day, banks up to 5',
  },
  creator: {
    '@type': 'Organization',
    name: 'Boring Labs',
    url: 'https://flashcardmaker.co.uk',
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent />
    </>
  );
}
