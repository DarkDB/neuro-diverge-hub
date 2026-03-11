
CREATE TABLE public.product_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_key text NOT NULL UNIQUE,
  product_name text NOT NULL,
  description text,
  price_cents integer NOT NULL DEFAULT 0,
  is_free boolean NOT NULL DEFAULT false,
  stripe_price_id text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_pricing ENABLE ROW LEVEL SECURITY;

-- Anyone can read active pricing
CREATE POLICY "Anyone can view active pricing"
ON public.product_pricing
FOR SELECT
TO public
USING (is_active = true);

-- Admins can manage pricing
CREATE POLICY "Admins can manage pricing"
ON public.product_pricing
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default products
INSERT INTO public.product_pricing (product_key, product_name, description, price_cents, is_free, stripe_price_id)
VALUES 
  ('screening', 'Análisis completo cuestionario', 'Análisis detallado del cuestionario de autodescubrimiento', 499, false, 'price_1Ss5fZ2HU8ke0Kv1ErMiub9B'),
  ('test_premium', 'Análisis premium test', 'Análisis premium detallado de cada test individual', 99, false, 'price_1Ss5g82HU8ke0Kv1aB1zvLLz');
