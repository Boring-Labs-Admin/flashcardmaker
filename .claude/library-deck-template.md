# Free Library Deck Template

Reference for adding new free flashcard decks to the library. Follow this exactly to keep all decks consistent.

---

## Files to edit

1. **`lib/library.ts`** — the deck data (slug, title, subject, topic, cards)
2. **`lib/library-seo.ts`** — the SEO metadata for the deck page

---

## Slug convention

```
free-flashcards-for-[subject]-[topic]
```

- All lowercase, hyphens only
- Subject and topic are slugified (e.g. `computer-science`, `data-representation`)
- **Never include qualifiers** like `gcse`, `a-level`, `as`, `year-12` in the slug
- Examples:
  - `free-flashcards-for-biology-cell-biology`
  - `free-flashcards-for-computer-science-algorithms`
  - `free-flashcards-for-history-cold-war`

---

## `lib/library.ts` — deck entry

Add a new `deck(...)` call inside `LIBRARY_DECKS`:

```ts
deck(
  'free-flashcards-for-[subject]-[topic]',   // slug
  '[Subject]: [Topic Title]',                 // title  e.g. 'Biology: Cell Biology'
  '[Subject]',                                // subject e.g. 'Biology'
  '[Topic Title]',                            // topic   e.g. 'Cell Biology'
  [
    { question: '...', answer: '...' },
    // aim for 20 cards per deck
  ]
),
```

### Card content rules

- Aim for as many cards as possible — more is better, up to ~50 per deck
- Non-signed-up users see the **first 10 cards** only, then get prompted to sign up/log in to see the full deck
- Questions are concise and exam-style
- Answers are complete but punchy — 1–3 sentences max
- Use plain English; avoid markdown inside question/answer strings
- Escape single quotes inside strings with `\'` or use double quotes for the outer string

---

## `lib/library-seo.ts` — SEO entry

Add an entry keyed by the exact slug:

```ts
'free-flashcards-for-[subject]-[topic]': {
  metaTitle: '[Topic] Flashcards | Free [Subject] Cards',
  metaDescription: '[60–160 char description mentioning the topic, Flashcard Maker, no login needed.]',
  h1: '[Topic] Flashcards',
  h2: 'Free [GCSE/A Level] [Subject] [Study/Revision] Cards',
  intro: '[2–3 sentence intro describing what the deck covers and who it is for. Mention relevant exam levels (GCSE, A Level) naturally.]',
},
```

### SEO field guidelines

| Field | Length | Notes |
|---|---|---|
| `metaTitle` | ≤ 60 chars | Include topic + subject + "Flashcards" |
| `metaDescription` | 120–160 chars | Mention key subtopics, "free", "no account/login" |
| `h1` | short | Topic + "Flashcards" or "Questions and Answers" |
| `h2` | short | "Free [Level] [Subject] [Cards/Revision Flashcards]" |
| `intro` | 2–3 sentences | Describes content scope and target exam level |

---

## Checklist when adding a new deck

- [ ] Slug follows `free-flashcards-for-[subject]-[topic]` format with no level qualifiers
- [ ] Deck added to `LIBRARY_DECKS` in `lib/library.ts`
- [ ] SEO entry added to `DECK_SEO` in `lib/library-seo.ts` with the same slug key
- [ ] Deck has as many cards as possible (aim for 30–50; minimum ~20)
- [ ] Title format is `Subject: Topic` (e.g. `Biology: Cell Biology`)
- [ ] Deck added to the memory file `project_library_decks.md` under the correct subject
- [ ] No duplicate of an existing deck (check `project_library_decks.md`)
