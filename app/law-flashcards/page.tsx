import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';

export const metadata: Metadata = {
  title: 'Law Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create law flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for law and legal revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/law-flashcards' },
  openGraph: {
    title: 'Law Flashcards - Create Study Cards Instantly',
    description: 'Create law flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/law-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Law Flashcards',
    description: 'Create law flashcards from your notes instantly.',
  },
};

export default function LawFlashcards() {
  return (
    <main className="min-h-screen bg-white">
      <NavBar />
      <Header
        title="Law Flashcards"
        subtitle="Turn your law notes into study cards instantly"
      />
      <FlashcardGenerator topic="law" />
    </main>
  );
}
