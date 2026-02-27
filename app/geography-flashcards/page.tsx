import type { Metadata } from 'next';
import SubjectContent from '@/components/SubjectContent';

export const metadata: Metadata = {
  title: 'Geography Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create geography flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for geography revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/geography-flashcards' },
  openGraph: {
    title: 'Geography Flashcards - Create Study Cards Instantly',
    description: 'Create geography flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/geography-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Geography Flashcards',
    description: 'Create geography flashcards from your notes instantly.',
  },
};

export default function GeographyFlashcards() {
  return (
    <SubjectContent
      title="Geography Flashcards"
      subtitle="Turn your geography notes into study cards instantly"
      topic="geography"
    />
  );
}
