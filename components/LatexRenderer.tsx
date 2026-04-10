'use client';

import katex from 'katex';

interface LatexRendererProps {
  text: string;
}

interface Segment {
  type: 'text' | 'block' | 'inline';
  content: string;
}

function parseSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  // Match $$...$$ (block) or $...$ (inline)
  const regex = /(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith('$$')) {
      segments.push({ type: 'block', content: raw.slice(2, -2) });
    } else {
      segments.push({ type: 'inline', content: raw.slice(1, -1) });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return segments;
}

function renderMath(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, { displayMode, throwOnError: false, output: 'html' });
  } catch {
    return latex;
  }
}

export default function LatexRenderer({ text }: LatexRendererProps) {
  if (!text) return null;

  const segments = parseSegments(text);

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === 'block') {
          return (
            <div
              key={i}
              className="math-block"
              dangerouslySetInnerHTML={{ __html: renderMath(seg.content, true) }}
            />
          );
        }
        if (seg.type === 'inline') {
          return (
            <span
              key={i}
              dangerouslySetInnerHTML={{ __html: renderMath(seg.content, false) }}
            />
          );
        }
        return <span key={i}>{seg.content}</span>;
      })}
    </>
  );
}
