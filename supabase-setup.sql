-- ====================================================================
-- SCRIPT DE CONFIGURACIÓN DE SUPABASE PARA SOFIA DASHBOARD
-- ====================================================================
-- Ejecuta este script en el SQL Editor de Supabase
-- (https://supabase.com/dashboard/project/YOUR_PROJECT/editor)
-- ====================================================================

-- IMPORTANTE: Este script ELIMINA y RECREA las tablas
-- Si tienes datos importantes, haz un backup primero

-- Eliminar tablas existentes (si existen)
DROP TABLE IF EXISTS public.daily_metrics CASCADE;
DROP TABLE IF EXISTS public.fixed_costs CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;

-- 1. TABLA: invoices (facturas/ingresos)
-- ====================================================================
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT,
  total_amount DECIMAL(12, 2) NOT NULL,
  description TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_invoices_created_at ON public.invoices(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Política SELECT: Lectura pública (datos compartidos)
DROP POLICY IF EXISTS "SELECT invoices" ON public.invoices;
CREATE POLICY "SELECT invoices"
  ON public.invoices
  FOR SELECT
  USING (true);

-- Política INSERT: Solo administradores o usuario autenticado
DROP POLICY IF EXISTS "INSERT invoices" ON public.invoices;
CREATE POLICY "INSERT invoices"
  ON public.invoices
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Política UPDATE: Solo quien creó el registro
DROP POLICY IF EXISTS "UPDATE invoices" ON public.invoices;
CREATE POLICY "UPDATE invoices"
  ON public.invoices
  FOR UPDATE
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Política DELETE: Solo quien creó el registro
DROP POLICY IF EXISTS "DELETE invoices" ON public.invoices;
CREATE POLICY "DELETE invoices"
  ON public.invoices
  FOR DELETE
  USING (user_id = auth.uid() OR user_id IS NULL);


-- 2. TABLA: fixed_costs (costos fijos mensuales)
-- ====================================================================
CREATE TABLE public.fixed_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year >= 2024),
  payroll DECIMAL(12, 2) DEFAULT 0,
  rent DECIMAL(12, 2) DEFAULT 0,
  evn DECIMAL(12, 2) DEFAULT 0,
  other_costs DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(month, year)
);

-- Enable RLS
ALTER TABLE public.fixed_costs ENABLE ROW LEVEL SECURITY;

-- Política SELECT: Lectura pública (datos compartidos)
DROP POLICY IF EXISTS "SELECT fixed_costs" ON public.fixed_costs;
CREATE POLICY "SELECT fixed_costs"
  ON public.fixed_costs
  FOR SELECT
  USING (true);

-- Política INSERT: Solo administradores
DROP POLICY IF EXISTS "INSERT fixed_costs" ON public.fixed_costs;
CREATE POLICY "INSERT fixed_costs"
  ON public.fixed_costs
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Política UPDATE: Solo administradores
DROP POLICY IF EXISTS "UPDATE fixed_costs" ON public.fixed_costs;
CREATE POLICY "UPDATE fixed_costs"
  ON public.fixed_costs
  FOR UPDATE
  USING (true)
  WITH CHECK (auth.role() = 'authenticated');

-- Política DELETE: Solo administradores
DROP POLICY IF EXISTS "DELETE fixed_costs" ON public.fixed_costs;
CREATE POLICY "DELETE fixed_costs"
  ON public.fixed_costs
  FOR DELETE
  USING (auth.role() = 'authenticated');


