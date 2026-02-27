import type { Metadata } from 'next';
import SubjectContent from '@/components/SubjectContent';

export const metadata: Metadata = {
  title: 'Law Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create law flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for law and legal revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/law-flashcards' },
  openGraph: {
    title: 'Law Flashcards - Create Study Cards Instantly',
    description: 'Create law flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/law-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Law Flashcards',
    description: 'Create law flashcards from your notes instantly.',
  },
};

export default function LawFlashcards() {
  return (
    <SubjectContent
      title="Law Flashcards"
      subtitle="Turn your law notes into study cards instantly"
      topic="law"
    />
  );
}
