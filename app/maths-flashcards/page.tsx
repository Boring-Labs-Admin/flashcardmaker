import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';

export const metadata: Metadata = {
  title: 'Maths Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create maths flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for maths revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/maths-flashcards' },
  openGraph: {
    title: 'Maths Flashcards - Create Study Cards Instantly',
    description: 'Create maths flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/maths-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maths Flashcards',
    description: 'Create maths flashcards from your notes instantly.',
  },
};

export default function MathsFlashcards() {
  return (
    <main className="min-h-screen bg-white">
      <NavBar />
      <Header
        title="Maths Flashcards"
        subtitle="Turn your maths notes into study cards instantly"
      />
      <FlashcardGenerator topic="maths" />
    </main>
  );
}
