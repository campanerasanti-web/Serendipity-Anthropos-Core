import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envPath = new URL('../.env', import.meta.url);
const envRaw = fs.readFileSync(envPath, 'utf8');
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
    const { data, error } = await supabase.from('daily_metrics').select('*').limit(5);
    if (error) {
      console.error('Consulta fallida. Error devuelto por Supabase:');
      console.error(error);
      process.exit(1);
    }
    console.log('Consulta exitosa. Filas retornadas:', data?.length ?? 0);
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('Error en consulta:', e);
    process.exit(1);
  }
})();
