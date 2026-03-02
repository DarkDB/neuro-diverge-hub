
-- Add pricing fields to downloadable_resources
ALTER TABLE public.downloadable_resources
  ADD COLUMN is_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN price_cents integer DEFAULT NULL,
  ADD COLUMN stripe_price_id text DEFAULT NULL;

-- Create resource_purchases table to track purchases (supports guest purchases via email)
CREATE TABLE public.resource_purchases (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id uuid NOT NULL REFERENCES public.downloadable_resources(id) ON DELETE CASCADE,
  user_id uuid DEFAULT NULL,
  email text NOT NULL,
  stripe_checkout_session_id text,
  purchased_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resource_purchases ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (edge function uses service role, but we allow insert for flexibility)
CREATE POLICY "Service role can manage purchases"
ON public.resource_purchases
FOR ALL
USING (true)
WITH CHECK (true);

-- Users can view their own purchases
CREATE POLICY "Users can view own purchases"
ON public.resource_purchases
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all purchases
CREATE POLICY "Admins can view all purchases"
ON public.resource_purchases
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));
