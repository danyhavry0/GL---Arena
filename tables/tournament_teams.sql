-- Tournament teams (per-tournament; not persistent across tournaments)
-- Run after `tournaments` and `users` exist.

CREATE TABLE IF NOT EXISTS public.tournament_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  name text NOT NULL,
  captain_id uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  seed integer,
  status text NOT NULL DEFAULT 'registered',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tournament_teams_status_check CHECK (
    status IN ('registered', 'active', 'eliminated', 'winner')
  )
);

CREATE INDEX IF NOT EXISTS idx_tournament_teams_tournament_id ON public.tournament_teams(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_teams_captain_id ON public.tournament_teams(captain_id);
CREATE INDEX IF NOT EXISTS idx_tournament_teams_status ON public.tournament_teams(status);

COMMENT ON TABLE public.tournament_teams IS 'Teams created for each tournament';
