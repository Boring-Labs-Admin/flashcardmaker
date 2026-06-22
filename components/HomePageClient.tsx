'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import StatsBand from '@/components/StatsBand';
import HowItWorksStrip from '@/components/HowItWorksStrip';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import FlashboardModal, { FlashboardModalReason } from '@/components/FlashboardModal';

export default function HomePageClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState<FlashboardModalReason>('generic');
  const [hasResults, setHasResults] = useState(false);

  const openModal = (reason: FlashboardModalReason = 'generic') => {
    setModalReason(reason);
    setIsModalOpen(true);
  };

  return (
    <>
      <NavBar onLoginClick={() => openModal('generic')} />
      <section className="header" id="generator">
        <div className={`header-content hero-grid${hasResults ? ' results-mode' : ''}`}>
          <div style={hasResults ? { display: 'none' } : undefined}>
            <Header />
          </div>
          <div>
            <FlashcardGenerator onOpenModal={openModal} hideFeatures onModeChange={setHasResults} />
          </div>
        </div>
      </section>
      {!hasResults && (
        <>
          <StatsBand />
          <HowItWorksStrip />
        </>
      )}
      <FlashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} reason={modalReason} />
    </>
  );
}
