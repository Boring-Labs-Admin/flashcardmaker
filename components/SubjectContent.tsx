'use client';

import { useState } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import FlashboardModal from '@/components/FlashboardModal';
import { SUBJECTS, CURRICULA } from '@/lib/subjects';

interface SubjectContentProps {
  title: string;
  subtitle: string;
  topic: string;
}

export default function SubjectContent({ title, subtitle, topic }: SubjectContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main>
      <NavBar onLoginClick={() => setIsModalOpen(true)} />
      <Header title={title} subtitle={subtitle} />
      <div className="container">
        <FlashcardGenerator topic={topic} onOpenModal={() => setIsModalOpen(true)} />
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
      <FlashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
