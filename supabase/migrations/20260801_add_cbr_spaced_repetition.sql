-- Phase 1: Confidence-Based Repetition (CBR) & Spaced Repetition Engine
-- Applied directly to the live Supabase project on 2026-08-01 via the Supabase MCP.
-- This file exists so the schema is versioned in git — the previous three tables
-- (user_plans, decks, exam_dates, generations, generation_log) predate this and
-- have no migration file; see flashcard-maker-summary.md for that gap.

CREATE TABLE card_confidence (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deck_id       UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  card_index    INTEGER NOT NULL,
  confidence    SMALLINT NOT NULL CHECK (confidence BETWEEN 1 AND 5),
  rated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  next_review   TIMESTAMPTZ,
  UNIQUE(user_id, deck_id, card_index)
);

CREATE INDEX idx_card_confidence_user_deck ON card_confidence(user_id, deck_id);
CREATE INDEX idx_card_confidence_next_review ON card_confidence(next_review);

ALTER TABLE card_confidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own confidence" ON card_confidence
  FOR ALL USING (auth.uid() = user_id);

CREATE TABLE study_sessions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deck_id       UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at  TIMESTAMPTZ,
  cards_studied INTEGER NOT NULL DEFAULT 0,
  points_earned INTEGER NOT NULL DEFAULT 0,
  avg_confidence NUMERIC(3,2)
);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own study sessions" ON study_sessions
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE decks ADD COLUMN mastery_pct NUMERIC(5,2) DEFAULT 0.00;
ALTER TABLE decks ADD COLUMN last_studied_at TIMESTAMPTZ;

-- SECURITY DEFINER + p_user_id param mirrors the existing deduct_generation_credit /
-- add_paid_credits RPCs — callers are always server-side routes that pass the
-- authenticated session's own user id, never a client-supplied one.
CREATE OR REPLACE FUNCTION record_card_confidence(
  p_user_id    UUID,
  p_deck_id    UUID,
  p_card_index INTEGER,
  p_confidence SMALLINT
) RETURNS void AS $$
DECLARE
  v_next_review TIMESTAMPTZ;
BEGIN
  -- Spaced repetition intervals based on confidence:
  -- 1 = repeat in same session (10 minutes)
  -- 2 = repeat in same session (20 minutes)
  -- 3 = repeat tomorrow
  -- 4 = repeat in 3 days
  -- 5 = repeat in 7 days
  v_next_review := CASE p_confidence
    WHEN 1 THEN now() + interval '10 minutes'
    WHEN 2 THEN now() + interval '20 minutes'
    WHEN 3 THEN now() + interval '1 day'
    WHEN 4 THEN now() + interval '3 days'
    WHEN 5 THEN now() + interval '7 days'
  END;

  INSERT INTO card_confidence (user_id, deck_id, card_index, confidence, rated_at, next_review)
  VALUES (p_user_id, p_deck_id, p_card_index, p_confidence, now(), v_next_review)
  ON CONFLICT (user_id, deck_id, card_index)
  DO UPDATE SET
    confidence  = p_confidence,
    rated_at    = now(),
    next_review = v_next_review;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
