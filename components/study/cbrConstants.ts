import { Confidence } from '@/lib/types';

export const CONFIDENCE_COLORS: Record<Confidence, string> = {
  1: '#e91e8c',
  2: '#ff6b00',
  3: '#ffd600',
  4: '#4caf50',
  5: '#00bcd4',
};

export const UNRATED_COLOR = '#9aa5b1';

export const CONFIDENCE_LABELS: Record<Confidence, string> = {
  1: 'Not at all',
  2: 'Barely',
  3: 'Somewhat',
  4: 'Mostly',
  5: 'Perfectly',
};

export const CONFIDENCE_CONSEQUENCE: Record<Confidence, string> = {
  1: 'It will repeat very soon.',
  2: 'It will repeat soon.',
  3: 'It will repeat occasionally.',
  4: 'It will repeat less often.',
  5: "It shouldn't repeat for a while.",
};

export const CONFIDENCE_REPEAT_FREQUENCY: Record<Confidence, string> = {
  1: 'often',
  2: 'often',
  3: 'occasionally',
  4: 'rarely',
  5: 'rarely',
};

export const CBR_INTRO_SEEN_KEY = 'cbr_intro_seen';
export const CBR_RATING_EXPLAINED_KEY = 'cbr_rating_explained';

export function formatRoundTimer(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
