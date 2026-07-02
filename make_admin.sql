-- Convierte a tu usuario en Administrador Real
UPDATE public.users_profiles 
SET role = 'admin' 
WHERE email = 'johansttivelinaresb@gmail.com';
