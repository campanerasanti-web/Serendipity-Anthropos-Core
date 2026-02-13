-- Full setup: create core tables and get_unified_dashboard function
-- Run this in the Supabase SQL Editor for the target project (must match VITE_SUPABASE_URL)

-- 1) Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2) Core tables
-- invoices
CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text,
  description text,
  total_amount numeric(12,2) NOT NULL DEFAULT 0,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- fixed_costs
CREATE TABLE IF NOT EXISTS public.fixed_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month integer NOT NULL,
  year integer NOT NULL,
  payroll numeric(12,2) DEFAULT 0,
  rent numeric(12,2) DEFAULT 0,
  evn numeric(12,2) DEFAULT 0,
  other_costs numeric(12,2) DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (month, year)
);

-- daily_metrics
CREATE TABLE IF NOT EXISTS public.daily_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  revenue_today numeric NOT NULL DEFAULT 0,
  costs_today numeric NOT NULL DEFAULT 0,
  net_flow_today numeric NOT NULL DEFAULT 0,
  pace_vs_breakeven numeric NOT NULL DEFAULT 0,
  days_to_crisis int,
  confidence_score numeric DEFAULT 0,
  narrative text,
  emoji text DEFAULT '🤔',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_month_year ON public.invoices (created_at);
CREATE INDEX IF NOT EXISTS idx_fixed_costs_month_year ON public.fixed_costs(month, year);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_date ON public.daily_metrics(date);

-- 3) get_unified_dashboard function (compatible with frontend expecting `total_incomes`)
CREATE OR REPLACE FUNCTION public.get_unified_dashboard(p_month integer, p_year integer)
RETURNS TABLE(
  total_incomes numeric,
  total_invoices bigint,
  total_fixed_costs numeric,
  month integer,
  year integer
)
LANGUAGE sql STABLE
AS $$
  SELECT
    COALESCE((SELECT SUM(total_amount) FROM public.invoices WHERE created_at >= make_date(p_year, p_month, 1) AND created_at < (make_date(p_year, p_month, 1) + interval '1 month')), 0)::numeric AS total_incomes,
    COALESCE((SELECT COUNT(*) FROM public.invoices WHERE created_at >= make_date(p_year, p_month, 1) AND created_at < (make_date(p_year, p_month, 1) + interval '1 month')), 0)::bigint AS total_invoices,
    COALESCE((SELECT (COALESCE(payroll,0) + COALESCE(rent,0) + COALESCE(evn,0) + COALESCE(other_costs,0)) FROM public.fixed_costs WHERE month = p_month AND year = p_year LIMIT 1), 0)::numeric AS total_fixed_costs,
    p_month AS month,
    p_year AS year;
$$;

-- 4) Optional: example seed data (uncomment to insert)
-- INSERT INTO public.fixed_costs (month, year, payroll, rent, evn, other_costs) VALUES (2, 2026, 12000, 3000, 400, 200);
-- INSERT INTO public.invoices (invoice_number, description, total_amount, created_at) VALUES ('INV-001', 'Venta A', 1500.00, '2026-02-10');
-- INSERT INTO public.daily_metrics (date, narrative, emoji, confidence_score) VALUES ('2026-02-11', 'Buen flujo', '✨', 0.87);

-- 5) Notes
-- Run this as a single script in Supabase SQL Editor for the same project your app uses (VITE_SUPABASE_URL).
-- After running, refresh the schema cache in Supabase (the SQL Editor UI usually does this automatically).
