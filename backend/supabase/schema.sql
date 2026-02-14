-- Serendipity Anthropos Core - Supabase Schema Validation
-- This SQL file validates that all required tables and RLS policies are in place

-- ============================================================================
-- TABLE: invoices (Financial Data)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  source TEXT DEFAULT 'Manual',  -- 'Xero', 'QuickBooks', 'Manual'
  amount DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'DRAFT',    -- 'DRAFT', 'SENT', 'AUTHORISED', 'PAID'
  invoice_date DATE,
  due_date DATE,
  description TEXT,
  customer_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow authenticated users to read
CREATE POLICY "Allow authenticated read" ON public.invoices
  FOR SELECT USING (auth.role() = 'authenticated_user');

-- RLS Policy: Allow service role full access
CREATE POLICY "Allow service role full access" ON public.invoices
  USING (TRUE) WITH CHECK (TRUE);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_invoices_source ON public.invoices(source);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices(created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;

-- ============================================================================
-- TABLE: fixed_costs (Monthly Operating Expenses)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.fixed_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month DATE NOT NULL,
  category TEXT NOT NULL,  -- 'Salaries', 'Rent', 'Utilities', etc.
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.fixed_costs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow authenticated users to read
CREATE POLICY "Allow authenticated read" ON public.fixed_costs
  FOR SELECT USING (auth.role() = 'authenticated_user');

-- RLS Policy: Allow service role full access
CREATE POLICY "Allow service role full access" ON public.fixed_costs
  USING (TRUE) WITH CHECK (TRUE);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_fixed_costs_month ON public.fixed_costs(month);
CREATE INDEX IF NOT EXISTS idx_fixed_costs_category ON public.fixed_costs(category);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.fixed_costs;

-- ============================================================================
-- TABLE: event_records (Webhook & System Events)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.event_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  source TEXT,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.event_records ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow authenticated users to read
CREATE POLICY "Allow authenticated read" ON public.event_records
  FOR SELECT USING (auth.role() = 'authenticated_user');

-- RLS Policy: Allow service role full access
CREATE POLICY "Allow service role full access" ON public.event_records
  USING (TRUE) WITH CHECK (TRUE);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_event_records_source ON public.event_records(source);
CREATE INDEX IF NOT EXISTS idx_event_records_created_at ON public.event_records(created_at);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_records;

-- ============================================================================
-- TABLE: realtime_test (Health Check)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.realtime_test (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.realtime_test ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all operations
CREATE POLICY "Allow all" ON public.realtime_test
  USING (TRUE) WITH CHECK (TRUE);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.realtime_test;

-- ============================================================================
-- VIEWS & FUNCTIONS
-- ============================================================================

-- View: Monthly Invoice Summary
CREATE OR REPLACE VIEW public.v_monthly_invoices AS
SELECT
  DATE_TRUNC('month', invoice_date)::DATE as month,
  source,
  status,
  COUNT(*) as invoice_count,
  SUM(amount) as total_amount,
  AVG(amount) as avg_amount
FROM public.invoices
WHERE is_deleted = FALSE
GROUP BY DATE_TRUNC('month', invoice_date), source, status
ORDER BY month DESC;

-- View: Monthly Fixed Costs Summary
CREATE OR REPLACE VIEW public.v_monthly_costs AS
SELECT
  month,
  category,
  SUM(amount) as total,
  COUNT(*) as entries
FROM public.fixed_costs
GROUP BY month, category
ORDER BY month DESC, category;

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to invoices
DROP TRIGGER IF EXISTS trigger_update_invoices_updated_at ON public.invoices;
CREATE TRIGGER trigger_update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Apply trigger to fixed_costs
DROP TRIGGER IF EXISTS trigger_update_costs_updated_at ON public.fixed_costs;
CREATE TRIGGER trigger_update_costs_updated_at
  BEFORE UPDATE ON public.fixed_costs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- GRANTS & PERMISSIONS
-- ============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON public.invoices TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON public.fixed_costs TO authenticated, service_role;
GRANT SELECT, INSERT ON public.event_records TO service_role;
GRANT SELECT ON public.v_monthly_invoices TO authenticated, service_role;
GRANT SELECT ON public.v_monthly_costs TO authenticated, service_role;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if realtime is enabled on tables
-- SELECT schemaname, tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- Check RLS policies
-- SELECT tablename, policyname, permissive, roles FROM pg_policies WHERE schemaname = 'public';

-- Check triggers
-- SELECT trigger_name, event_manipulation, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'public';
