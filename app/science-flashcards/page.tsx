import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';

export const metadata: Metadata = {
  title: 'Science Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create science flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for science revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/science-flashcards' },
  openGraph: {
    title: 'Science Flashcards - Create Study Cards Instantly',
    description: 'Create science flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/science-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Science Flashcards',
    description: 'Create science flashcards from your notes instantly.',
  },
};

export default function ScienceFlashcards() {
  return (
    <main className="min-h-screen bg-white">
      <NavBar />
      <Header
        title="Science Flashcards"
        subtitle="Turn your science notes into study cards instantly"
      />
      <FlashcardGenerator topic="science" />
    </main>
  );
}
