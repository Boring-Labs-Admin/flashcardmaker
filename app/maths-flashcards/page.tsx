import type { Metadata } from 'next';
import SubjectContent from '@/components/SubjectContent';

export const metadata: Metadata = {
  title: 'Maths Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create maths flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for maths revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/maths-flashcards' },
  openGraph: {
    title: 'Maths Flashcards - Create Study Cards Instantly',
    description: 'Create maths flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/maths-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maths Flashcards',
    description: 'Create maths flashcards from your notes instantly.',
  },
};

export default function MathsFlashcards() {
  return (
    <SubjectContent
      title="Flashcard Maker - Maths Flashcards"
      subtitle="Turn your maths notes into study cards instantly"
      topic="maths"
    />
  );
}
