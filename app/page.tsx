import type { Metadata } from 'next';
import HomeContent from '@/components/HomeContent';

export const metadata: Metadata = {
  title: 'Free Flashcard Maker — Turn Notes & Documents Into Study Cards',
  description: 'Upload your notes, textbooks, or photos and create study flashcards instantly with AI. Free to use — no account needed for your first deck.',
  alternates: {
    canonical: 'https://flashcardmaker.co.uk',
  },
  openGraph: {
    title: 'Free Flashcard Maker — Turn Notes & Documents Into Study Cards',
    description: 'Upload your notes, textbooks, or photos and create study flashcards instantly with AI.',
    url: 'https://flashcardmaker.co.uk',
    type: 'website',
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
