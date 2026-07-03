-- Función para eliminar la cuenta del usuario actual
-- 1. Elimina el perfil público del usuario (si hay dependencias, cascada debe estar configurado en la base de datos o manejado aquí)
-- 2. Elimina el usuario de auth.users (Supabase permite esto mediante RPC con SECURITY DEFINER)

CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Eliminar de auth.users. 
  -- Al estar en cascada, esto también eliminaría users_profiles si está configurado así.
  -- Usamos auth.uid() para garantizar que el usuario solo pueda borrarse a sí mismo.
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
