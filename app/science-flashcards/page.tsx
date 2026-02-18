import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';

export const metadata: Metadata = {
  title: 'Science Flashcards - Create Study Cards Instantly',
  description:
    'Create science flashcards from your notes and textbooks. Free flashcard maker for science revision.',
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
