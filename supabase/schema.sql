-- ============================================
-- Vouchy Database Schema (Consolidated)
-- Last updated: 2026-02-28
--
-- Apply this ONCE to a fresh Supabase project.
-- It is idempotent (uses IF NOT EXISTS / ON CONFLICT).
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

-- Owners can read/update their own profile
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can view their own profile"
      ON public.profiles FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can insert their own profile"
      ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can update their own profile"
      ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Public read for collection page branding (no sensitive data in profiles)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view profiles for branding' AND tablename = 'profiles') THEN
    CREATE POLICY "Anyone can view profiles for branding"
      ON public.profiles FOR SELECT USING (true);
  END IF;
END $$;

-- Auto-update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
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

-- Drop + recreate to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
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

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own spaces' AND tablename = 'spaces') THEN
    CREATE POLICY "Users can view their own spaces"
      ON public.spaces FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view active spaces by slug' AND tablename = 'spaces') THEN
    CREATE POLICY "Anyone can view active spaces by slug"
      ON public.spaces FOR SELECT USING (is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own spaces' AND tablename = 'spaces') THEN
    CREATE POLICY "Users can create their own spaces"
      ON public.spaces FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own spaces' AND tablename = 'spaces') THEN
    CREATE POLICY "Users can update their own spaces"
      ON public.spaces FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own spaces' AND tablename = 'spaces') THEN
    CREATE POLICY "Users can delete their own spaces"
      ON public.spaces FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_spaces_updated_at ON public.spaces;
CREATE TRIGGER update_spaces_updated_at
  BEFORE UPDATE ON public.spaces
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_spaces_user_id ON public.spaces(user_id);
CREATE INDEX IF NOT EXISTS idx_spaces_slug ON public.spaces(slug);

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
  author_avatar_url TEXT,
  extra_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Space owners can view testimonials' AND tablename = 'testimonials') THEN
    CREATE POLICY "Space owners can view testimonials"
      ON public.testimonials FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Space owners can update testimonials' AND tablename = 'testimonials') THEN
    CREATE POLICY "Space owners can update testimonials"
      ON public.testimonials FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Space owners can delete testimonials' AND tablename = 'testimonials') THEN
    CREATE POLICY "Space owners can delete testimonials"
      ON public.testimonials FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Anyone can submit testimonials (public collection page)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can submit testimonials' AND tablename = 'testimonials') THEN
    CREATE POLICY "Anyone can submit testimonials"
      ON public.testimonials FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_testimonials_space_id ON public.testimonials(space_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_user_id ON public.testimonials(user_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON public.testimonials(status);

-- =====================
-- 6. STORAGE BUCKETS
-- =====================

-- Logos bucket (public)
INSERT INTO storage.buckets (id, name, public)
  VALUES ('logos', 'logos', true)
  ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Logo images are publicly accessible' AND tablename = 'objects') THEN
    CREATE POLICY "Logo images are publicly accessible"
      ON storage.objects FOR SELECT USING (bucket_id = 'logos');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload their own logo' AND tablename = 'objects') THEN
    CREATE POLICY "Users can upload their own logo"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own logo' AND tablename = 'objects') THEN
    CREATE POLICY "Users can update their own logo"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

-- Videos bucket (public)
INSERT INTO storage.buckets (id, name, public)
  VALUES ('videos', 'videos', true)
  ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Video files are publicly accessible' AND tablename = 'objects') THEN
    CREATE POLICY "Video files are publicly accessible"
      ON storage.objects FOR SELECT USING (bucket_id = 'videos');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can upload videos' AND tablename = 'objects') THEN
    CREATE POLICY "Anyone can upload videos"
      ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can delete videos' AND tablename = 'objects') THEN
    CREATE POLICY "Authenticated users can delete videos"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;
