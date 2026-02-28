-- ============================================
-- Vouchy Database Schema (Consolidated)
-- Last updated: 2026-02-28
-- ============================================

-- =====================
-- 1. UTILITY FUNCTIONS
-- =====================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =====================
-- 2. PROFILES TABLE
-- =====================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  brand_color TEXT DEFAULT '#3b82f6',
  logo_url TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- 3. AUTH TRIGGER
-- =====================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- 4. SPACES TABLE
-- =====================

CREATE TABLE IF NOT EXISTS public.spaces (
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

CREATE POLICY "Users can view their own spaces"
  ON public.spaces FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view active spaces by slug"
  ON public.spaces FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create their own spaces"
  ON public.spaces FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own spaces"
  ON public.spaces FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own spaces"
  ON public.spaces FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_spaces_updated_at
  BEFORE UPDATE ON public.spaces
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_spaces_user_id ON public.spaces(user_id);
CREATE INDEX idx_spaces_slug ON public.spaces(slug);

-- =====================
-- 5. TESTIMONIALS TABLE
-- =====================

CREATE TABLE IF NOT EXISTS public.testimonials (
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

CREATE POLICY "Space owners can view testimonials"
  ON public.testimonials FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Space owners can update testimonials"
  ON public.testimonials FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Space owners can delete testimonials"
  ON public.testimonials FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can submit testimonials"
  ON public.testimonials FOR INSERT WITH CHECK (true);

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_testimonials_space_id ON public.testimonials(space_id);
CREATE INDEX idx_testimonials_user_id ON public.testimonials(user_id);
CREATE INDEX idx_testimonials_status ON public.testimonials(status);

-- =====================
-- 6. STORAGE
-- =====================

INSERT INTO storage.buckets (id, name, public)
  VALUES ('logos', 'logos', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Logo images are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Users can upload their own logo"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own logo"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);
