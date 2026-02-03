-- =============================================================================
-- GL-ARENA RLS POLICIES FOR READ ACCESS
-- Run this in Supabase SQL Editor if you get empty results when fetching data.
-- These policies allow authenticated users to read tournament/team/match data.
-- =============================================================================

-- Enable RLS on tables (if not already)
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Tournaments: anyone can read
DROP POLICY IF EXISTS "Allow read tournaments" ON public.tournaments;
CREATE POLICY "Allow read tournaments" ON public.tournaments
  FOR SELECT USING (true);

-- Tournament teams: anyone can read
DROP POLICY IF EXISTS "Allow read tournament_teams" ON public.tournament_teams;
CREATE POLICY "Allow read tournament_teams" ON public.tournament_teams
  FOR SELECT USING (true);

-- Team members: anyone can read
DROP POLICY IF EXISTS "Allow read team_members" ON public.team_members;
CREATE POLICY "Allow read team_members" ON public.team_members
  FOR SELECT USING (true);

-- Matches: anyone can read
DROP POLICY IF EXISTS "Allow read matches" ON public.matches;
CREATE POLICY "Allow read matches" ON public.matches
  FOR SELECT USING (true);

-- Users: allow read for authenticated (for captain names, etc.)
DROP POLICY IF EXISTS "Allow read users public" ON public.users;
CREATE POLICY "Allow read users public" ON public.users
  FOR SELECT USING (true);
