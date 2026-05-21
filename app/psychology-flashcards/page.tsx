import type { Metadata } from 'next';
import SubjectContent from '@/components/SubjectContent';
import { SUBJECT_SEO } from '@/lib/subject-seo';

const seo = SUBJECT_SEO.psychology;

export const metadata: Metadata = {
  title: seo.metaTitle,
  description: seo.metaDescription,
  alternates: { canonical: 'https://flashcardmaker.co.uk/psychology-flashcards' },
  openGraph: { title: seo.metaTitle, description: seo.metaDescription, url: 'https://flashcardmaker.co.uk/psychology-flashcards', type: 'website' },
};

export default function PsychologyFlashcards() {
  return <SubjectContent topic="psychology" />;
}
