import type { MetadataRoute } from 'next';
import { SUBJECTS, CURRICULA } from '@/lib/subjects';
import { LIBRARY_DECKS } from '@/lib/library';

const BASE = 'https://flashcardmaker.co.uk';
const LAST_MODIFIED = new Date('2026-04-09');

export default function sitemap(): MetadataRoute.Sitemap {
  const subjectEntries = SUBJECTS.map((s) => ({
    url: `${BASE}${s.href}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const curriculumEntries = CURRICULA.map((c) => ({
    url: `${BASE}${c.href}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const libraryEntries = LIBRARY_DECKS.map((d) => ({
    url: `${BASE}/library/${d.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: BASE,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...subjectEntries,
    ...curriculumEntries,
    ...libraryEntries,
  ];
}
