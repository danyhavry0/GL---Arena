-- User reputation (behavior and history)
-- Run after `users` exists.

CREATE TABLE IF NOT EXISTS public.user_reputation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  score numeric NOT NULL DEFAULT 0,
  positive_events integer NOT NULL DEFAULT 0,
  negative_events integer NOT NULL DEFAULT 0,
  last_updated timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_reputation_user_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_reputation_user_id ON public.user_reputation(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reputation_score ON public.user_reputation(score);

COMMENT ON TABLE public.user_reputation IS 'Reputation tracking for anti-smurfing and behavior';
