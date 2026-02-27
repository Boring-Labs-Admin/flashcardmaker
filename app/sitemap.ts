import type { MetadataRoute } from 'next';
import { SUBJECTS, CURRICULA } from '@/lib/subjects';

const BASE = 'https://flashcardmaker.co.uk';

export default function sitemap(): MetadataRoute.Sitemap {
  const subjectEntries = SUBJECTS.map((s) => ({
    url: `${BASE}${s.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const curriculumEntries = CURRICULA.map((c) => ({
    url: `${BASE}${c.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
...subjectEntries,
    ...curriculumEntries,
  ];
}
