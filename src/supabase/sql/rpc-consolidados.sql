-- ============================================================================
-- RPC CONSOLIDADOS PARA SERENDIPITY DIGITAL
-- Estos RPCs reemplazan múltiples queries con un único endpoint eficiente
-- ============================================================================

-- Asegurarse de que la extensión para gen_random_uuid() esté disponible
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. DASHBOARD UNIFICADO
-- Una sola llamada retorna toda la información financiera del mes
CREATE OR REPLACE FUNCTION get_unified_dashboard(
  p_month INT,
  p_year INT
)
RETURNS TABLE (
  total_revenue NUMERIC,
  fixed_costs NUMERIC,
  net_flow NUMERIC,
  peace_fund NUMERIC,
  progress_percent NUMERIC,
  status TEXT
) AS $$
  WITH invoices_sum AS (
    SELECT COALESCE(SUM(total_amount), 0) as total
    FROM invoices
    WHERE EXTRACT(MONTH FROM created_at) = p_month
      AND EXTRACT(YEAR FROM created_at) = p_year
  ),
  costs_sum AS (
    SELECT 
      COALESCE(payroll, 0) +
      COALESCE(rent, 0) +
      COALESCE(evn, 0) +
      COALESCE(other_costs, 0) as total
    FROM fixed_costs
    WHERE month = p_month 
      AND year = p_year
  ),
  calculations AS (
    SELECT 
      i.total as revenue,
      c.total as costs,
      GREATEST(i.total - c.total, 0) as surplus,
      GREATEST(i.total - c.total, 0) * 0.10 as peace_amount
    FROM invoices_sum i, costs_sum c
  )
  SELECT 
    revenue::NUMERIC as total_revenue,
    costs::NUMERIC as fixed_costs,
    surplus::NUMERIC as net_flow,
    peace_amount::NUMERIC as peace_fund,
    (revenue / NULLIF(costs, 0) * 100)::NUMERIC as progress_percent,
    CASE 
      WHEN revenue >= costs THEN 'PEACE'
      WHEN revenue >= (costs * 0.7) THEN 'WORKING'
      ELSE 'CRISIS'
    END::TEXT as status
  FROM calculations;
$$ LANGUAGE SQL STABLE;

-- ============================================================================

-- 2. PREDICCIÓN DE CASH FLOW
-- Analiza histórico y predice revenues del próximo mes
CREATE OR REPLACE FUNCTION predict_monthly_cashflow(
  p_month INT,
  p_year INT
)
RETURNS TABLE (
  projected_revenue NUMERIC,
  confidence NUMERIC,
  recommendation TEXT,
  emoji TEXT,
  days_to_crisis INT
) AS $$
  WITH monthly_history AS (
    SELECT 
      EXTRACT(MONTH FROM created_at) as month,
      EXTRACT(YEAR FROM created_at) as year,
      SUM(total_amount) as monthly_total
    FROM invoices
    WHERE created_at >= NOW() - INTERVAL '12 months'
    GROUP BY month, year
    ORDER BY year, month DESC
    LIMIT 12
  ),
  avg_monthly AS (
    SELECT AVG(monthly_total)::NUMERIC as avg_revenue
    FROM monthly_history
  ),
  trend_analysis AS (
    SELECT 
      STDDEV(monthly_total)::NUMERIC as std_dev,
      MIN(monthly_total)::NUMERIC as min_revenue,
      MAX(monthly_total)::NUMERIC as max_revenue
    FROM monthly_history
  ),
  breakeven_data AS (
    SELECT 
      COALESCE(
        (SELECT SUM(payroll + rent + evn + other_costs)
         FROM fixed_costs
         WHERE month = p_month AND year = p_year),
        0
      )::NUMERIC as breakeven
  )
  SELECT 
    (SELECT avg_revenue FROM avg_monthly)::NUMERIC as projected_revenue,
    (100 * (1 - (SELECT std_dev FROM trend_analysis) / NULLIF((SELECT avg_revenue FROM avg_monthly), 0)))::NUMERIC as confidence,
    CASE 
      WHEN (SELECT avg_revenue FROM avg_monthly) >= (SELECT breakeven FROM breakeven_data) 
        THEN 'Mantén el ritmo, la tendencia es positiva'
      ELSE 'Enfócate en nuevas ventas, necesitas aumentar ingresos'
    END::TEXT as recommendation,
    CASE 
      WHEN (SELECT avg_revenue FROM avg_monthly) >= (SELECT breakeven FROM breakeven_data)
        THEN '🟢'
      WHEN (SELECT avg_revenue FROM avg_monthly) >= (SELECT breakeven FROM breakeven_data) * 0.7
        THEN '🟡'
      ELSE '🔴'
    END::TEXT as emoji,
    CASE 
      WHEN (SELECT avg_revenue FROM avg_monthly) > 0
        THEN CEIL((SELECT breakeven FROM breakeven_data) / ((SELECT avg_revenue FROM avg_monthly) / 30))::INT
      ELSE 999
    END::INT as days_to_crisis;
