import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Leer credenciales desde Vite env (import.meta.env). Usar variables prefijadas con VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'TU_URL_DE_SUPABASE';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'TU_LLAVE_ANON_DE_SUPABASE';

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('TU_URL')) {
  // Aviso en consola para facilitar debugging en desarrollo
  // No muestro claves en claro, solo aviso si faltan
  // eslint-disable-next-line no-console
  console.warn('Supabase: falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el entorno. Rellenar .env en la raíz del proyecto.');
}

export const supabase: SupabaseClient = createClient(String(supabaseUrl), String(supabaseKey));

// Alias para compatibilidad con diferentes nombres
export const supabaseClient = supabase;

export default supabase;
