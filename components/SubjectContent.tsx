import Link from 'next/link';
import SubjectPageClient from '@/components/SubjectPageClient';
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

  return (
    <main>
      {/* Interactive section — NavBar, Header, intro, FlashcardGenerator, login modal */}
      <SubjectPageClient
        title={seo?.h1 ?? topic}
        subtitle={seo?.subtitle ?? ''}
        intro={seo?.intro ?? ''}
        topic={topic}
      />

      {/* Static content — server-rendered for Google */}
      <div className="container">
        {relatedDecks.length > 0 && (
          <div className="subject-section" id="free-flashcards">
            <h2 className="section-title">Free Flashcard Sets</h2>
            <p className="section-subtitle">Browse pre-made sets — no account needed to get started</p>
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

        <div className="subject-section">
          <h2 className="section-title">Flashcards by Subject</h2>
          <p className="section-subtitle">Pick a subject and upload your notes — your deck is ready in seconds</p>
          <div className="subject-grid">
            {SUBJECTS.map((s) => (
              <Link key={s.href} href={s.href} className="subject-card">
                <div className="subject-icon">{s.icon}</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.name}</h3>
              </Link>
            ))}
          </div>
        </div>

        <div className="subject-section">
          <h2 className="section-title">Flashcards by Curriculum</h2>
          <p className="section-subtitle">Find flashcards tailored to your exam board or qualification</p>
          <div className="subject-grid">
            {CURRICULA.map((c) => (
              <Link key={c.href} href={c.href} className="subject-card">
                <div className="subject-icon">{c.icon}</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{c.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
