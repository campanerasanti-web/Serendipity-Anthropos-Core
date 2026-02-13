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
    // Upsert fixed_costs
    const fixed = [
      { month: 2, year: 2026, payroll: 12000, rent: 3000, evn: 400, other_costs: 200 },
      { month: 1, year: 2026, payroll: 10000, rent: 2500, evn: 300, other_costs: 150 },
    ];
    for (const f of fixed) {
      const { error } = await supabase.from('fixed_costs').upsert(f, { onConflict: 'month,year' });
      if (error) throw error;
    }

    // Insert invoices
    const invoices = [
      { invoice_number: 'INV-2026-001', description: 'Venta prueba A', total_amount: 1500.0, created_at: '2026-02-05T10:00:00Z' },
      { invoice_number: 'INV-2026-002', description: 'Venta prueba B', total_amount: 2750.5, created_at: '2026-02-08T14:30:00Z' },
      { invoice_number: 'INV-2026-003', description: 'Venta prueba C', total_amount: 499.99, created_at: '2026-02-11T09:15:00Z' },
    ];
    const { error: insErr } = await supabase.from('invoices').insert(invoices);
    if (insErr) throw insErr;

    console.log('Seed insertions successful.');
    process.exit(0);
  } catch (e) {
    console.error('Seed failed:', e);
    process.exit(1);
  }
})();
