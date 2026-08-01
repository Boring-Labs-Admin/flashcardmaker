'use client';

interface MasteryRingProps {
  pct: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export default function MasteryRing({ pct, size = 80, strokeWidth = 6, showLabel = false }: MasteryRingProps) {
  const clamped = Math.max(0, Math.min(100, pct));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const center = size / 2;
  const fontSize = size <= 44 ? size * 0.24 : size * 0.2;

  return (
    <div className="mastery-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--line)" strokeWidth={strokeWidth} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#00bcd4"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="mastery-ring-text" style={{ fontSize }}>
        {showLabel && <span className="mastery-ring-label">Mastery</span>}
        <span className="mastery-ring-pct">{clamped.toFixed(1)}%</span>
      </div>
    </div>
  );
}
