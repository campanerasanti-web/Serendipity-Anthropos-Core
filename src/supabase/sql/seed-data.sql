-- Seed data: 3 invoices and 2 fixed_costs for validation
-- Run in Supabase SQL Editor or via psql

INSERT INTO public.fixed_costs (month, year, payroll, rent, evn, other_costs, updated_at)
VALUES
  (2, 2026, 12000.00, 3000.00, 400.00, 200.00, now()),
  (1, 2026, 10000.00, 2500.00, 300.00, 150.00, now())
ON CONFLICT (month, year) DO UPDATE SET payroll = EXCLUDED.payroll, rent = EXCLUDED.rent, evn = EXCLUDED.evn, other_costs = EXCLUDED.other_costs, updated_at = now();

INSERT INTO public.invoices (invoice_number, description, total_amount, created_at)
VALUES
  ('INV-2026-001', 'Venta prueba A', 1500.00, '2026-02-05T10:00:00Z'),
  ('INV-2026-002', 'Venta prueba B', 2750.50, '2026-02-08T14:30:00Z'),
  ('INV-2026-003', 'Venta prueba C', 499.99, '2026-02-11T09:15:00Z');
