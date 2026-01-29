-- Riot API keys (server-side usage for Match-v5, etc.)
-- No FK; store encrypted or hashed keys per your security policy.

CREATE TABLE IF NOT EXISTS public.riot_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name text NOT NULL,
  api_key text NOT NULL,
  region text NOT NULL,
  rate_limit_remaining integer,
  last_used timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT riot_api_keys_region_check CHECK (
    region IN ('euw', 'na', 'eune', 'kr', 'br', 'lan', 'las', 'oce', 'ru', 'tr', 'jp')
  )
);

CREATE INDEX IF NOT EXISTS idx_riot_api_keys_region ON public.riot_api_keys(region);
CREATE INDEX IF NOT EXISTS idx_riot_api_keys_is_active ON public.riot_api_keys(is_active) WHERE is_active = true;

COMMENT ON TABLE public.riot_api_keys IS 'Riot API keys for Match-v5 and validation; encrypt at rest per env';
