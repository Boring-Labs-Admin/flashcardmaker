import type { MetadataRoute } from 'next';
import { SUBJECTS, CURRICULA } from '@/lib/subjects';
import { LIBRARY_DECKS } from '@/lib/library';

const BASE = 'https://flashcardmaker.co.uk';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const subjectEntries = SUBJECTS.map((s) => ({
    url: `${BASE}${s.href}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const curriculumEntries = CURRICULA.map((c) => ({
    url: `${BASE}${c.href}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const libraryEntries = LIBRARY_DECKS.map((d) => ({
    url: `${BASE}/library/${d.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE}/terms`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    ...libraryEntries,
    ...subjectEntries,
    ...curriculumEntries,
  ];
}
