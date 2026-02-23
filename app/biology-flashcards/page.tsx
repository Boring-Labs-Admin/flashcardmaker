import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';

export const metadata: Metadata = {
  title: 'Biology Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create biology flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for biology revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/biology-flashcards' },
  openGraph: {
    title: 'Biology Flashcards - Create Study Cards Instantly',
    description: 'Create biology flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/biology-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Biology Flashcards',
    description: 'Create biology flashcards from your notes instantly.',
  },
};

export default function BiologyFlashcards() {
  return (
    <main className="min-h-screen bg-white">
      <NavBar />
      <Header
        title="Biology Flashcards"
        subtitle="Turn your biology notes into study cards instantly"
      />
      <FlashcardGenerator topic="biology" />
    </main>
  );
}
