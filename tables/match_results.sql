-- Match results (validation and proof)
-- Run after `matches` and `users` exist.

CREATE TABLE IF NOT EXISTS public.match_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  validation_method text NOT NULL,
  riot_match_data jsonb,
  screenshot_urls text[],
  validated_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  validation_status text NOT NULL DEFAULT 'pending',
  validation_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT match_results_validation_method_check CHECK (
    validation_method IN ('riot_api', 'screenshot', 'manual')
  ),
  CONSTRAINT match_results_validation_status_check CHECK (
    validation_status IN ('pending', 'approved', 'rejected', 'disputed')
  )
);

CREATE INDEX IF NOT EXISTS idx_match_results_match_id ON public.match_results(match_id);
CREATE INDEX IF NOT EXISTS idx_match_results_validated_by ON public.match_results(validated_by);
CREATE INDEX IF NOT EXISTS idx_match_results_validation_status ON public.match_results(validation_status);

COMMENT ON TABLE public.match_results IS 'Match result validation (Riot API, screenshot fallback, or manual)';
