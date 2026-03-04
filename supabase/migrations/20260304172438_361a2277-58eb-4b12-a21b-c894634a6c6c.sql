
-- Table to track test completions
CREATE TABLE public.test_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id text NOT NULL,
  test_name text NOT NULL,
  puntuacion integer,
  max_puntuacion integer,
  banda text,
  completed_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Allow anyone to insert (no auth required for tracking)
ALTER TABLE public.test_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert test completions"
  ON public.test_completions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view test completions"
  ON public.test_completions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to increment download count
CREATE OR REPLACE FUNCTION public.increment_download_count(resource_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.downloadable_resources
  SET download_count = COALESCE(download_count, 0) + 1
  WHERE id = resource_id;
$$;
