-- SOLUCIÓN AL LOOP INFINITO DE RLS

-- 1. Primero, creamos una función "SECURITY DEFINER" (Bypassa el RLS internamente)
-- Esto nos permite leer el rol del usuario sin disparar la política en bucle infinito.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.users_profiles WHERE id = auth.uid();
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ahora, actualizamos TODAS las políticas para usar esta función segura:

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users_profiles;
CREATE POLICY "Admins can view all profiles"
ON public.users_profiles FOR ALL USING ( public.is_admin() );

DROP POLICY IF EXISTS "Admins can view all candidates" ON public.candidates;
CREATE POLICY "Admins can view all candidates"
ON public.candidates FOR ALL USING ( public.is_admin() );

DROP POLICY IF EXISTS "Admins can view all companies" ON public.companies;
CREATE POLICY "Admins can view all companies"
ON public.companies FOR ALL USING ( public.is_admin() );

DROP POLICY IF EXISTS "Admins can view all jobs" ON public.jobs;
CREATE POLICY "Admins can view all jobs"
ON public.jobs FOR ALL USING ( public.is_admin() );

DROP POLICY IF EXISTS "Admins can view all mentors" ON public.mentors;
CREATE POLICY "Admins can view all mentors"
ON public.mentors FOR ALL USING ( public.is_admin() );

DROP POLICY IF EXISTS "Admins can manage logs" ON public.admin_logs;
CREATE POLICY "Admins can manage logs"
ON public.admin_logs FOR ALL USING ( public.is_admin() );
