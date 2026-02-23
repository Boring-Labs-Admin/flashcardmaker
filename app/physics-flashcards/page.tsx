import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';

export const metadata: Metadata = {
  title: 'Physics Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create physics flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for physics revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/physics-flashcards' },
  openGraph: {
    title: 'Physics Flashcards - Create Study Cards Instantly',
    description: 'Create physics flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/physics-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Physics Flashcards',
    description: 'Create physics flashcards from your notes instantly.',
  },
};

export default function PhysicsFlashcards() {
  return (
    <main className="min-h-screen bg-white">
      <NavBar />
      <Header
        title="Physics Flashcards"
        subtitle="Turn your physics notes into study cards instantly"
      />
      <FlashcardGenerator topic="physics" />
    </main>
  );
}
