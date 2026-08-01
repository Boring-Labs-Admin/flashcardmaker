-- Phase 2: Mastery, Progress & Gamification — streak/daily stats tracking
-- Applied directly to the live Supabase project on 2026-08-01 via the Supabase MCP.

CREATE TABLE user_stats (
  user_id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak     INTEGER NOT NULL DEFAULT 0,
  longest_streak     INTEGER NOT NULL DEFAULT 0,
  last_studied_date  DATE,
  total_days_studied INTEGER NOT NULL DEFAULT 0,
  total_points       INTEGER NOT NULL DEFAULT 0,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own stats" ON user_stats
  FOR ALL USING (auth.uid() = user_id);

-- Deviates from the Phase 2 doc's version: uses an explicit SELECT ... FOUND check
-- instead of an INSERT ... ON CONFLICT DO UPDATE SET updated_at = now() RETURNING trick,
-- and adds a p_points param so total_points can accrue in the same call.
CREATE OR REPLACE FUNCTION update_study_streak(p_user_id UUID, p_points INTEGER DEFAULT 0)
RETURNS void AS $$
DECLARE
  v_last_date DATE;
  v_today     DATE := CURRENT_DATE;
  v_exists    BOOLEAN;
BEGIN
  SELECT true, last_studied_date INTO v_exists, v_last_date
  FROM user_stats WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    INSERT INTO user_stats (user_id, current_streak, longest_streak, last_studied_date, total_days_studied, total_points)
    VALUES (p_user_id, 1, 1, v_today, 1, p_points);
    RETURN;
  END IF;

  IF v_last_date = v_today THEN
    -- Already studied today — just add points, no streak/day change
    UPDATE user_stats
    SET total_points = total_points + p_points,
        updated_at   = now()
    WHERE user_id = p_user_id;
  ELSIF v_last_date = v_today - 1 THEN
    UPDATE user_stats
    SET current_streak      = current_streak + 1,
        longest_streak      = GREATEST(longest_streak, current_streak + 1),
        last_studied_date   = v_today,
        total_days_studied  = total_days_studied + 1,
        total_points        = total_points + p_points,
        updated_at          = now()
    WHERE user_id = p_user_id;
  ELSE
    UPDATE user_stats
    SET current_streak      = 1,
        last_studied_date   = v_today,
        total_days_studied  = total_days_studied + 1,
        total_points        = total_points + p_points,
        updated_at          = now()
    WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
