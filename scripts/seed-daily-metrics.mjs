import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const round2 = (value) => Math.round(value * 100) / 100;

(async () => {
  try {
    const dailyData = [];
    const today = new Date();

    for (let i = 30; i >= 0; i -= 1) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const revenueToday = Math.random() * 5000 + 1000;
      const costsToday = Math.random() * 2000 + 500;
      const netFlow = revenueToday - costsToday;
      const pace = netFlow > 0 ? 1 : netFlow < -500 ? -1 : 0;

      dailyData.push({
        date: dateStr,
        revenue_today: round2(revenueToday),
        costs_today: round2(costsToday),
        net_flow_today: round2(netFlow),
        pace_vs_breakeven: pace,
        days_to_crisis: null,
        confidence_score: round2(Math.random() * 0.3 + 0.7),
        narrative: `Dia ${i === 0 ? 'actual' : 'anterior'}: flujo ${pace > 0 ? 'positivo' : 'neutral'}.`,
        emoji: pace > 0 ? '✨' : pace < 0 ? '⚠️' : '🤔',
      });
    }

    const { error } = await supabase
      .from('daily_metrics')
      .upsert(dailyData, { onConflict: 'date' });

    if (error) throw error;

    console.log(`Seeded ${dailyData.length} days of daily metrics.`);
  } catch (err) {
    console.error('Seed error:', err.message || err);
    process.exit(1);
  }
})();
