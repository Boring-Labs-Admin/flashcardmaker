import { UploadCloud, Zap, Brain } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const STEPS = [
  { num: 1, icon: UploadCloud, title: 'Add your material', body: 'Upload, paste, or pick a topic.' },
  { num: 2, icon: Zap, title: 'AI writes the cards', body: 'Converts your material into Q&A pairs in seconds.' },
  { num: 3, icon: Brain, title: 'Study & test yourself', body: 'Flip, list, or run a multiple-choice quiz.' },
];

export default function HowItWorksStrip() {
  return (
    <div className="subject-section" style={{ marginTop: '5rem' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>How it works</div>
      </div>
      <h2 className="section-title" style={{ fontSize: '2rem' }}>From notes to a finished deck in under a minute</h2>
      <p className="section-subtitle">Three ways in, one result: a deck you can flip, list and test yourself on straight away.</p>
      <ScrollReveal>
        <div className="features">
          {STEPS.map((s) => (
            <div key={s.title} className="feature" style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', top: '1rem', right: '1rem', width: 28, height: 28, borderRadius: '50%',
                background: 'var(--yellow-bolt)', color: 'var(--cobalt-blue)', fontFamily: 'var(--mono)',
                fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{s.num}</div>
              <div style={{ marginBottom: '1rem' }}><s.icon size={40} strokeWidth={1.75} /></div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.title}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8, fontFamily: 'var(--sans)' }}>{s.body}</div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
