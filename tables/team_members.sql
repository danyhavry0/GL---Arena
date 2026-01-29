-- Team members (roster per tournament team)
-- Run after `tournament_teams` and `users` exist.

CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.tournament_teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  role text NOT NULL DEFAULT 'player',
  riot_summoner_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT team_members_role_check CHECK (
    role IN ('captain', 'player', 'substitute')
  ),
  CONSTRAINT team_members_team_user_unique UNIQUE (team_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);

COMMENT ON TABLE public.team_members IS 'Team roster (5v5 LoL) per tournament team';
