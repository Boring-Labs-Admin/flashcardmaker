import type { Metadata } from 'next';
import SubjectContent from '@/components/SubjectContent';
import { SUBJECT_SEO } from '@/lib/subject-seo';

const seo = SUBJECT_SEO['a-level'];

export const metadata: Metadata = {
  title: seo.metaTitle,
  description: seo.metaDescription,
  alternates: { canonical: 'https://flashcardmaker.co.uk/a-level-flashcards' },
  openGraph: { title: seo.metaTitle, description: seo.metaDescription, url: 'https://flashcardmaker.co.uk/a-level-flashcards', type: 'website' },
};

export default function ALevelFlashcards() {
  return <SubjectContent topic="a-level" />;
}
