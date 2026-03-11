
-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all screening sessions
CREATE POLICY "Admins can view all sessions"
ON public.screening_sessions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
