import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(
      JSON.stringify({ error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" }),
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const now = new Date();
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select("total_amount, created_at")
    .gte("created_at", since.toISOString());

  if (invoicesError) {
    return new Response(JSON.stringify({ error: invoicesError.message }), { status: 500 });
  }

  const revenue24h = (invoices ?? []).reduce((sum, row) => {
    const amount = Number(row?.total_amount || 0);
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  const { data: fixedCosts, error: fixedError } = await supabase
    .from("fixed_costs")
    .select("payroll, rent, evn, other_costs")
    .eq("month", month)
    .eq("year", year)
    .single();

  if (fixedError && fixedError.code !== "PGRST116") {
    return new Response(JSON.stringify({ error: fixedError.message }), { status: 500 });
  }

  const totalFixed =
    Number(fixedCosts?.payroll || 0) +
    Number(fixedCosts?.rent || 0) +
    Number(fixedCosts?.evn || 0) +
    Number(fixedCosts?.other_costs || 0);

  const daysInMonth = new Date(year, month, 0).getDate();
  const fixedDaily = daysInMonth > 0 ? totalFixed / daysInMonth : 0;
  const netFlow = revenue24h - fixedDaily;

  let narrative = "Dia de equilibrio: el flujo se mantiene cerca del punto base.";
  if (netFlow > 0) {
    narrative = "Ayer fue un dia de cosecha: los ingresos superaron el paso de los costos fijos.";
  } else if (netFlow < -500) {
    narrative = "Ayer fue un dia de siembra: los costos fijos pesaron mas que el ingreso reciente.";
  }

  const emoji = netFlow > 0 ? "✨" : netFlow < -500 ? "⚠️" : "🤔";
  const confidence = netFlow > 0 ? 0.9 : netFlow < -500 ? 0.6 : 0.75;
  const pace = netFlow > 0 ? 1 : netFlow < -500 ? -1 : 0;

  const today = now.toISOString().split("T")[0];

  const { error: upsertError } = await supabase
    .from("daily_metrics")
    .upsert(
      {
        date: today,
        revenue_today: revenue24h,
        costs_today: fixedDaily,
        net_flow_today: netFlow,
        pace_vs_breakeven: pace,
        days_to_crisis: null,
        confidence_score: confidence,
        narrative,
        emoji,
      },
      { onConflict: "date" }
    );

  if (upsertError) {
    return new Response(JSON.stringify({ error: upsertError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, date: today }), { status: 200 });
});
