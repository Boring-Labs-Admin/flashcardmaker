import { Suspense } from 'react';
import { LIBRARY_DECKS } from '@/lib/library';
import { DECK_SEO } from '@/lib/library-seo';
import LibraryDeckView from '@/components/LibraryDeckView';
import NavBar from '@/components/NavBar';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return LIBRARY_DECKS.map(d => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const deck = LIBRARY_DECKS.find(d => d.slug === params.slug);
  if (!deck) return {};
  const seo = DECK_SEO[deck.slug];
  const title = seo?.metaTitle ?? `${deck.topic} Flashcards | Free ${deck.subject} Cards | Flashcard Maker`;
  const description = seo?.metaDescription ?? `Study free ${deck.topic} flashcards for ${deck.subject}. Covers key concepts and exam topics. Flip through questions and answers instantly, no signup needed.`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://flashcardmaker.co.uk/library/${deck.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://flashcardmaker.co.uk/library/${deck.slug}`,
    },
  };
}

export default function LibraryDeckPage({ params }: { params: { slug: string } }) {
  const deck = LIBRARY_DECKS.find(d => d.slug === params.slug);
  if (!deck) notFound();

  return (
    <main>
      <NavBar />
      <Suspense>
        <LibraryDeckView deck={deck} />
      </Suspense>
    </main>
  );
}