$$ LANGUAGE SQL STABLE;

-- ============================================================================

-- 3. ANÁLISIS DE PERÍODO (para gráficos 30 días)
-- Retorna un resumen diario del últitmo mes
CREATE OR REPLACE FUNCTION get_period_analytics(
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  analysis_date DATE,
  daily_revenue NUMERIC,
  cumulative_revenue NUMERIC,
  avg_daily_rate NUMERIC,
  days_elapsed INT
) AS $$
  WITH date_series AS (
    SELECT generate_series(p_start_date, p_end_date, INTERVAL '1 day')::DATE as date
  ),
  daily_invoices AS (
    SELECT 
      DATE(created_at) as invoice_date,
      SUM(total_amount) as total
    FROM invoices
    WHERE created_at >= p_start_date AND created_at <= p_end_date
    GROUP BY DATE(created_at)
  ),
  daily_with_cumulative AS (
    SELECT 
      ds.date,
      COALESCE(di.total, 0) as daily_total,
      SUM(COALESCE(di.total, 0)) OVER (ORDER BY ds.date) as cumulative
    FROM date_series ds
    LEFT JOIN daily_invoices di ON ds.date = di.invoice_date
  )
  SELECT 
    date::DATE as analysis_date,
    daily_total::NUMERIC as daily_revenue,
    cumulative::NUMERIC as cumulative_revenue,
    (cumulative / (DATE(NOW()) - p_start_date + 1))::NUMERIC as avg_daily_rate,
    (date - p_start_date)::INT as days_elapsed
  FROM daily_with_cumulative
  ORDER BY date;
$$ LANGUAGE SQL STABLE;

-- ============================================================================

-- 4. ESTADÍSTICAS RESUMIDAS DEL MES (usado por SurvivalThermometer)
-- Optimizado para actualización frecuente de UI
CREATE OR REPLACE FUNCTION get_monthly_summary(
  p_month INT,
  p_year INT
)
RETURNS TABLE (
  total_invoiced NUMERIC,
  total_costs NUMERIC,
  surplus NUMERIC,
  peace_fund NUMERIC,
  progress_pct NUMERIC,
  daysremaining INT,
  status_emoji TEXT
) AS $$
  WITH month_data AS (
    SELECT 
      COALESCE(SUM(total_amount), 0) as invoiced
    FROM invoices
    WHERE EXTRACT(MONTH FROM created_at) = p_month
      AND EXTRACT(YEAR FROM created_at) = p_year
  ),
  cost_data AS (
    SELECT 
      COALESCE(SUM(payroll + rent + evn + other_costs), 0) as costs
    FROM fixed_costs
    WHERE month = p_month AND year = p_year
  ),
  day_info AS (
    SELECT
      EXTRACT(DAY FROM (MAKE_DATE(p_year, p_month, 1) + INTERVAL '1 month' - INTERVAL '1 day'))::INT as days_in_month,
      EXTRACT(DAY FROM NOW())::INT as current_day
  )
  SELECT 
    (SELECT invoiced FROM month_data)::NUMERIC,
    (SELECT costs FROM cost_data)::NUMERIC,
    ((SELECT invoiced FROM month_data) - (SELECT costs FROM cost_data))::NUMERIC,
    GREATEST(((SELECT invoiced FROM month_data) - (SELECT costs FROM cost_data)) * 0.10, 0)::NUMERIC,
    ((SELECT invoiced FROM month_data) / NULLIF((SELECT costs FROM cost_data), 0) * 100)::NUMERIC,
    ((SELECT days_in_month FROM day_info) - (SELECT current_day FROM day_info))::INT,
    CASE 
      WHEN ((SELECT invoiced FROM month_data) / NULLIF((SELECT costs FROM cost_data), 0)) >= 1.0 THEN '✅'
      WHEN ((SELECT invoiced FROM month_data) / NULLIF((SELECT costs FROM cost_data), 0)) >= 0.7 THEN '⚠️'
      ELSE '🔴'
    END::TEXT;
