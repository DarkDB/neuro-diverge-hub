
-- Drop the overly permissive policy
DROP POLICY "Service role can manage purchases" ON public.resource_purchases;

-- Only allow inserts - the edge function uses service_role which bypasses RLS anyway
-- For regular users, they can only view their own purchases (already handled)
