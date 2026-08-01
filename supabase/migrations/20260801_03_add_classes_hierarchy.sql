-- Phase 3: Class Hierarchy & Organisation
-- Applied directly to the live Supabase project on 2026-08-01 via the Supabase MCP.

CREATE TABLE classes (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  description    TEXT,
  purpose        TEXT CHECK (purpose IN (
                   'job_skills', 'foreign_languages', 'professional_certification',
                   'standardised_test', 'school_university', 'general'
                 )),
  role           TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('instructor', 'student')),
  cover_color    TEXT DEFAULT '#6366f1',
  cover_emoji    TEXT DEFAULT '📚',
  is_public      BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own classes" ON classes
  FOR ALL USING (auth.uid() = user_id);

-- Nullable so existing decks aren't broken — shown as "uncategorised" until the
-- user (or the one-time migration prompt) assigns them to a class.
ALTER TABLE decks ADD COLUMN class_id UUID REFERENCES classes(id) ON DELETE SET NULL;
CREATE INDEX idx_decks_class_id ON decks(class_id);
