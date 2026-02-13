import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Leer .env de la raíz del proyecto
const envPath = new URL('../.env', import.meta.url);
let envRaw = '';
try {
  envRaw = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.error('.env no encontrado en la raíz del proyecto:', e.message);
  process.exit(2);
}

const entries = envRaw
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))
  .map((l) => l.split('='))
  .reduce((acc, [k, ...rest]) => {
    acc[k] = rest.join('=').trim();
    return acc;
  }, {});

const url = entries.VITE_SUPABASE_URL || '';
const key = entries.VITE_SUPABASE_ANON_KEY || '';

if (!url || !key) {
  console.error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env');
  process.exit(2);
}

const supabase = createClient(url, key);

(async () => {
  try {
    // Prueba sencilla: intenta seleccionar 1 fila de una tabla conocida ('invoices')
    const { data, error } = await supabase.from('invoices').select('id').limit(1);
    if (error) {
      console.error('Conexión fallida. Error devuelto por Supabase:');
      console.error(error);
      process.exit(1);
    }
    console.log('Conexión exitosa a Supabase. Filas de ejemplo retornadas:', data?.length ?? 0);
    process.exit(0);
  } catch (e) {
    console.error('Error al intentar conectar a Supabase:', e);
    process.exit(1);
  }
})();
