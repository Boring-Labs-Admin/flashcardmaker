'use client';

export default function RoundCompleteScreen({
  pointsEarned,
  showExplainer,
  onDismiss,
}: {
  pointsEarned: number;
  showExplainer: boolean;
  onDismiss: () => void;
}) {
  return (
    <div className="cbr-overlay cbr-round-complete">
      <h1>Round Complete!</h1>

      <div className="cbr-points-ring">
        <div className="cbr-points-ring-inner">
          <span className="cbr-points-label">Points Earned <span className="cbr-info-icon">ⓘ</span></span>
          <span className="cbr-points-value">{pointsEarned}</span>
        </div>
      </div>

      {showExplainer && (
        <p className="cbr-round-complete-subtext">
          You&apos;ve begun optimising your studies with <b>spaced repetition</b>.
        </p>
      )}

      <button className="cbr-solid-btn" onClick={onDismiss}>GOT IT!</button>
    </div>
  );
}
