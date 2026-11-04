'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Plus, FileText, UploadCloud, Wand2 } from 'lucide-react';
import CreateFromSource from '@/components/dashboard/CreateFromSource';
import PlusFeatureModal from '@/components/dashboard/PlusFeatureModal';
import CreateDeckModal from '@/components/class/CreateDeckModal';
import { useDashboard } from '@/lib/dashboard-context';

type View = 'chooser' | 'paste' | 'upload' | 'topic';

function CreateFlashcardsContent() {
  const { planData, isAdmin } = useDashboard();
  const searchParams = useSearchParams();
  const urlClassId = searchParams.get('classId');
  const startParam = searchParams.get('start');
  const isPlus = isAdmin || planData?.plan === 'plus';

  // The Set (if any) comes from the URL, e.g. when arriving from a Set page.
  const selectedClassId = urlClassId;
  const [showManualModal, setShowManualModal] = useState(false);
  const [showTopicUpgrade, setShowTopicUpgrade] = useState(false);
  const [view, setView] = useState<View>(startParam === 'notes' ? 'paste' : 'chooser');

  // Free users get an upgrade card instead of the topic generator.
  const openTopic = () => {
    if (isPlus) setView('topic');
    else setShowTopicUpgrade(true);
  };

  useEffect(() => {
    // Plan data loads asynchronously — if it turns out the user is Plus, drop the upgrade card.
    if (isPlus) setShowTopicUpgrade(false);
    if (startParam === 'topic') openTopic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startParam, isPlus]);

  return (
    <div className="container">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="dashboard-page-title">Create Flashcards</h1>
        <p className="dashboard-page-subtitle">Type your own cards, turn your notes into a deck, or generate one from a topic.</p>
      </div>

      {view === 'chooser' && (
        <div className="create-flashcards-card">
          <div className="modal-title" style={{ textAlign: 'center' }}>How do you want to make your cards?</div>
          <div className="make-options">
            <button className="make-option" onClick={() => setShowManualModal(true)}>
              <Plus size={26} />
              <b>Type them yourself</b>
              <span>Start a blank deck and write your own cards.</span>
            </button>
            <button className="make-option" onClick={() => setView('paste')}>
              <FileText size={26} />
              <b>Paste your notes</b>
              <span>Drop in a big batch of text and we&apos;ll turn it into cards.</span>
            </button>
            <button className="make-option" onClick={() => setView('upload')}>
              <UploadCloud size={26} />
              <b>Upload documents</b>
              <span>PDFs, Word docs, text files or photos of your notes.</span>
            </button>
            <button className="make-option make-option-featured" onClick={openTopic}>
              <Wand2 size={26} />
              <b>Generate from a topic {!isPlus && <span className="gen-tab-badge">PLUS</span>}</b>
              <span>Type a topic and a full deck is written for you.</span>
            </button>
          </div>
        </div>
      )}

      {view !== 'chooser' && (
        <div className="create-flashcards-card">
          <button className="create-flashcards-back" onClick={() => setView('chooser')}><ArrowLeft size={16} /> Back</button>
          <CreateFromSource mode={view} classId={selectedClassId} />
        </div>
      )}

      {showTopicUpgrade && (
        <PlusFeatureModal
          title="Generating from a topic is a Plus feature"
          description="Upgrade to Plus to type any topic and get a full deck written for you. You can still type cards yourself, paste notes or upload documents for free."
          onClose={() => setShowTopicUpgrade(false)}
        />
      )}

      {showManualModal && (
        <CreateDeckModal
          classId={selectedClassId}
          onCreated={() => setShowManualModal(false)}
          onCancel={() => setShowManualModal(false)}
        />
      )}
    </div>
  );
}

export default function CreateFlashcardsPage() {
  return (
    <Suspense>
      <CreateFlashcardsContent />
    </Suspense>
  );
}
