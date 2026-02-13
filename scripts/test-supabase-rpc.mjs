import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

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
    const { data, error } = await supabase.rpc('get_unified_dashboard', { p_month: 2, p_year: 2026 });
    if (error) {
      console.error('RPC fallida. Error devuelto por Supabase:');
      console.error(error);
      process.exit(1);
    }
    console.log('RPC exitosa. Datos recibidos:', Array.isArray(data) ? data.length : typeof data);
    process.exit(0);
  } catch (e) {
    console.error('Error al ejecutar RPC:', e);
    process.exit(1);
  }
})();
