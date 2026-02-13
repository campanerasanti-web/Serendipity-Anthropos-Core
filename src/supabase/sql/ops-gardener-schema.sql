-- ═══════════════════════════════════════════════════════════════
-- 🌱 ESQUEMA DEL JARDINERO DE OPERACIONES
-- Base de datos para vigilancia de flujos operativos
-- ═══════════════════════════════════════════════════════════════

-- Tabla: operational_processes
-- Almacena la definición de los flujos operativos del taller
CREATE TABLE IF NOT EXISTS operational_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  responsible TEXT, -- Guardián del flujo
  category TEXT NOT NULL, -- 'production', 'packing', 'tracking', 'reporting'
  status TEXT DEFAULT 'active', -- 'active', 'orphan', 'deprecated'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_processes_status ON operational_processes(status);
CREATE INDEX IF NOT EXISTS idx_processes_responsible ON operational_processes(responsible);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_processes_updated_at ON operational_processes;
CREATE TRIGGER update_processes_updated_at
  BEFORE UPDATE ON operational_processes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════

-- Tabla: gardener_reports
-- Almacena los reportes históricos del Jardinero
CREATE TABLE IF NOT EXISTS gardener_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  mode TEXT NOT NULL, -- 'audit', 'repair', 'harmonize', 'full'
  duration_ms INTEGER,
  climate_status TEXT, -- 'SOLEADO', 'PARCIALMENTE SOLEADO', 'NUBLADO', 'TORMENTA'
  climate_icon TEXT,
  climate_description TEXT,
  stats JSONB DEFAULT '{}',
  drought_points JSONB DEFAULT '[]', -- Flujos sin guardián
  completed_tasks JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  raw_results JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_reports_timestamp ON gardener_reports(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_reports_climate ON gardener_reports(climate_status);
CREATE INDEX IF NOT EXISTS idx_reports_mode ON gardener_reports(mode);

-- ═══════════════════════════════════════════════════════════════

-- Tabla: iot_alerts
-- Almacena alertas del Gateway IoT (MQTT)
CREATE TABLE IF NOT EXISTS iot_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  alert_type TEXT NOT NULL, -- 'ENERGÍA INUSUAL', 'SENSOR OFFLINE', etc.
  source TEXT NOT NULL, -- Sensor o dispositivo que generó la alerta
  topic TEXT, -- Topic MQTT (opcional)
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'warning', -- 'info', 'warning', 'critical'
  responsible TEXT, -- Responsable asignado por FLOW-001
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by TEXT,
  acknowledged_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON iot_alerts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON iot_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_acknowledged ON iot_alerts(acknowledged);

-- ═══════════════════════════════════════════════════════════════

-- Tabla: language_mappings
-- Almacena el mapeo de vocabulario entre sistemas
CREATE TABLE IF NOT EXISTS language_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  frontend_term TEXT NOT NULL,
  backend_term TEXT NOT NULL,
  physical_term TEXT NOT NULL, -- Término en Job Cards físicas
  aligned BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_mappings_updated_at ON language_mappings;
CREATE TRIGGER update_mappings_updated_at
  BEFORE UPDATE ON language_mappings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════

-- Datos iniciales: Los 7 Flujos Operativos
INSERT INTO operational_processes (name, description, category, responsible, status) VALUES
  ('Recepción de Orden', 'Ingreso de nuevas órdenes de producción al sistema', 'production', 'Sistema', 'active'),
  ('Asignación de Lote', 'Agrupación de órdenes en lotes de producción', 'production', 'Sistema', 'active'),
  ('Empaque (Packing)', 'Proceso de empaquetado de productos terminados', 'packing', NULL, 'orphan'),
  ('Cierre de Jornada', 'Generación de reportes diarios y cierre operacional', 'reporting', 'Supervisor', 'active'),
  ('Generación de QR', 'Creación de códigos QR para tracking de productos', 'tracking', 'Sistema', 'active'),
  ('Tracking IoT', 'Monitoreo de sensores físicos del taller', 'tracking', 'Gateway', 'active'),
  ('Reporte de Abundancia', 'Dashboard de métricas financieras operacionales', 'reporting', 'Dashboard', 'active')
ON CONFLICT (name) DO NOTHING;

-- Datos iniciales: Mapeo de Lenguaje
INSERT INTO language_mappings (frontend_term, backend_term, physical_term, aligned) VALUES
  ('orden', 'Order', 'Production Order', TRUE),
  ('lote', 'Lot', 'Lot', TRUE),
  ('packing', 'PackingList', 'Packing', TRUE),
  ('qr_code', 'QrCode', 'QR', FALSE),
  ('cierre', 'DailyClose', 'Day Close', TRUE),
  ('operario', 'Operator', 'Worker', FALSE)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════

-- Función: get_latest_climate
-- Retorna el último estado del clima financiero
CREATE OR REPLACE FUNCTION get_latest_climate()
RETURNS TABLE (
  climate_status TEXT,
  climate_icon TEXT,
  climate_description TEXT,
  report_timestamp TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gr.climate_status,
    gr.climate_icon,
    gr.climate_description,
    gr.timestamp
  FROM gardener_reports gr
  ORDER BY gr.timestamp DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Función: get_drought_points
-- Retorna todos los flujos sin guardián
CREATE OR REPLACE FUNCTION get_drought_points()
RETURNS TABLE (
  process_name TEXT,
  description TEXT,
  category TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    op.name,
    op.description,
    op.category,
    op.status
  FROM operational_processes op
  WHERE op.responsible IS NULL OR op.status = 'orphan';
END;
$$ LANGUAGE plpgsql;

-- Función: get_unacknowledged_alerts
-- Retorna alertas IoT pendientes de atención
CREATE OR REPLACE FUNCTION get_unacknowledged_alerts()
RETURNS TABLE (
  id UUID,
  alert_timestamp TIMESTAMPTZ,
  alert_type TEXT,
  source TEXT,
  message TEXT,
  severity TEXT,
  responsible TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ia.id,
    ia.timestamp,
    ia.alert_type,
    ia.source,
    ia.message,
    ia.severity,
    ia.responsible
  FROM iot_alerts ia
  WHERE ia.acknowledged = FALSE
  ORDER BY ia.timestamp DESC;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════
-- 🙏 "Que cada tabla sea una semilla de orden en el caos"
-- ═══════════════════════════════════════════════════════════════
