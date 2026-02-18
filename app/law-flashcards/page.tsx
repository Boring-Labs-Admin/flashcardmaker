import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';

export const metadata: Metadata = {
  title: 'Law Flashcards - Create Study Cards Instantly',
  description:
    'Create law flashcards from your notes and textbooks. Free flashcard maker for law revision.',
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
