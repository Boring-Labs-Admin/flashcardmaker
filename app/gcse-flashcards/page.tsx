import type { Metadata } from 'next';
import SubjectContent from '@/components/SubjectContent';

export const metadata: Metadata = {
  title: 'GCSE Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create GCSE flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for GCSE revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/gcse-flashcards' },
  openGraph: {
    title: 'GCSE Flashcards - Create Study Cards Instantly',
    description: 'Create GCSE flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/gcse-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GCSE Flashcards',
    description: 'Create GCSE flashcards from your notes instantly.',
  },
};

export default function GcseFlashcards() {
  return (
    <SubjectContent
      title="Flashcard Maker - GCSE Flashcards"
      subtitle="Turn your GCSE notes into study cards instantly"
      topic="gcse"
    />
  );
}
