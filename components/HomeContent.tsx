'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import FlashboardModal from '@/components/FlashboardModal';
import Link from 'next/link';
import { SUBJECTS, CURRICULA } from '@/lib/subjects';
import { getDecksBySubject } from '@/lib/library';

const decksBySubject = getDecksBySubject();

export default function HomeContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main>
      <NavBar onLoginClick={() => setIsModalOpen(true)} />
      <Header />
      <div className="container">
        <FlashcardGenerator onOpenModal={() => setIsModalOpen(true)} />
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
        <div className="subject-section" id="free-flashcards">
          <h2 className="section-title">Free Flashcard Library</h2>
          <p className="section-subtitle">Browse pre-made flashcard sets — no account needed to get started</p>
          <div className="library-directory">
            {Object.entries(decksBySubject).map(([subject, decks]) => (
              <div key={subject} className="library-subject-group">
                <div className="library-subject-heading">{subject}</div>
                {decks.map(deck => (
                  <Link key={deck.slug} href={`/library/${deck.slug}`} className="library-directory-row">
                    <span className="library-row-title">{deck.title}</span>
                    <span className="library-row-count">{deck.cards.length} cards</span>
                    <span className="library-row-arrow">→</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <FlashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
