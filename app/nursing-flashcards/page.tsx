import type { Metadata } from 'next';
import SubjectContent from '@/components/SubjectContent';

export const metadata: Metadata = {
  title: 'Nursing Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create nursing flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for nursing revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/nursing-flashcards' },
  openGraph: {
    title: 'Nursing Flashcards - Create Study Cards Instantly',
    description: 'Create nursing flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/nursing-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nursing Flashcards',
    description: 'Create nursing flashcards from your notes instantly.',
  },
};

export default function NursingFlashcards() {
  return (
    <SubjectContent
      title="Flashcard Maker - Nursing Flashcards"
      subtitle="Turn your nursing notes into study cards instantly"
      topic="nursing"
    />
  );
}
