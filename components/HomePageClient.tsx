'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import HowItWorksStrip from '@/components/HowItWorksStrip';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import FlashboardModal, { FlashboardModalReason } from '@/components/FlashboardModal';

export default function HomePageClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState<FlashboardModalReason>('generic');

  const openModal = (reason: FlashboardModalReason = 'generic') => {
    setModalReason(reason);
    setIsModalOpen(true);
  };

  return (
    <>
      <NavBar onLoginClick={() => openModal('generic')} />
      <Header />
      <HowItWorksStrip />
      <div className="container">
        <FlashcardGenerator onOpenModal={openModal} />
      </div>
      <FlashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} reason={modalReason} />
    </>
  );
}
