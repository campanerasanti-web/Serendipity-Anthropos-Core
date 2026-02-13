import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envPath = new URL('../.env', import.meta.url);
let envRaw = '';
try { envRaw = fs.readFileSync(envPath, 'utf8'); } catch (e) { console.error('.env not found'); process.exit(2); }
const entries = envRaw.split(/\r?\n/).map(l=>l.trim()).filter(l=>l && !l.startsWith('#')).map(l=>l.split('=')).reduce((a,[k,...r])=>{a[k]=r.join('=');return a;},{ });
const url = entries.VITE_SUPABASE_URL || '';
const key = entries.VITE_SUPABASE_ANON_KEY || '';
if(!url||!key){ console.error('Missing env vars'); process.exit(2); }
const supabase = createClient(url, key);
(async()=>{
  try{
    const { data, error } = await supabase.rpc('get_unified_dashboard', { p_month: 2, p_year: 2026 });
    if(error){ console.error('RPC error:', error); process.exit(1); }
    console.log('RPC success. Data:');
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
  }catch(e){ console.error('RPC exception', e); process.exit(1); }
})();
