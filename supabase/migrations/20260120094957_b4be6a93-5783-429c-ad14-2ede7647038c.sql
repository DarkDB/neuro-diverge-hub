-- Create storage bucket for downloadable resources
INSERT INTO storage.buckets (id, name, public)
VALUES ('recursos', 'recursos', true)
ON CONFLICT (id) DO NOTHING;

-- Create table to manage downloadable resources metadata
CREATE TABLE public.downloadable_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size_bytes INTEGER,
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  neurodivergence_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.downloadable_resources ENABLE ROW LEVEL SECURITY;

-- Public read access for active resources
CREATE POLICY "Anyone can view active resources"
ON public.downloadable_resources
FOR SELECT
USING (is_active = true);

-- Admin-only write access
CREATE POLICY "Admins can manage resources"
ON public.downloadable_resources
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Storage policies for public read access
CREATE POLICY "Public can read recursos bucket"
ON storage.objects
FOR SELECT
USING (bucket_id = 'recursos');

-- Admin upload policy
CREATE POLICY "Admins can upload to recursos bucket"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'recursos' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Admin delete policy
CREATE POLICY "Admins can delete from recursos bucket"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'recursos' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_downloadable_resources_updated_at
BEFORE UPDATE ON public.downloadable_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();