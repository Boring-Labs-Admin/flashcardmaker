'use client';

import { ReactNode, useState } from 'react';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import FlashboardModal, { FlashboardModalReason } from '@/components/FlashboardModal';

interface SubjectPageClientProps {
  title: string;
  subtitle: string;
  topic: string;
  pill?: ReactNode;
  breadcrumbLabel?: string;
}

export default function SubjectPageClient({ title, subtitle, topic, pill, breadcrumbLabel }: SubjectPageClientProps) {
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
            <Header title={title} subtitle={subtitle} pill={pill} breadcrumbLabel={breadcrumbLabel} />
          </div>
          <div>
            <FlashcardGenerator topic={topic} onOpenModal={openModal} hideFeatures onModeChange={setHasResults} />
          </div>
        </div>
      </section>
      <FlashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} reason={modalReason} />
    </>
  );
}
