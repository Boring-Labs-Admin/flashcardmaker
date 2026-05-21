'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import FlashboardModal from '@/components/FlashboardModal';

interface SubjectPageClientProps {
  title: string;
  subtitle: string;
  intro: string;
  topic: string;
}

export default function SubjectPageClient({ title, subtitle, intro, topic }: SubjectPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <NavBar onLoginClick={() => setIsModalOpen(true)} />
      <Header title={title} subtitle={subtitle} />
      <div className="container">
        {intro && (
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, opacity: 0.75, maxWidth: 680, marginBottom: '2rem' }}>
            {intro}
          </p>
        )}
        <FlashcardGenerator topic={topic} onOpenModal={() => setIsModalOpen(true)} />
      </div>
      <FlashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
