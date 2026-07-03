-- ==============================================================================
-- Astris SQL Setup - Test Accounts
-- Instrucciones: Ejecuta este script en el editor SQL de tu dashboard de Supabase
-- para crear las cuentas de prueba solicitadas.
-- Contraseña para todas las cuentas: Astris2026
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Deshabilitar temporalmente la ejecución de triggers en esta sesión
SET session_replication_role = replica;

-- 2. Insertar en auth.users
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'admin@astris.org', crypt('Astris2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'candidato@astris.org', crypt('Astris2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'empresa@astris.org', crypt('Astris2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'mentor@astris.org', crypt('Astris2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now())
ON CONFLICT (id) DO NOTHING;

-- 3. Insertar en users_profiles
INSERT INTO public.users_profiles (id, email, full_name, role, completed_onboarding, vocation)
VALUES 
  ('10000000-0000-0000-0000-000000000001', 'admin@astris.org', 'Administrador Prueba', 'admin', true, 'Administración'),
  ('10000000-0000-0000-0000-000000000002', 'candidato@astris.org', 'Candidato Prueba', 'candidate', true, 'Pruebas QA'),
  ('10000000-0000-0000-0000-000000000003', 'empresa@astris.org', 'Empresa Prueba SA', 'company', true, 'Tecnología'),
  ('10000000-0000-0000-0000-000000000004', 'mentor@astris.org', 'Mentor Prueba', 'mentor', true, 'Coaching')
ON CONFLICT (id) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  completed_onboarding = EXCLUDED.completed_onboarding,
  vocation = EXCLUDED.vocation;

-- 4. Insertar datos complementarios para que no crasheen los dashboards
-- Empresa
INSERT INTO companies (user_id, company_name, industry, philosophy, accommodations)
VALUES 
  ('10000000-0000-0000-0000-000000000003', 'Empresa Prueba SA', 'Pruebas y QA', 'Creemos en la innovación constante y el testeo.', ARRAY['Trabajo Remoto'])
ON CONFLICT (user_id) DO NOTHING;

-- Candidato
INSERT INTO candidates (user_id, work_preference, interests, accessibility_theme, accessibility_font)
VALUES 
  ('10000000-0000-0000-0000-000000000002', 'remoto, tareas estructuradas', ARRAY['Pruebas', 'Control de Calidad'], 'light', 'sans')
ON CONFLICT (user_id) DO NOTHING;

-- Mentor
INSERT INTO mentors (user_id)
VALUES 
  ('10000000-0000-0000-0000-000000000004')
ON CONFLICT (user_id) DO NOTHING;

-- Restaurar el comportamiento normal de los triggers
SET session_replication_role = DEFAULT;
