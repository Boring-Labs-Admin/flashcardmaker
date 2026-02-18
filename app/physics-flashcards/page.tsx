import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';

export const metadata: Metadata = {
  title: 'Physics Flashcards - Create Study Cards Instantly',
  description:
    'Create physics flashcards from your notes and textbooks. Free flashcard maker for physics revision.',
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
