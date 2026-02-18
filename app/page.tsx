'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import FlashboardModal from '@/components/FlashboardModal';
import Link from 'next/link';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const subjects = [
    { name: 'Science Flashcards', icon: '🔬', href: '/science-flashcards' },
    { name: 'Maths Flashcards', icon: '📐', href: '/maths-flashcards' },
    { name: 'Law Flashcards', icon: '⚖️', href: '/law-flashcards' },
    { name: 'Biology Flashcards', icon: '🧬', href: '/biology-flashcards' },
    { name: 'Chemistry Flashcards', icon: '⚗️', href: '/chemistry-flashcards' },
    { name: 'Physics Flashcards', icon: '⚛️', href: '/physics-flashcards' },
  ];

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
            {subjects.map((s) => (
              <Link key={s.name} href={s.href} className="subject-card">
                <div className="subject-icon">{s.icon}</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <FlashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}