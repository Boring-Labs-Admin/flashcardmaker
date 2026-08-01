'use client';

export default function CBRIntroScreen({ cardCount, onStart }: { cardCount: number; onStart: () => void }) {
  return (
    <div className="cbr-overlay">
      <div className="cbr-intro-cards" aria-hidden="true">
        <div className="cbr-intro-card cbr-intro-card-1"><span>What is the capital of France?</span><div className="cbr-intro-card-reveal" style={{ background: '#ffd600' }}>REVEAL</div></div>
        <div className="cbr-intro-card cbr-intro-card-2"><span>What is the chemical symbol for water?</span><div className="cbr-intro-card-reveal" style={{ background: '#e91e8c' }}>REVEAL</div></div>
      </div>

      <h1 className="cbr-intro-heading">
        Flashcard Maker&apos;s Confidence-Based Repetition (CBR) system helps you learn faster, using brain science.
      </h1>

      <button className="cbr-outline-btn" onClick={onStart}>
        STUDY {cardCount} CARD{cardCount === 1 ? '' : 'S'}
      </button>
    </div>
  );
}
