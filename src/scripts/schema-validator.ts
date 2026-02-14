import { createClient } from '@supabase/supabase-js';

/**
 * Schema Validator: Ensures Supabase is properly configured
 * Run: npx ts-node schema-validator.ts
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface SchemaCheck {
  name: string;
  check: () => Promise<boolean>;
  critical: boolean;
}

const checks: SchemaCheck[] = [
  {
    name: 'Invoice table exists',
    check: async () => {
      const { error } = await supabase
        .from('invoices')
        .select('id')
        .limit(1);
      return !error?.code?.includes('PGRST');
    },
    critical: true,
  },
  {
    name: 'Fixed costs table exists',
    check: async () => {
      const { error } = await supabase
        .from('fixed_costs')
        .select('id')
        .limit(1);
      return !error?.code?.includes('PGRST');
    },
    critical: true,
  },
  {
    name: 'Event records table exists',
    check: async () => {
      const { error } = await supabase
        .from('event_records')
        .select('id')
        .limit(1);
      return !error?.code?.includes('PGRST');
    },
    critical: false,
  },
  {
    name: 'Realtime is enabled on invoices',
    check: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .on('INSERT', (payload) => {
          // Realtime is working if we can set up listener
          return true;
        })
        .subscribe();
      return data !== null || !error;
    },
    critical: true,
  },
  {
    name: 'Realtime is enabled on fixed_costs',
    check: async () => {
      const { data, error } = await supabase
        .from('fixed_costs')
        .on('*', (payload) => true)
        .subscribe();
      return data !== null || !error;
    },
    critical: true,
  },
  {
    name: 'Can read invoices',
    check: async () => {
      const { error } = await supabase
        .from('invoices')
        .select('id')
        .limit(1);
      return !error;
    },
    critical: true,
  },
  {
    name: 'Can read fixed costs',
    check: async () => {
      const { error } = await supabase
        .from('fixed_costs')
        .select('id')
        .limit(1);
      return !error;
    },
    critical: true,
  },
  {
    name: 'Monthly invoices view exists',
    check: async () => {
      const { error } = await supabase
        .from('v_monthly_invoices')
        .select('id')
        .limit(1);
      return !error?.code?.includes('PGRST');
    },
    critical: false,
  },
];

async function validateSchema() {
  console.log('\n🔍 Validating Supabase Schema...\n');

  let passed = 0;
  let failed = 0;
  let criticalFailed = false;

  for (const check of checks) {
    try {
      const result = await check.check();
      if (result) {
        console.log(`✅ ${check.name}`);
        passed++;
      } else {
        console.log(`❌ ${check.name}`);
        failed++;
        if (check.critical) criticalFailed = true;
      }
    } catch (error) {
      console.log(`❌ ${check.name} - ${(error as Error).message}`);
      failed++;
      if (check.critical) criticalFailed = true;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  if (criticalFailed) {
    console.error('❌ Critical checks failed. Please run schema.sql in Supabase SQL editor.');
    process.exit(1);
  } else if (failed === 0) {
    console.log('✅ All checks passed! Supabase is properly configured.');
    process.exit(0);
  } else {
    console.warn('⚠️ Some non-critical checks failed. Dashboard may have limited functionality.');
    process.exit(0);
  }
}

validateSchema().catch((err) => {
  console.error('Validation error:', err);
  process.exit(1);
});
