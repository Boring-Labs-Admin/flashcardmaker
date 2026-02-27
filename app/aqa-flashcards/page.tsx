import type { Metadata } from 'next';
import SubjectContent from '@/components/SubjectContent';

export const metadata: Metadata = {
  title: 'AQA Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create AQA flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for AQA exam revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/aqa-flashcards' },
  openGraph: {
    title: 'AQA Flashcards - Create Study Cards Instantly',
    description: 'Create AQA flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/aqa-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AQA Flashcards',
    description: 'Create AQA flashcards from your notes instantly.',
  },
};

export default function AqaFlashcards() {
  return (
    <SubjectContent
      title="Flashcard Maker - AQA Flashcards"
      subtitle="Turn your AQA notes into study cards instantly"
      topic="aqa"
    />
  );
}
