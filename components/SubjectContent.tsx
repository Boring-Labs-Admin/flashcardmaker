import Link from 'next/link';
import { Zap } from 'lucide-react';
import SubjectPageClient from '@/components/SubjectPageClient';
import PricingCards from '@/components/PricingCards';
import { SUBJECTS, CURRICULA } from '@/lib/subjects';
import { LIBRARY_DECKS } from '@/lib/library';
import { SUBJECT_SEO } from '@/lib/subject-seo';

const deckCountBySubject: Record<string, number> = {};
for (const deck of LIBRARY_DECKS) {
  deckCountBySubject[deck.subject] = (deckCountBySubject[deck.subject] ?? 0) + 1;
}

const TOPIC_TO_SUBJECTS: Record<string, string[]> = {
  biology:   ['Biology'],
  chemistry: ['Chemistry'],
  physics:   ['Physics'],
  maths:     ['Maths'],
  history:   ['History'],
  geography: ['Geography'],
  psychology:['Psychology'],
  science:   ['Biology', 'Chemistry', 'Physics'],
  business:  ['Economics', 'Business Studies'],
  anatomy:   ['Anatomy'],
  nursing:   ['Nursing'],
  medicine:  ['Medicine'],
  gcse:      ['Biology', 'Chemistry', 'Physics', 'Maths', 'History', 'Geography', 'Psychology', 'Computer Science', 'English Literature', 'Economics', 'Business Studies', 'Sociology'],
  'a-level': ['Biology', 'Chemistry', 'Physics', 'Maths', 'History', 'Psychology', 'Economics', 'English Literature', 'Computer Science', 'Business Studies', 'Law', 'Philosophy', 'Sociology'],
  aqa:       ['Biology', 'Chemistry', 'Physics', 'Maths', 'History', 'Psychology', 'Computer Science'],
};

interface SubjectContentProps {
  topic: string;
}

export default function SubjectContent({ topic }: SubjectContentProps) {
  const seo = SUBJECT_SEO[topic];
  const subjects = TOPIC_TO_SUBJECTS[topic] ?? [];
  const relatedDecks = LIBRARY_DECKS.filter(d => subjects.includes(d.subject));

  const allEntries = [...SUBJECTS, ...CURRICULA];
  const entry = allEntries.find(e => e.href === `/${topic}-flashcards`);
  const Icon = entry?.icon;
  const shortLabel = seo?.h1?.replace(' Flashcards', '') ?? topic;

  const otherSubjects = SUBJECTS.filter(s => s.href !== `/${topic}-flashcards`).slice(0, 4);

  // Split into two columns so the deck list matches the reference's 2-up card grid
  const half = Math.ceil(relatedDecks.length / 2);
  const deckColumns = [relatedDecks.slice(0, half), relatedDecks.slice(half)].filter(c => c.length > 0);

  return (
    <main>
      {/* Interactive section — NavBar, hero, FlashcardGenerator, login modal */}
      <SubjectPageClient
        title={seo?.h1 ?? topic}
        subtitle={seo?.subtitle ?? ''}
        topic={topic}
        breadcrumbLabel={shortLabel}
        pill={Icon ? <><Icon size={14} /> {shortLabel} · {relatedDecks.length} free decks</> : undefined}
      />

      {/* Static content — server-rendered for Google */}
      <div className="container">
        {seo?.intro && (
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, opacity: 0.75, maxWidth: 780, margin: '0 auto 3rem', textAlign: 'center', fontFamily: 'var(--sans)' }}>
            {seo.intro}
          </p>
        )}

        {deckColumns.length > 0 && (
          <div className="subject-section" id="free-flashcards" style={{ textAlign: 'center' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Free {shortLabel} decks</div>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>Ready-made {shortLabel} flashcard sets</h2>
            <p className="section-subtitle">No account needed to preview the first 10 cards of any deck.</p>
            <div className="lib-grid" style={{ gridTemplateColumns: `repeat(${deckColumns.length}, 1fr)` }}>
              {deckColumns.map((decks, i) => (
                <div key={i} className="lib-col">
                  <h4>{shortLabel}</h4>
                  <ul>
                    {decks.map(deck => (
                      <li key={deck.slug}>
                        <Link href={`/library/${deck.slug}`}>
                          <span className="nm">{deck.title}</span>
                          <span className="ct">{deck.cards.length} cards →</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {otherSubjects.length > 0 && (
          <div className="subject-section" style={{ textAlign: 'center' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Keep going</div>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>Other subjects students revise here</h2>
            <div className="subject-grid subject-grid-4">
              {otherSubjects.map((s) => {
                const name = s.name.replace(' Flashcards', '');
                const count = deckCountBySubject[name] ?? 0;
                return (
                  <Link key={s.href} href={s.href} className="subject-card">
                    <div className="subject-icon"><s.icon size={20} strokeWidth={1.75} /></div>
                    <span>
                      <b>{name}</b>
                      <small>{count > 0 ? `${count} free decks` : 'Generate from notes'}</small>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="subject-section" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Pricing</div>
          <h2 className="section-title" style={{ fontSize: '2rem' }}>Start free. Upgrade when you need more.</h2>
          <p className="section-subtitle">One free deck a day, no account needed. Go Plus when you want unlimited.</p>
          <PricingCards />
        </div>

        <div className="subject-section">
          <div className="final-cta">
            <h2>Turn your {shortLabel} notes into a deck now.</h2>
            <p>Paste them, upload a PDF, or pick a topic — your first deck is free.</p>
            <div className="final-cta-actions">
              <a href="#generator" className="btn-cta-light"><Zap size={16} /> Make {shortLabel} flashcards</a>
              <Link href="/library" className="btn-cta-ghost">Browse all decks</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
