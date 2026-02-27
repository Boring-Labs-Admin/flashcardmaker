import type { Metadata } from 'next';
import SubjectContent from '@/components/SubjectContent';

export const metadata: Metadata = {
  title: 'A-Level Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create A-Level flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for A-Level revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/a-level-flashcards' },
  openGraph: {
    title: 'A-Level Flashcards - Create Study Cards Instantly',
    description: 'Create A-Level flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/a-level-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A-Level Flashcards',
    description: 'Create A-Level flashcards from your notes instantly.',
  },
};

export default function ALevelFlashcards() {
  return (
    <SubjectContent
      title="Flashcard Maker - A-Level Flashcards"
      subtitle="Turn your A-Level notes into study cards instantly"
      topic="a-level"
    />
  );
}
