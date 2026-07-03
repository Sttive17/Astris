-- ==============================================================================
-- Astris SQL Setup & Mock Data
-- Instrucciones: Ejecuta este script en el editor SQL de tu dashboard de Supabase
-- para añadir las columnas faltantes (vocation, avatar_url) e insertar 
-- datos de prueba (empresas, vacantes, candidatos) para visualizar en los dashboards.
-- ==============================================================================

-- 1. Añadir nuevas columnas a users_profiles si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users_profiles' AND column_name='vocation') THEN
        ALTER TABLE users_profiles ADD COLUMN vocation text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users_profiles' AND column_name='avatar_url') THEN
        ALTER TABLE users_profiles ADD COLUMN avatar_url text;
    END IF;
END $$;


-- ==============================================================================
-- 2. Asegurarnos que existan usuarios para los mockups
-- NOTA: Dado que supabase maneja auth.users externamente, usaremos UUIDs ficticios 
-- solo para relacionar la información visual en los dashboards.
-- ==============================================================================

-- 2. Crear los usuarios en la tabla auth.users para que las relaciones foráneas (foreign keys) funcionen
-- Utilizamos la encriptación pgcrypto para las contraseñas ficticias
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'empresa1@astris.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'empresa2@astris.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'cand1@astris.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'cand2@astris.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now())
ON CONFLICT (id) DO NOTHING;

-- 3. Deshabilitar temporalmente la ejecución de triggers en esta sesión
-- Esto evita que triggers como "prevent_unauthorized_role_changes" bloqueen la inserción
SET session_replication_role = replica;

-- Insertaremos o actualizaremos directamente en users_profiles
INSERT INTO public.users_profiles (id, email, full_name, role, completed_onboarding, vocation)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'empresa1@astris.com', 'Tech For All', 'company', true, 'Tecnología'),
  ('00000000-0000-0000-0000-000000000002', 'empresa2@astris.com', 'Global Design Inc', 'company', true, 'Diseño Gráfico'),
  ('00000000-0000-0000-0000-000000000003', 'cand1@astris.com', 'Ana Martínez', 'candidate', true, 'Desarrollo Web'),
  ('00000000-0000-0000-0000-000000000004', 'cand2@astris.com', 'Carlos Gómez', 'candidate', true, 'Diseño UI/UX')
ON CONFLICT (id) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  completed_onboarding = EXCLUDED.completed_onboarding,
  vocation = EXCLUDED.vocation;

-- Restaurar el comportamiento normal de los triggers
SET session_replication_role = DEFAULT;

-- Insertar Datos de Empresas de Prueba
INSERT INTO companies (user_id, company_name, industry, philosophy, accommodations)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Tech For All', 'Tecnología de la Información', 'Creemos en un entorno de desarrollo inclusivo, donde el talento brilla por sus habilidades lógicas.', ARRAY['Horario flexible', 'Luz cálida controlada', 'Comunicación asincrónica']),
  ('00000000-0000-0000-0000-000000000002', 'Global Design Inc', 'Diseño y Creatividad', 'Diversidad como motor de la creatividad e innovación.', ARRAY['Reducción de ruido ambiental', 'Espacios de trabajo silenciosos', 'Software adaptativo'])
ON CONFLICT (user_id) DO UPDATE SET 
  company_name = EXCLUDED.company_name,
  philosophy = EXCLUDED.philosophy;


-- Insertar Datos de Candidatos de Prueba
INSERT INTO candidates (user_id, work_preference, interests)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'remoto, comunicación escrita, tareas definidas', ARRAY['Programación', 'QA', 'Bases de datos']),
  ('00000000-0000-0000-0000-000000000004', 'híbrido, ambiente silencioso', ARRAY['Diseño', 'Investigación de usuarios', 'Accesibilidad'])
ON CONFLICT (user_id) DO NOTHING;


-- ==============================================================================
-- 3. Insertar Vacantes Sugeridas
-- ==============================================================================

-- Nota: Si la tabla jobs tiene un id SERIAL, no lo declaramos, dejamos que se genere.
INSERT INTO jobs (company_id, title, description, status, work_modality, location_text, contract_type, offered_accommodations, required_skills)
VALUES 
  (
    '00000000-0000-0000-0000-000000000001', 
    'Desarrollador Frontend Accesible', 
    'Buscamos un desarrollador React/TypeScript. La empresa prioriza la comunicación escrita por Slack y no requiere videollamadas obligatorias.', 
    'open', 
    'remote', 
    'Remoto global', 
    'Tiempo completo', 
    ARRAY['Sin videollamadas', 'Comunicación escrita asíncrona', 'Flexibilidad de horarios'],
    ARRAY['React', 'TypeScript', 'Accesibilidad web']
  ),
  (
    '00000000-0000-0000-0000-000000000001', 
    'Analista de Aseguramiento de Calidad (QA)', 
    'Trabajo enfocado en la atención al detalle para revisar pruebas automatizadas.', 
    'open', 
    'hybrid', 
    'Madrid, España', 
    'Medio tiempo', 
    ARRAY['Oficina silenciosa', 'Auriculares de cancelación de ruido provistos', 'Horarios flexibles'],
    ARRAY['Pruebas automatizadas', 'Atención al detalle', 'Reporte de bugs']
  ),
  (
    '00000000-0000-0000-0000-000000000002', 
    'Diseñador UX/UI Especialista en Inclusión', 
    'Se parte de nuestro equipo de diseño creando interfaces amigables para todo espectro neurodivergente.', 
    'open', 
    'remote', 
    'Remoto', 
    'Freelance', 
    ARRAY['Mentoría uno a uno', 'Instrucciones por escrito claras y estructuradas'],
    ARRAY['Figma', 'Investigación UX', 'Empatía visual']
  );

-- ¡Todo listo! Los dashboards ya no estarán vacíos.
