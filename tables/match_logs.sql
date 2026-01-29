-- Match audit log (every match action)
-- Run after `matches` and `users` exist.

CREATE TABLE IF NOT EXISTS public.match_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  action text NOT NULL,
  performed_by uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT match_logs_action_check CHECK (
    action IN ('created', 'started', 'result_submitted', 'validated', 'disputed')
  )
);

CREATE INDEX IF NOT EXISTS idx_match_logs_match_id ON public.match_logs(match_id);
CREATE INDEX IF NOT EXISTS idx_match_logs_performed_by ON public.match_logs(performed_by);
CREATE INDEX IF NOT EXISTS idx_match_logs_created_at ON public.match_logs(created_at);

COMMENT ON TABLE public.match_logs IS 'Audit log for each match action and referee decision';
