'use client';

import { Confidence } from '@/lib/types';
import { CONFIDENCE_COLORS, CONFIDENCE_CONSEQUENCE, CONFIDENCE_LABELS } from './cbrConstants';

const RATING_ORDER: Confidence[] = [1, 2, 3, 4, 5];

export default function ConfidenceFeedbackScreen({ rating, onDismiss }: { rating: Confidence; onDismiss: () => void }) {
  return (
    <div className="cbr-overlay cbr-overlay-panel">
      <div className="cbr-feedback-panel">
        <h2>You rated this card a {rating}.</h2>
        <p>{CONFIDENCE_CONSEQUENCE[rating]}</p>

        <div className="cbr-feedback-scale">
          <span className="cbr-feedback-scale-label">Repeat Often</span>
          <div className="cbr-feedback-scale-arrow" aria-hidden="true">&#8594;</div>
          <span className="cbr-feedback-scale-label">Repeat Rarely</span>
        </div>
        <div className="cbr-feedback-dots">
          {RATING_ORDER.map(n => (
            <div key={n} className="cbr-feedback-dot-wrap">
              <span className="cbr-feedback-dot" style={{ background: CONFIDENCE_COLORS[n] }}>{n}</span>
              <span className="cbr-feedback-dot-label">{CONFIDENCE_LABELS[n]}</span>
            </div>
          ))}
        </div>

        <button className="cbr-outline-btn" onClick={onDismiss}>GOT IT!</button>
      </div>
    </div>
  );
}
