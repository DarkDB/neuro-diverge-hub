
-- Add user_id to test_completions (nullable to preserve existing anonymous data)
ALTER TABLE public.test_completions ADD COLUMN user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- RLS policy: users can view their own test completions
CREATE POLICY "Users can view their own test completions"
ON public.test_completions FOR SELECT TO authenticated
USING (auth.uid() = user_id);
