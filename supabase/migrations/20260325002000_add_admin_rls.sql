CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(is_admin, false)
  FROM public.profiles
  WHERE user_id = auth.uid();
$$;

-- View access
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can view all spaces" ON spaces FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can view all testimonials" ON testimonials FOR SELECT USING (public.is_admin());

-- Update access
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can update all spaces" ON spaces FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can update all testimonials" ON testimonials FOR UPDATE USING (public.is_admin());

-- Delete access
CREATE POLICY "Admins can delete all profiles" ON profiles FOR DELETE USING (public.is_admin());
CREATE POLICY "Admins can delete all spaces" ON spaces FOR DELETE USING (public.is_admin());
CREATE POLICY "Admins can delete all testimonials" ON testimonials FOR DELETE USING (public.is_admin());
