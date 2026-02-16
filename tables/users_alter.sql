-- Add new columns to existing `users` table (GL-Arena schema)
-- Run this in Supabase SQL Editor after `users` exists.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS reputation_score numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_certified_referee boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS riot_summoner_name text,
  ADD COLUMN IF NOT EXISTS riot_puuid text,
  -- Email usata per la verifica Riot via codice
  ADD COLUMN IF NOT EXISTS riot_email text,
  -- Hash del codice di verifica inviato via email (bcrypt)
  ADD COLUMN IF NOT EXISTS riot_verification_code_hash text,
  -- Scadenza del codice di verifica
  ADD COLUMN IF NOT EXISTS riot_verification_code_expiry timestamptz,
  -- Flag che indica se l'email Riot è stata verificata con successo
  ADD COLUMN IF NOT EXISTS riot_verified boolean DEFAULT false;

COMMENT ON COLUMN public.users.reputation_score IS 'User reputation score for tournaments and behavior';
COMMENT ON COLUMN public.users.is_certified_referee IS 'Whether user is a certified GL-Arena referee';
COMMENT ON COLUMN public.users.riot_summoner_name IS 'League of Legends summoner name (from Riot link or email verification flow)';
COMMENT ON COLUMN public.users.riot_puuid IS 'Riot PUUID for Match-v5 API and validation';
COMMENT ON COLUMN public.users.riot_email IS 'Email dichiarata dallutente per laccount Riot (verificata via codice)';
COMMENT ON COLUMN public.users.riot_verification_code_hash IS 'Bcrypt hash of the latest Riot verification code sent via email';
COMMENT ON COLUMN public.users.riot_verification_code_expiry IS 'Expiration timestamp for the Riot email verification code';
COMMENT ON COLUMN public.users.riot_verified IS 'Whether the user Riot email / summoner association has been verified via code';