$$ LANGUAGE SQL STABLE;

-- ============================================================================

-- 5. REGISTRAR INSIGHT DIARIO (Tabla de apoyo)
-- Se ejecuta automáticamente via trigger a medianoche
CREATE TABLE IF NOT EXISTS daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  revenue_today NUMERIC NOT NULL DEFAULT 0,
  costs_today NUMERIC NOT NULL DEFAULT 0,
  net_flow_today NUMERIC NOT NULL DEFAULT 0,
  pace_vs_breakeven NUMERIC NOT NULL DEFAULT 0, -- % del target logrado hoy
  days_to_crisis INT,                           -- Proyección si sigue el ritmo
  confidence_score NUMERIC DEFAULT 0,           -- 0-100 confianza de la predicción
  narrative TEXT,                               -- Insight en lenguaje natural (generado por IA)
  emoji TEXT DEFAULT '🤔',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_metrics_date ON daily_metrics(date);

-- ============================================================================

-- 6. GENERAR MÉTRICAS DIARIAS (Trigger automático)
-- Se ejecuta a las 00:05 cada día
CREATE OR REPLACE FUNCTION generate_daily_metrics()
RETURNS void AS $$
  DECLARE
    v_today DATE := CURRENT_DATE;
    v_month INT := EXTRACT(MONTH FROM v_today);
    v_year INT := EXTRACT(YEAR FROM v_today);
    v_revenue_today NUMERIC;
    v_costs_fixed NUMERIC;
    v_revenue_mtd NUMERIC;
    v_costs_mtd NUMERIC;
    v_days_elapsed INT;
    v_pace NUMERIC;
    v_days_to_crisis INT;
  BEGIN
    -- Obtener ingresos de hoy
    SELECT COALESCE(SUM(total_amount), 0) INTO v_revenue_today
    FROM invoices
    WHERE DATE(created_at) = v_today;

    -- Obtener costos fijos del mes
    SELECT COALESCE(SUM(payroll + rent + evn + other_costs), 0) INTO v_costs_fixed
    FROM fixed_costs
    WHERE month = v_month AND year = v_year;

    -- Obtener ingresos acumulados del mes
    SELECT COALESCE(SUM(total_amount), 0) INTO v_revenue_mtd
    FROM invoices
    WHERE EXTRACT(MONTH FROM created_at) = v_month
      AND EXTRACT(YEAR FROM created_at) = v_year;

    -- Calcular días transcurridos
    v_days_elapsed := EXTRACT(DAY FROM v_today);

    -- Calcular pace vs breakeven
    v_pace := CASE 
      WHEN v_costs_fixed = 0 THEN 0
      ELSE (v_revenue_mtd / v_costs_fixed) * 100
    END;

    -- Calcular días para alcanzar el break-even
    v_days_to_crisis := CASE 
      WHEN v_revenue_mtd = 0 THEN 999
      ELSE CEIL((v_costs_fixed - v_revenue_mtd) / (v_revenue_mtd / v_days_elapsed))
    END;

    -- Insertar o actualizar métrica del día
    INSERT INTO daily_metrics (
      date,
      revenue_today,
      costs_today,
      net_flow_today,
      pace_vs_breakeven,
      days_to_crisis,
      confidence_score
    )
    VALUES (
      v_today,
      v_revenue_today,
      v_costs_fixed,
      v_revenue_mtd - v_costs_fixed,
      v_pace,
      v_days_to_crisis,
      85 -- Confianza inicial, se actualiza con IA
    )
    ON CONFLICT (date) DO UPDATE SET
      revenue_today = v_revenue_today,
      net_flow_today = v_revenue_mtd - v_costs_fixed,
      pace_vs_breakeven = v_pace,
      days_to_crisis = v_days_to_crisis,
      updated_at = NOW();

  END;
$$ LANGUAGE plpgsql;

-- ============================================================================

-- 7. ÓRDENES DE CREACIÓN DE ÍNDICES (Performance)
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_month_year ON invoices(EXTRACT(MONTH FROM created_at), EXTRACT(YEAR FROM created_at));
CREATE INDEX IF NOT EXISTS idx_fixed_costs_month_year ON fixed_costs(month, year);

-- ============================================================================
-- NOTES:
-- - Todos estos RPCs son STABLE (no modifican estado)
-- - Optimizados para ser cacheables por 5 minutos
-- - El trigger generate_daily_metrics debe ejecutarse via Supabase Cron
-- - Ver configuración en: .github/workflows/daily-metrics.yml
-- ============================================================================
