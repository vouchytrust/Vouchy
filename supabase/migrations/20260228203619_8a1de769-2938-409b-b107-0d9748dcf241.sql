
-- Spaces table
CREATE TABLE public.spaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  form_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own spaces" ON public.spaces FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own spaces" ON public.spaces FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own spaces" ON public.spaces FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own spaces" ON public.spaces FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_spaces_updated_at
  BEFORE UPDATE ON public.spaces
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_spaces_user_id ON public.spaces(user_id);
CREATE INDEX idx_spaces_slug ON public.spaces(slug);

-- Testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  author_company TEXT,
  author_title TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'video')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  video_url TEXT,
  video_duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Space owners can manage their testimonials
CREATE POLICY "Space owners can view testimonials" ON public.testimonials FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Space owners can update testimonials" ON public.testimonials FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Space owners can delete testimonials" ON public.testimonials FOR DELETE
  USING (auth.uid() = user_id);

-- Public can submit testimonials (insert) - no auth required
CREATE POLICY "Anyone can submit testimonials" ON public.testimonials FOR INSERT
  WITH CHECK (true);

-- Public can read space info for the collection page
CREATE POLICY "Anyone can view active spaces by slug" ON public.spaces FOR SELECT
  USING (is_active = true);

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_testimonials_space_id ON public.testimonials(space_id);
CREATE INDEX idx_testimonials_user_id ON public.testimonials(user_id);
CREATE INDEX idx_testimonials_status ON public.testimonials(status);
