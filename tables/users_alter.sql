-- Add new columns to existing `users` table (GL-Arena schema)
-- Run this in Supabase SQL Editor after `users` exists.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS reputation_score numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_certified_referee boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS riot_summoner_name text,
  ADD COLUMN IF NOT EXISTS riot_puuid text;

COMMENT ON COLUMN public.users.reputation_score IS 'User reputation score for tournaments and behavior';
COMMENT ON COLUMN public.users.is_certified_referee IS 'Whether user is a certified GL-Arena referee';
COMMENT ON COLUMN public.users.riot_summoner_name IS 'League of Legends summoner name (from Riot link)';
COMMENT ON COLUMN public.users.riot_puuid IS 'Riot PUUID for Match-v5 API and validation';
