/**
 * Cliente de Supabase para scripts Node.js
 * Usa process.env en lugar de import.meta.env (que solo funciona en Vite)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Cargar .env desde la raíz del proyecto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '..', '..', '.env');

dotenv.config({ path: envPath });

// Leer credenciales desde process.env (scripts Node.js)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('TU_URL')) {
  console.warn('⚠️ Supabase: falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env');
  console.warn('   El Jardinero funcionará en modo simulado.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export { supabaseUrl, supabaseKey };
