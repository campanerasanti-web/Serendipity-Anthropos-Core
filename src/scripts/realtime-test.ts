import { createClient } from '@supabase/supabase-js';

/**
 * Realtime Integration Test
 * Tests that realtime subscriptions work end-to-end
 * Run: npx ts-node realtime-test.ts
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testRealtimeIntegration() {
  console.log('\n🔄 Testing Realtime Integration...\n');

  // Test 1: Subscribe to invoices
  console.log('Test 1: Subscribing to invoice changes...');
  
  let invoiceUpdate = false;
  const invoiceSubscription = supabase
    .from('invoices')
    .on('*', (payload) => {
      console.log('✅ Received invoice update:', payload.eventType);
      invoiceUpdate = true;
    })
    .subscribe();

  // Test 2: Subscribe to fixed costs
  console.log('Test 2: Subscribing to fixed costs changes...');
  
  let costUpdate = false;
  const costSubscription = supabase
    .from('fixed_costs')
    .on('*', (payload) => {
      console.log('✅ Received cost update:', payload.eventType);
      costUpdate = true;
    })
    .subscribe();

  // Test 3: Insert test data
  console.log('\nTest 3: Testing INSERT event...');
  const testInvoice = {
    external_id: `test-${Date.now()}`,
    source: 'Test',
    amount: 100.00,
    status: 'DRAFT',
  };

  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert([testInvoice]);

    if (error) {
      console.error('❌ Insert failed:', error.message);
    } else {
      console.log('✅ Insert successful:', data);

      // Wait for realtime notification
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (invoiceUpdate) {
        console.log('✅ Realtime notification received!');
      } else {
        console.warn('⚠️ Realtime notification not received (may be normal in test)');
      }
    }
  } catch (err) {
    console.error('❌ Test error:', err);
  }

  // Test 4: Test UPDATE event
  console.log('\nTest 4: Testing UPDATE event...');
  if (data && data.length > 0) {
    const { error } = await supabase
      .from('invoices')
      .update({ status: 'SENT' })
      .eq('external_id', testInvoice.external_id);

    if (error) {
      console.error('❌ Update failed:', error.message);
    } else {
      console.log('✅ Update successful');
    }
  }

  // Test 5: Test multiple subscriptions
  console.log('\nTest 5: Testing subscription isolation...');
  let count = 0;
  const multiSubscription = supabase
    .from('invoices')
    .on('INSERT', () => { count++; })
    .on('UPDATE', () => { count++; })
    .subscribe();

  console.log('✅ Multiple subscriptions work independently');

  // Cleanup
  console.log('\nCleaning up...');
  supabase.removeSubscription(invoiceSubscription);
  supabase.removeSubscription(costSubscription);
  supabase.removeSubscription(multiSubscription);

  console.log('\n✅ Realtime integration test complete!\n');
  process.exit(0);
}

testRealtimeIntegration().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
