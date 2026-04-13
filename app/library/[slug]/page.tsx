import { Suspense } from 'react';
import { LIBRARY_DECKS } from '@/lib/library';
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
  return {
    title: `Free flashcards for ${deck.title} | Flashcard Maker`,
    description: `Study ${deck.title} flashcards for free with Flashcard Maker`,
    alternates: {
      canonical: `https://flashcardmaker.co.uk/library/${deck.slug}`,
    },
    openGraph: {
      title: `Free flashcards for ${deck.title} | Flashcard Maker`,
      description: `Study ${deck.title} flashcards for free with Flashcard Maker`,
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
