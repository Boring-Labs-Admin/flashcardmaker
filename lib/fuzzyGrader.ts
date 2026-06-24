// Deterministic, client-side grading for typed-recall and cloze answers — no API call.
// Deliberately conservative: legitimate variants should come from acceptedAnswers, not a loose edit-distance threshold.

function normalizeForGrading(s: string): string {
  return s
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // fold diacritics, e.g. café -> cafe
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/^[^\w]+|[^\w]+$/g, ''); // strip surrounding punctuation, keep internal (e.g. "ATP synthase")
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prevRow = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const currRow = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currRow.push(Math.min(
        prevRow[j] + 1,      // deletion
        currRow[j - 1] + 1,  // insertion
        prevRow[j - 1] + cost // substitution
      ));
    }
    prevRow = currRow;
  }
  return prevRow[b.length];
}

function typoThreshold(length: number): number {
  if (length <= 4) return 0;
  if (length <= 8) return 1;
  return 2;
}

// Grades a typed answer against the accepted-answer list: exact match (after normalising case,
// punctuation, whitespace, and diacritics) or a minor typo within a length-scaled threshold.
export function gradeTypedAnswer(input: string, acceptedAnswers: string[]): boolean {
  const normInput = normalizeForGrading(input);
  if (!normInput) return false;

  for (const accepted of acceptedAnswers) {
    const normAccepted = normalizeForGrading(accepted);
    if (!normAccepted) continue;
    if (normInput === normAccepted) return true;
    if (levenshtein(normInput, normAccepted) <= typoThreshold(normAccepted.length)) return true;
  }
  return false;
}
