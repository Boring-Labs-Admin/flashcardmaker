import type { Metadata } from 'next';
import SubjectContent from '@/components/SubjectContent';

export const metadata: Metadata = {
  title: 'Business Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create business flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for business revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/business-flashcards' },
  openGraph: {
    title: 'Business Flashcards - Create Study Cards Instantly',
    description: 'Create business flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/business-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Flashcards',
    description: 'Create business flashcards from your notes instantly.',
  },
};

export default function BusinessFlashcards() {
  return (
    <SubjectContent
      title="Business Flashcards"
      subtitle="Turn your business notes into study cards instantly"
      topic="business"
    />
  );
}
