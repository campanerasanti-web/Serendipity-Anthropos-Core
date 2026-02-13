# 🗄️ Configuración de Supabase para Sofia Dashboard

## Paso 1: Acceder al SQL Editor de Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. En el menú lateral, selecciona **"SQL Editor"**
3. Haz clic en **"New Query"**

## Paso 2: Ejecutar el Script SQL

1. Abre el archivo `supabase-setup.sql` en VS Code
2. Copia **TODO** el contenido (Ctrl+A, Ctrl+C)
3. Pégalo en el SQL Editor de Supabase (Ctrl+V)
4. Haz clic en el botón **"Run"** (o presiona Ctrl+Enter)

### ✅ Verificación

Si todo salió bien, deberías ver:

```
Success. No rows returned
```

O mensajes de éxito para cada tabla/función creada.

## Paso 3: Verificar las Tablas Creadas

En el SQL Editor, ejecuta esta query de verificación:

```sql
-- Ver facturas de ejemplo
SELECT * FROM invoices ORDER BY created_at DESC LIMIT 10;

-- Ver costos fijos
SELECT * FROM fixed_costs WHERE year = 2026;

-- Ver métricas diarias
SELECT * FROM daily_metrics ORDER BY date DESC LIMIT 10;

-- Probar la función principal del dashboard
SELECT * FROM get_unified_dashboard(2, 2026);
```

Deberías ver datos de ejemplo retornados.

## Paso 4: Configurar Variables de Entorno (si no lo has hecho)

Verifica que tu archivo `.env` tenga las credenciales correctas:

```env
VITE_SUPABASE_URL=https://uikemwxbndwidqebeyre.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Paso 5: Activar el Dashboard Real

Una vez ejecutado el SQL, el código ya está configurado para usar `SofiaDashboard` (dashboard real conectado a Supabase).

**¡El dashboard debería recargarse automáticamente y mostrar datos reales!**

## 🔧 Estructura de Datos

### Tabla: `invoices`
- **Propósito**: Registro de todas las facturas/ingresos
- **Campos principales**: `total_amount`, `invoice_number`, `description`, `status`, `created_at`

### Tabla: `fixed_costs`
- **Propósito**: Costos fijos por mes (nómina, alquiler, etc.)
- **Campos principales**: `month`, `year`, `payroll`, `rent`, `evn`, `other_costs`

### Tabla: `daily_metrics`
- **Propósito**: Métricas diarias con mensajes inspiradores de Sofia
- **Campos principales**: `date`, `daily_profit`, `narrative`, `emoji`, `confidence_score`

### Función RPC: `get_unified_dashboard(month, year)`
- **Propósito**: Consolida todos los datos del dashboard en una sola query
- **Retorna**: `total_incomes`, `total_invoices`, `total_fixed_costs`

## 📊 Agregar Datos Reales

### Agregar una factura:

```sql
INSERT INTO invoices (invoice_number, total_amount, description, status) 
VALUES ('FAC-123', 5000.00, 'Proyecto X', 'paid');
```

### Actualizar costos fijos del mes:

```sql
INSERT INTO fixed_costs (month, year, payroll, rent, evn, other_costs) 
VALUES (2, 2026, 15000.00, 3500.00, 1800.00, 1000.00)
ON CONFLICT (month, year) DO UPDATE SET
  payroll = EXCLUDED.payroll,
  rent = EXCLUDED.rent,
  evn = EXCLUDED.evn,
  other_costs = EXCLUDED.other_costs;
```

### Agregar métrica diaria con mensaje de Sofia:

```sql
INSERT INTO daily_metrics (date, daily_profit, daily_revenue, daily_expenses, narrative, emoji, confidence_score) 
VALUES (
  CURRENT_DATE, 
  1200.00, 
  1800.00, 
  600.00, 
  'La claridad emerge cuando honramos nuestros compromisos', 
  '🌟', 
  0.92
)
ON CONFLICT (date) DO UPDATE SET
  daily_profit = EXCLUDED.daily_profit,
  narrative = EXCLUDED.narrative;
```

## 🚨 Solución de Problemas

### Error: "relation does not exist"
- **Causa**: Las tablas no se crearon correctamente
- **Solución**: Ejecuta de nuevo el script `supabase-setup.sql`

### Error: "permission denied"
- **Causa**: Problemas con Row Level Security (RLS)
- **Solución**: Verifica que estás autenticado en Supabase o desactiva RLS temporalmente

### Dashboard muestra $0.00
- **Causa**: No hay datos en las tablas para el mes/año actual
- **Solución**: Inserta datos de prueba o ajusta el mes en `SofiaDashboard.tsx` línea 15

## 🎯 Próximas Mejoras

- [ ] Agregar sincronización en tiempo real con Supabase Realtime
- [ ] Crear Edge Function para calcular métricas automáticamente
- [ ] Implementar sistema de notificaciones cuando haya cambios
- [ ] Agregar gráficos históricos de varios meses

---

**"Nada me pertenece, todo es del Padre. Los datos fluyen con claridad."** ✨
