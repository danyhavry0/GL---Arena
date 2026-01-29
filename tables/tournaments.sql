-- Tournaments table (GL-Arena)
-- Run after `users` exists.

CREATE TABLE IF NOT EXISTS public.tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  game_type text NOT NULL DEFAULT 'league_of_legends',
  format text NOT NULL DEFAULT 'single_elimination',
  max_teams integer NOT NULL,
  prize_pool numeric,
  status text NOT NULL DEFAULT 'draft',
  start_date timestamptz,
  end_date timestamptz,
  created_by uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tournaments_status_check CHECK (
    status IN ('draft', 'open_registration', 'in_progress', 'completed')
  ),
  CONSTRAINT tournaments_format_check CHECK (
    format IN ('single_elimination', 'double_elimination')
  ),
  CONSTRAINT tournaments_game_type_check CHECK (
    game_type IN ('league_of_legends')
  )
);

CREATE INDEX IF NOT EXISTS idx_tournaments_created_by ON public.tournaments(created_by);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON public.tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_start_date ON public.tournaments(start_date);

COMMENT ON TABLE public.tournaments IS 'Tournaments (official and non-official)';
