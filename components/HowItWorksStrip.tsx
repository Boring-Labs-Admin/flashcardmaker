import { UploadCloud, Zap, BookOpen } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const STEPS = [
  {
    num: 1,
    icon: UploadCloud,
    title: 'Add your material',
    body: 'Upload a PDF, Word doc or a photo of your notes — or just paste text. Got nothing to hand? Type a topic instead.',
  },
  {
    num: 2,
    icon: Zap,
    title: 'AI writes the cards',
    body: 'It reads your material and turns it into clean question-and-answer flashcards — including maths and equations — in a couple of seconds.',
  },
  {
    num: 3,
    icon: BookOpen,
    title: 'Study with spaced repetition',
    body: 'Flip through cards, switch to a list, or rate your confidence on each one and let the toughest cards resurface sooner. Save a free account and your decks are waiting next time.',
  },
];

export default function HowItWorksStrip() {
  return (
    <div className="bg-band" id="how">
      <div className="container" style={{ padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>How it works</div>
        </div>
        <h2 className="section-title" style={{ fontSize: '2rem' }}>From notes to a finished deck in under a minute</h2>
        <p className="section-subtitle">Three ways in, one result: a deck you can flip, list and study straight away.</p>
        <ScrollReveal>
          <div className="features">
            {STEPS.map((s) => (
              <div key={s.title} className="feature" style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: -14, left: 24, width: 30, height: 30, borderRadius: 9,
                  background: 'var(--navy)', color: 'var(--yellow-bolt)', fontFamily: 'var(--mono)',
                  fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{s.num}</div>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--sky)', color: 'var(--cobalt-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.9rem' }}><s.icon size={22} strokeWidth={2} /></div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.93rem', color: 'var(--slate)', fontFamily: 'var(--sans)', lineHeight: 1.55 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
