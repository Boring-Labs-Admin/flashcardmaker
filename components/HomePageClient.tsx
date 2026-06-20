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
      <section className="header" id="generator">
        <div className="header-content hero-grid">
          <Header />
          <div>
            <FlashcardGenerator onOpenModal={openModal} hideFeatures />
          </div>
        </div>
      </section>
      <HowItWorksStrip />
      <FlashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} reason={modalReason} />
    </>
  );
}
