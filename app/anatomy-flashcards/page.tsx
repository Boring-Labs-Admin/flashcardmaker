import type { Metadata } from 'next';
import SubjectContent from '@/components/SubjectContent';

export const metadata: Metadata = {
  title: 'Anatomy Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create anatomy flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for anatomy revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/anatomy-flashcards' },
  openGraph: {
    title: 'Anatomy Flashcards - Create Study Cards Instantly',
    description: 'Create anatomy flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/anatomy-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anatomy Flashcards',
    description: 'Create anatomy flashcards from your notes instantly.',
  },
};

export default function AnatomyFlashcards() {
  return (
    <SubjectContent
      title="Flashcard Maker - Anatomy Flashcards"
      subtitle="Turn your anatomy notes into study cards instantly"
      topic="anatomy"
    />
  );
}
