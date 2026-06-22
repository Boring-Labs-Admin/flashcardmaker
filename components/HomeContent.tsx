import Link from 'next/link';
import { Check, ArrowRight, FileText, File, Image as ImageIcon, Sigma } from 'lucide-react';
import HomePageClient from '@/components/HomePageClient';
import PricingCards from '@/components/PricingCards';
import ScrollReveal from '@/components/ScrollReveal';
import StudyModesDemo from '@/components/StudyModesDemo';
import { SUBJECTS, CURRICULA } from '@/lib/subjects';
import { getDecksBySubject, LIBRARY_DECKS } from '@/lib/library';

const CURRICULUM_SUBTITLES: Record<string, string> = {
  'GCSE Flashcards': 'Foundation & Higher essentials',
  'A-Level Flashcards': 'Depth for exams & coursework',
  'AQA Flashcards': 'Mapped to the AQA spec',
};

const decksBySubject = getDecksBySubject();
const deckCountBySubject: Record<string, number> = {};
for (const deck of LIBRARY_DECKS) {
  deckCountBySubject[deck.subject] = (deckCountBySubject[deck.subject] ?? 0) + 1;
}

export default function HomeContent() {
  return (
    <main>
      {/* Interactive section — NavBar, Header, FlashcardGenerator, Stats, How it works, login modal */}
      <HomePageClient />

      {/* Static content — server-rendered for Google */}
      <div className="container">

        <ScrollReveal>
          <div className="subject-section">
            <div className="feature-split">
              <div className="feature-split-text">
                <div className="eyebrow">Built to revise with</div>
                <h3>One deck, three ways to study</h3>
                <p>Different topics stick in different ways. Flip cards to test recall, scan a list to revise fast, or run a quiz to find the gaps.</p>
                <ul className="feat-list">
                  {[
                    'Flip cards one at a time to test recall',
                    'Scan the whole deck as a list to revise fast',
                    'Run a multiple-choice quiz to find the gaps',
                    'Instant marking, no waiting for results',
                  ].map(f => (
                    <li key={f}><span className="tick"><Check size={14} strokeWidth={3} /></span>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="fig">
                <StudyModesDemo />
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="subject-section">
            <div className="feature-split rev">
              <div className="fig">
                <div className="mock-filetypes">
                  <div className="mock-filetype-chip"><span className="tile"><FileText size={18} /></span><span>PDF</span></div>
                  <div className="mock-filetype-chip"><span className="tile"><File size={18} /></span><span>Word</span></div>
                  <div className="mock-filetype-chip"><span className="tile"><ImageIcon size={18} /></span><span>Photos</span></div>
                  <div className="mock-filetype-chip"><span className="tile"><Sigma size={18} /></span><span>Equations</span></div>
                </div>
              </div>
              <div className="feature-split-text">
                <div className="eyebrow">Works with anything</div>
                <h3>Whatever your notes look like, we read them</h3>
                <p>Lecture slides, scanned PDFs, photos of a textbook page, even equations — drop them in and get a deck back.</p>
                <ul className="feat-list">
                  {[
                    'PDFs and Word documents',
                    'Photos of handwritten or printed notes',
                    'Plain pasted text',
                    'Maths and science notation, rendered properly',
                  ].map(f => (
                    <li key={f}><span className="tick"><Check size={14} strokeWidth={3} /></span>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="subject-section" id="subjects">
          <h2 className="section-title">Flashcards by Subject</h2>
          <p className="section-subtitle">Pick a subject and upload your notes — your deck is ready in seconds</p>
          <div className="subject-grid subject-grid-4">
            {SUBJECTS.map((s) => (
              <Link key={s.href} href={s.href} className="subject-card">
                <div className="subject-icon"><s.icon size={32} strokeWidth={1.75} /></div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.name}</h3>
                {deckCountBySubject[s.name.replace(' Flashcards', '')] > 0 && (
                  <p style={{ fontSize: '0.8rem', fontFamily: 'var(--sans)', opacity: 0.65, marginTop: '0.35rem' }}>
                    {deckCountBySubject[s.name.replace(' Flashcards', '')]} free decks
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="subject-section">
          <h2 className="section-title">Flashcards by Curriculum</h2>
          <p className="section-subtitle">Find flashcards tailored to your exam board or qualification</p>
          <div className="curric-grid">
            {CURRICULA.map((c) => (
              <Link key={c.href} href={c.href} className="curric-card">
                <div>
                  <div className="curric-card-title">{c.name.replace(' Flashcards', '')}</div>
                  <div className="curric-card-sub">{CURRICULUM_SUBTITLES[c.name]}</div>
                </div>
                <div className="curric-arrow"><ArrowRight size={18} strokeWidth={2.5} /></div>
              </Link>
            ))}
          </div>
        </div>

        <div className="subject-section" id="free-flashcards">
          <h2 className="section-title">Free Flashcard Library</h2>
          <p className="section-subtitle">Browse pre-made flashcard sets — no account needed to get started</p>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Link href="/library" className="btn-outline">
              View full library →
            </Link>
          </div>
          <div className="library-directory">
            {Object.entries(decksBySubject).map(([subject, decks]) => (
              <div key={subject} className="library-subject-group">
                <div className="library-subject-heading">{subject}</div>
                {decks.slice(0, 3).map(deck => (
                  <Link key={deck.slug} href={`/library/${deck.slug}`} className="library-directory-row">
                    <span className="library-row-title">{deck.title}</span>
                    <span className="library-row-count">{deck.cards.length} cards</span>
                    <span className="library-row-arrow">→</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/library" className="btn-outline">
              View full library →
            </Link>
          </div>
        </div>

        <div className="subject-section" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Pricing</div>
          <h2 className="section-title" style={{ fontSize: '2rem' }}>Start free. Upgrade when you need more.</h2>
          <p className="section-subtitle">One free deck a day, no account needed. Go Plus when you want unlimited.</p>
          <PricingCards />
        </div>

        <div className="subject-section">
          <div className="final-cta">
            <h2>Your next revision deck is two seconds away.</h2>
            <p>Paste your notes, upload a PDF, or pick a topic — and start studying. No sign-up to try your first one.</p>
            <div className="final-cta-actions">
              <Link href="/#generator" className="btn-cta-light">Make my flashcards</Link>
              <Link href="/library" className="btn-cta-ghost">Browse the free library</Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
