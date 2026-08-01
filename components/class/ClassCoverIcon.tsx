'use client';

import { Layers } from 'lucide-react';

export default function ClassCoverIcon({
  coverColor,
  coverEmoji,
  size = 48,
}: {
  coverColor: string;
  coverEmoji?: string | null;
  size?: number;
}) {
  return (
    <div
      className="class-cover"
      style={{ backgroundColor: coverColor, width: size, height: size, borderRadius: size * 0.2 }}
    >
      {coverEmoji ? (
        <span style={{ fontSize: size * 0.5 }}>{coverEmoji}</span>
      ) : (
        <Layers size={size * 0.5} color="white" strokeWidth={1.75} />
      )}
    </div>
  );
}
