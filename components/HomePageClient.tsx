'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import FlashboardModal from '@/components/FlashboardModal';

export default function HomePageClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <NavBar onLoginClick={() => setIsModalOpen(true)} />
      <Header />
      <div className="container">
        <FlashcardGenerator onOpenModal={() => setIsModalOpen(true)} />
      </div>
      <FlashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
