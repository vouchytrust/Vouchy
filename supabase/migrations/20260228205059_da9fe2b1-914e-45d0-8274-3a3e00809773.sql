
-- Allow public read of profiles for collection page branding
CREATE POLICY "Anyone can view profiles for branding"
ON public.profiles FOR SELECT
USING (true);
