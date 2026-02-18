import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';

export const metadata: Metadata = {
  title: 'Maths Flashcards - Create Study Cards Instantly',
  description:
    'Create maths flashcards from your notes and textbooks. Free flashcard maker for maths revision.',
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