-- 3. TABLA: daily_metrics (métricas diarias con insights de Sofia)
-- ====================================================================
CREATE TABLE public.daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  daily_profit DECIMAL(12, 2),
  daily_revenue DECIMAL(12, 2),
  daily_expenses DECIMAL(12, 2),
  narrative TEXT,
  emoji TEXT,
  confidence_score DECIMAL(3, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para mejorar búsquedas por fecha
CREATE INDEX idx_daily_metrics_date ON public.daily_metrics(date);

-- Enable RLS
ALTER TABLE public.daily_metrics ENABLE ROW LEVEL SECURITY;

-- Política SELECT: Lectura pública (insights compartidos con todos)
DROP POLICY IF EXISTS "SELECT daily_metrics" ON public.daily_metrics;
CREATE POLICY "SELECT daily_metrics"
  ON public.daily_metrics
  FOR SELECT
  USING (true);

-- Política INSERT: Solo sistema/admin
DROP POLICY IF EXISTS "INSERT daily_metrics" ON public.daily_metrics;
CREATE POLICY "INSERT daily_metrics"
  ON public.daily_metrics
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Política UPDATE: Solo admin/sistema
DROP POLICY IF EXISTS "UPDATE daily_metrics" ON public.daily_metrics;
CREATE POLICY "UPDATE daily_metrics"
  ON public.daily_metrics
  FOR UPDATE
  USING (true)
  WITH CHECK (auth.role() = 'authenticated');

-- Política DELETE: Solo admin/sistema
DROP POLICY IF EXISTS "DELETE daily_metrics" ON public.daily_metrics;
CREATE POLICY "DELETE daily_metrics"
  ON public.daily_metrics
  FOR DELETE
  USING (auth.role() = 'authenticated');


-- 4. FUNCIÓN RPC: get_unified_dashboard
-- ====================================================================
-- Esta función consolida datos del dashboard en UNA SOLA query
-- ====================================================================
DROP FUNCTION IF EXISTS public.get_unified_dashboard(INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION public.get_unified_dashboard(
  p_month INTEGER,
  p_year INTEGER
)
RETURNS TABLE (
  total_incomes DECIMAL,
  total_invoices BIGINT,
  total_fixed_costs DECIMAL
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(i.total_amount), 0) AS total_incomes,
    COUNT(i.id) AS total_invoices,
    COALESCE(
      (SELECT (payroll + rent + evn + other_costs) 
       FROM fixed_costs 
       WHERE month = p_month AND year = p_year
       LIMIT 1),
      0
    ) AS total_fixed_costs
  FROM invoices i
  WHERE 
    EXTRACT(MONTH FROM i.created_at) = p_month
    AND EXTRACT(YEAR FROM i.created_at) = p_year;
END;
$$;


-- 5. FUNCIÓN RPC: predict_monthly_cashflow (opcional)
-- ====================================================================
-- Predicción simple de cash flow basado en promedio de últimos 3 meses
-- ====================================================================
DROP FUNCTION IF EXISTS public.predict_monthly_cashflow(INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION public.predict_monthly_cashflow(
  p_month INTEGER,
  p_year INTEGER
)
RETURNS TABLE (
  predicted_revenue DECIMAL,
  predicted_expenses DECIMAL,
  predicted_profit DECIMAL,
  confidence DECIMAL
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_revenue DECIMAL;
  avg_expenses DECIMAL;
BEGIN
  -- Calcular promedio de últimos 90 días
  SELECT 
    AVG(daily_revenue),
    AVG(daily_expenses)
  INTO avg_revenue, avg_expenses
  FROM daily_metrics
  WHERE date >= CURRENT_DATE - INTERVAL '90 days';

  predicted_revenue := COALESCE(avg_revenue * 30, 0);
  predicted_expenses := COALESCE(avg_expenses * 30, 0);
  predicted_profit := predicted_revenue - predicted_expenses;
  confidence := 0.75; -- 75% de confianza (puedes ajustar lógica)

  RETURN QUERY SELECT predicted_revenue, predicted_expenses, predicted_profit, confidence;
END;
$$;


-- 6. FUNCIÓN RPC: get_period_analytics (opcional)
-- ====================================================================
-- Análisis de un período específico
-- ====================================================================
DROP FUNCTION IF EXISTS public.get_period_analytics(DATE, DATE);

CREATE OR REPLACE FUNCTION public.get_period_analytics(
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  date DATE,
  daily_profit DECIMAL,
  daily_revenue DECIMAL,
  daily_expenses DECIMAL,
  narrative TEXT,
  emoji TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.date,
    dm.daily_profit,
    dm.daily_revenue,
    dm.daily_expenses,
    dm.narrative,
    dm.emoji
  FROM daily_metrics dm
  WHERE dm.date BETWEEN p_start_date AND p_end_date
  ORDER BY dm.date ASC;
END;
$$;


-- ====================================================================
-- DATOS DE PRUEBA (opcional - elimina si no los necesitas)
-- ====================================================================

-- Insertar algunas facturas de ejemplo
-- Nota: Si la tabla ya tiene datos, estos INSERT se saltarán
INSERT INTO invoices (invoice_number, total_amount, description, created_at) 
SELECT 'FAC-001', 2500.00, 'Desarrollo web cliente A', '2026-02-01'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'FAC-001');

INSERT INTO invoices (invoice_number, total_amount, description, created_at) 
SELECT 'FAC-002', 3200.00, 'Consultoría empresarial', '2026-02-05'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'FAC-002');

INSERT INTO invoices (invoice_number, total_amount, description, created_at) 
SELECT 'FAC-003', 1800.00, 'Diseño de identidad corporativa', '2026-02-10'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'FAC-003');

INSERT INTO invoices (invoice_number, total_amount, description, created_at) 
SELECT 'FAC-004', 4500.00, 'Sistema de gestión de inventario', '2026-02-12'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'FAC-004');

-- Insertar costos fijos de febrero 2026
INSERT INTO fixed_costs (month, year, payroll, rent, evn, other_costs)
SELECT 2, 2026, 12000.00, 3000.00, 1500.00, 800.00
WHERE NOT EXISTS (SELECT 1 FROM fixed_costs WHERE month = 2 AND year = 2026);

-- Insertar métricas diarias de ejemplo
INSERT INTO daily_metrics (date, daily_profit, daily_revenue, daily_expenses, narrative, emoji, confidence_score)
SELECT '2026-02-01'::date, 850.00, 1200.00, 350.00, 'Un nuevo amanecer trae nuevas oportunidades', '🌅', 0.85
WHERE NOT EXISTS (SELECT 1 FROM daily_metrics WHERE date = '2026-02-01');

INSERT INTO daily_metrics (date, daily_profit, daily_revenue, daily_expenses, narrative, emoji, confidence_score)
SELECT '2026-02-05'::date, 1100.00, 1500.00, 400.00, 'La abundancia fluye cuando estamos alineados', '✨', 0.90
WHERE NOT EXISTS (SELECT 1 FROM daily_metrics WHERE date = '2026-02-05');

INSERT INTO daily_metrics (date, daily_profit, daily_revenue, daily_expenses, narrative, emoji, confidence_score)
SELECT '2026-02-10'::date, 650.00, 900.00, 250.00, 'Días tranquilos construyen fundaciones sólidas', '🏗️', 0.78
WHERE NOT EXISTS (SELECT 1 FROM daily_metrics WHERE date = '2026-02-10');

INSERT INTO daily_metrics (date, daily_profit, daily_revenue, daily_expenses, narrative, emoji, confidence_score)
SELECT '2026-02-12'::date, 1250.00, 1800.00, 550.00, 'El esfuerzo de hoy es la cosecha de mañana', '🌾', 0.88
WHERE NOT EXISTS (SELECT 1 FROM daily_metrics WHERE date = '2026-02-12');


-- ====================================================================
-- VERIFICACIÓN: Ejecuta esto para confirmar que todo funciona
-- ====================================================================
-- SELECT * FROM get_unified_dashboard(2, 2026);
-- SELECT * FROM daily_metrics ORDER BY date DESC LIMIT 10;
-- SELECT * FROM invoices ORDER BY created_at DESC LIMIT 10;
-- SELECT * FROM fixed_costs WHERE year = 2026;

-- ====================================================================
-- ¡LISTO! Ahora puedes cambiar a SofiaDashboard en App.tsx
-- ====================================================================
