'use client';

import LatexRenderer from '@/components/LatexRenderer';
import { useStudySession } from './StudySessionProvider';
import { CONFIDENCE_COLORS, CONFIDENCE_LABELS, UNRATED_COLOR } from './cbrConstants';
import { Confidence } from '@/lib/types';

const RATING_ORDER: Confidence[] = [1, 2, 3, 4, 5];

export default function StudyCard() {
  const { currentCard, isRevealed, revealAnswer, rateCard, cardsShownCount, totalCards, deckTitle } = useStudySession();

  if (!currentCard) return null;

  const barColor = currentCard.currentConfidence
    ? CONFIDENCE_COLORS[currentCard.currentConfidence]
    : UNRATED_COLOR;

  return (
    <>
      <div className="cbr-breadcrumb">
        Deck: <b>{deckTitle}</b>  Card: <b>{Math.min(cardsShownCount + 1, totalCards)}/{totalCards}</b>  <span className="cbr-see-cards">(See Cards)</span>
      </div>

      <div className="cbr-card">
        <div className="cbr-card-bar" style={{ background: barColor }} />

        <div className="cbr-card-body">
          <span className="cbr-card-icon">Q</span>
          <div className="cbr-card-question">
            <LatexRenderer text={currentCard.question} />
          </div>

          {isRevealed && (
            <>
              <div className="cbr-card-divider" />
              <span className="cbr-card-icon cbr-card-icon-a">A</span>
              <div className="cbr-card-answer">
                <LatexRenderer text={currentCard.answer} />
              </div>
            </>
          )}
        </div>

        {!isRevealed ? (
          <button
            className="cbr-reveal-btn"
            style={{ background: barColor }}
            onClick={revealAnswer}
          >
            REVEAL ANSWER
          </button>
        ) : (
          <div className="cbr-rating-panel">
            <div className="cbr-rating-prompt">How well did you know this? <span className="cbr-info-icon">ⓘ</span></div>
            <div className="cbr-rating-row">
              {RATING_ORDER.map(n => (
                <button
                  key={n}
                  className="cbr-rating-btn"
                  onClick={() => rateCard(n)}
                >
                  <span className="cbr-rating-num" style={{ background: CONFIDENCE_COLORS[n] }}>{n}</span>
                  <span className="cbr-rating-label">{CONFIDENCE_LABELS[n]}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
