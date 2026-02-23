import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Flashcard Maker — Turn documents into study cards instantly';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#004AAD',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background bolt watermark */}
        <div
          style={{
            position: 'absolute',
            right: -60,
            top: -40,
            fontSize: 480,
            opacity: 0.07,
            lineHeight: 1,
            display: 'flex',
          }}
        >
          ⚡
        </div>

        {/* Logo bolt */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: '#003A8C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 52,
            marginBottom: 32,
            border: '3px solid rgba(245,197,24,0.4)',
          }}
        >
          ⚡
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-2px',
            marginBottom: 20,
            display: 'flex',
          }}
        >
          Flashcard Maker
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 30,
            color: '#F5C518',
            fontWeight: 700,
            letterSpacing: '0.5px',
            display: 'flex',
          }}
        >
          Turn documents, notes &amp; photos into flashcards — instantly
        </div>

        {/* Domain badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 22,
            color: 'rgba(255,255,255,0.5)',
            display: 'flex',
          }}
        >
          flashcardmaker.co.uk
        </div>
      </div>
    ),
    { ...size }
  );
}
