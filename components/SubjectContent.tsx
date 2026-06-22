import Link from 'next/link';
import SubjectPageClient from '@/components/SubjectPageClient';
import PricingCards from '@/components/PricingCards';
import { SUBJECTS, CURRICULA } from '@/lib/subjects';
import { LIBRARY_DECKS } from '@/lib/library';
import { SUBJECT_SEO } from '@/lib/subject-seo';

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

        {relatedDecks.length > 0 && (
          <div className="subject-section" id="free-flashcards">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Free {shortLabel} decks</div>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>Ready-made {shortLabel} flashcard sets</h2>
            <p className="section-subtitle">No account needed to preview the first 10 cards of any deck.</p>
            <div className="subject-deck-list">
              {relatedDecks.map(deck => (
                <Link key={deck.slug} href={`/library/${deck.slug}`} className="subject-deck-row">
                  <div className="subject-deck-info">
                    <span className="subject-deck-title">{deck.title}</span>
                    <span className="subject-deck-subject">{deck.subject}</span>
                  </div>
                  <span className="subject-deck-count">{deck.cards.length} cards</span>
                  <span className="subject-deck-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {otherSubjects.length > 0 && (
          <div className="subject-section">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Keep going</div>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>Other subjects students revise here</h2>
            <div className="subject-grid subject-grid-4">
              {otherSubjects.map((s) => (
                <Link key={s.href} href={s.href} className="subject-card">
                  <div className="subject-icon"><s.icon size={32} strokeWidth={1.75} /></div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.name}</h3>
                </Link>
              ))}
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
              <a href="#generator" className="btn-cta-light">Make {shortLabel} flashcards</a>
              <Link href="/library" className="btn-cta-ghost">Browse all decks</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
