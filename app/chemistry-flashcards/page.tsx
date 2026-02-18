import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';

export const metadata: Metadata = {
  title: 'Chemistry Flashcards - Create Study Cards Instantly',
  description:
    'Create chemistry flashcards from your notes and textbooks. Free flashcard maker for chemistry revision.',
};

export default function ChemistryFlashcards() {
  return (
    <main className="min-h-screen bg-white">
      <NavBar />
      <Header
        title="Chemistry Flashcards"
        subtitle="Turn your chemistry notes into study cards instantly"
      />
      <FlashcardGenerator topic="chemistry" />
    </main>
  );
}
