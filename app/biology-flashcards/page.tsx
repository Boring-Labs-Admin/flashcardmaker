import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';

export const metadata: Metadata = {
  title: 'Biology Flashcards - Create Study Cards Instantly',
  description:
    'Create biology flashcards from your notes and textbooks. Free flashcard maker for biology revision.',
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
