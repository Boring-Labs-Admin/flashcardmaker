import { UploadCloud, Zap, Brain } from 'lucide-react';

const STEPS = [
  { icon: UploadCloud, title: '1. Upload or paste', body: 'Add your notes, a PDF, photos of your textbook — or just type a topic.' },
  { icon: Zap, title: '2. AI builds your deck', body: 'Get a full set of question-and-answer flashcards in seconds.' },
  { icon: Brain, title: '3. Study & test yourself', body: 'Flip through cards, switch view modes, or take a multiple-choice test.' },
];

export default function HowItWorksStrip() {
  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>
      <h2 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>How it works</h2>
      <p className="section-subtitle" style={{ marginBottom: '2rem' }}>From notes to a finished deck in under a minute</p>
      <div className="features" style={{ marginBottom: 0 }}>
        {STEPS.map((s) => (
          <div key={s.title} className="feature">
            <div style={{ marginBottom: '1rem' }}><s.icon size={40} strokeWidth={1.75} /></div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.title}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{s.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
