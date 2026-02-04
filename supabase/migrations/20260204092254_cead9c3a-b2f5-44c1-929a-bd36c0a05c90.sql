-- Change category from text to text array to allow multiple categories
ALTER TABLE public.articles 
ALTER COLUMN category TYPE text[] 
USING ARRAY[category];

-- Update default value
ALTER TABLE public.articles 
ALTER COLUMN category SET DEFAULT ARRAY['General']::text[];