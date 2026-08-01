export type ImportDelimiter = 'tab' | 'comma' | 'newline-pair';

export function parseImportText(text: string, delimiter: ImportDelimiter): { question: string; answer: string }[] {
  const pairs: { question: string; answer: string }[] = [];

  if (delimiter === 'newline-pair') {
    const blocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
    for (let i = 0; i < blocks.length - 1; i += 2) {
      const question = blocks[i].trim();
      const answer = blocks[i + 1].trim();
      if (question && answer) pairs.push({ question, answer });
    }
    return pairs;
  }

  const sep = delimiter === 'tab' ? '\t' : ',';
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const idx = line.indexOf(sep);
    if (idx === -1) continue;
    const question = line.slice(0, idx).trim();
    const answer = line.slice(idx + 1).trim();
    if (question && answer) pairs.push({ question, answer });
  }
  return pairs;
}
