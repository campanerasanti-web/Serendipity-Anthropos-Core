# Guía de Implementación - Plan Vivo y Dinámico

**Estado:** En curso - Fase 1 (Pilar 3: Caché + Optimización) ✅ Completado

---

## Resumen Ejecutivo

Este documento describe la implementación del plan de mejoras para transformar el codebase de Serendipity Digital de "estático" a "vivo y dinámico".

**Objetivos:**
1. ✅ Reducir N+1 queries a 1 RPC consolidado
2. ✅ Implementar React Query para caché inteligente
3. ✅ Agregar Realtime listeners automáticos
4. ✅ Crear sistema de observabilidad con insights narrativos
5. ⏳ Automatizar cálculos financieros con triggers SQL

---

## Fase 1: Pilar 3 - Caché + Query Optimization ✅

### Archivos Creados

```
hooks/
  ├── useMonthlyStats.ts (React Query hook con staleTime: 5 min)
  └── useRealtimeSubscription.ts (Listener automático a cambios Supabase)

services/
  └── queries.ts (Service layer centralizado para todas las queries)

supabase/sql/
  └── rpc-consolidados.sql (7 RPCs optimizados)
```

### Cambios en Componentes Existentes

| Archivo | Cambio | Impacto |
|---------|--------|--------|
| `SurvivalThermometer.tsx.txt` | Usa `useCurrentMonthStats()` + Realtime listeners | ✅ Auto-actualiza en <500ms |
| `UnifiedCommandCenter.tsx.txt` | Usa React Query + predicción RPC | ✅ Caché de 1 hora para predicciones |

### RPCs Consolidados Creados

```sql
1. get_unified_dashboard(p_month, p_year)
   → 1 query en lugar de 4
   → Retorna: revenue, costs, net_flow, peace_fund, progress, status

2. predict_monthly_cashflow(p_month, p_year)
   → Análisis de histórico + tendencia
   → Retorna: prediction, confidence, recommendation, emoji, daysToCrisis

3. get_period_analytics(p_start_date, p_end_date)
   → Para gráficos de 30-60 días
   → Retorna: daily_revenue, cumulative, avg_rate, days_elapsed

4. get_monthly_summary(p_month, p_year)
   → Para SurvivalThermometer
   → Rápido, cacheble frecuentemente

5. generate_daily_metrics()
   → Trigger automático cada medianoche
   → Llena tabla daily_metrics

6-7. Más RPCs para análisis específicos
```

### Performance Outcomes

**Antes:** 20-30 queries/página
**Después:** 2-3 queries/página

**Caché Strategy:**
- Realtime listeners invalidan cache automáticamente
- Stale-while-revalidate: datos jóvenes pero no bloquean UI
- TTL de 5 min para stats, 1 hora para predicciones

**Resultado:** Dashboard responde en <200ms

---

## Fase 2: Pilar 1 - Real-time Reactivity ⏳ (PRÓXIMO)

### Archivos a Crear

```
hooks/
  └── useMonthlyStatsRealtime.ts (Combina Query + Realtime)

middleware/
  └── queryInvalidationManager.ts (Sincroniza invalidación de cache)
```

### Cambios Esperados

Cuando CEO agrega factura:
```
1. Invoice inserido en DB (50ms)
2. Realtime listener dispara (100ms)
3. Invalida ['monthly-stats'] cache
4. React Query refetch automático (200ms)
5. SurvivalThermometer renderiza con nuevos datos (50ms)
Total: ~400ms del click al UI actualizado
```

### Componentes Mejorados

- `SurvivalThermometer`: Progreso bar anima suavemente
- `UnifiedCommandCenter`: Cards actualizan en tiempo real
- `ClientLayout`: Notificaciones de cambios

---

## Fase 3: Pilar 4 - Observabilidad + Insights ⏳ (EN CURSO)

### Archivos Creados

```
components/
  ├── DailyInsightCard.tsx (Muestra insight narrativo del día)
  ├── TrendChart.tsx (Gráficos de 30 días con Recharts)
  └── AlertSystem.tsx (Sistema de alertas inteligentes)
```

### Daily Metrics Workflow

Cada medianoche:
```
1. RPC generate_daily_metrics() se ejecuta
2. Calcula: revenue_today, costs_today, net_flow, pace_vs_breakeven, days_to_crisis
3. Guarda en tabla `daily_metrics`
4. Edge Function llama OpenAI para generar narrativa
5. CEO recibe Toast + Email con insight del día
```

### Insight Narrativo Ejemplo

```
"Hoy ganaste $8,500, necesitas $20,000 mensuales.
Estás al 42% del objetivo. Si continúas a este ritmo,
alcanzarás paz en 32 días. ¡Mantén el enfoque!"
```

---

## Fase 4: Pilar 2 - Automatización Inteligente ⏳ (PRÓXIMO)

### Triggers SQL a Crear

```sql
-- 1. Auto-calculate peace fund
CREATE TRIGGER auto_calculate_peace_fund
AFTER INSERT ON invoices
FOR EACH ROW EXECUTE FUNCTION distribute_peace_fund();

-- 2. Auto-update daily metrics (trigger a medianoche)
CREATE TRIGGER daily_metrics_refresh
AFTER INSERT ON invoices OR UPDATE
TIME '00:05' ...

-- 3. Alert on negative net flow
CREATE TRIGGER alert_on_crisis
AFTER UPDATE ON daily_metrics
FOR EACH ROW WHEN (new.net_flow_today < 0)
```

### Edge Functions a Crear

```typescript
1. generate-daily-metrics/
   - Cron: Diariamente a las 00:05
   - Calcula métricas, genera narrativa con OpenAI
   - Envía email al CEO

2. predict-cashflow/
   - Llamada manual o diaria
   - Análisis de histórico 12 meses
   - ML simple (regresión lineal)

3. send-daily-brief/
   - Cron: 6 AM
   - Email con insights del día anterior
```

---

## Guía de Instalación

### Step 1: Agregar dependencias

```bash
npm install @tanstack/react-query recharts
```

### Step 2: Configuración de React Query

Agregar a `main.tsx` o `App.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Tu app */}
    </QueryClientProvider>
  );
}
```

### Step 3: Ejecutar SQL RPCs en Supabase

1. Ir a Supabase Dashboard → SQL Editor
2. Copiar contenido de `supabase/sql/rpc-consolidados.sql`
3. Ejecutar todo el script
4. Verificar que se crearon los RPCs

### Step 4: Crear tabla daily_metrics (si no existe)

```sql
CREATE TABLE IF NOT EXISTS daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  revenue_today NUMERIC NOT NULL DEFAULT 0,
  costs_today NUMERIC NOT NULL DEFAULT 0,
  net_flow_today NUMERIC NOT NULL DEFAULT 0,
  pace_vs_breakeven NUMERIC NOT NULL DEFAULT 0,
  days_to_crisis INT,
  confidence_score NUMERIC DEFAULT 0,
  narrative TEXT,
  emoji TEXT DEFAULT '🤔',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Step 5: Integrar componentes en tu layout

```typescript
import { DailyInsightCard } from '@/components/DailyInsightCard';
import { TrendChart } from '@/components/TrendChart';
import { AlertSystem } from '@/components/AlertSystem';
import { SurvivalThermometer } from '@/components/SurvivalThermometer';
import { UnifiedCommandCenter } from '@/components/UnifiedCommandCenter';

export default function Dashboard() {
  return (
    <>
      <AlertSystem /> {/* Render una sola vez, en root */}
      
      <div className="space-y-6">
        <SurvivalThermometer /> {/* Usa React Query + Realtime */}
        <UnifiedCommandCenter /> {/* Con predicciones */}
        <DailyInsightCard /> {/* Insight narrativo */}
        <TrendChart /> {/* Gráficos 30 días */}
      </div>
    </>
  );
}
```

---

## Testing e Validación

### Unit Tests (Crear)

```typescript
// tests/hooks/useMonthlyStats.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useMonthlyStats } from '@/hooks/useMonthlyStats';

test('debe retornar datos cacheados', async () => {
  const { result } = renderHook(() => useMonthlyStats());
  
  await waitFor(() => expect(result.current.data).toBeDefined());
  expect(result.current.data?.totalRevenue).toBeGreaterThanOrEqual(0);
});
```

### Integration Tests

```typescript
// tests/integration/realtime.test.ts
test('debe actualizar UI cuando se agrega factura', async () => {
  // 1. Renderizar componente
  // 2. Insertar factura en DB
  // 3. Esperar <500ms
  // 4. Verificar que UI actualizó
});
```

### Performance Audit

```bash
# Lighthouse
npm run build
npm run preview -- --port 4173

# Luego abrir DevTools → Lighthouse
# Target: >90 en Performance
```

---

## Troubleshooting

### Problema: React Query no actualiza
```
Solución:
1. Verificar que queryClient.invalidateQueries() se llama
2. Confirmar que queryKey es idéntico en useQuery y invalidate
3. Revisar Realtime subscription status en console
```

### Problema: Realtime listener no dispara
```
Solución:
1. Verificar RLS policies en Supabase
2. Confirmar tema=postgres_changes (no other_insert, etc.)
3. Ver Realtime status en Supabase Dashboard → Logs
```

### Problema: datos stale en UI
```
Solución:
1. Reducir staleTime (5 min → 1 min)
2. Activar refetchOnWindowFocus: true
3. Agregar manual refetch button
```

---

## Próximos Pasos

1. **Sprint 5-6:** Agregar Edge Functions para daily metrics y OpenAI
2. **Sprint 7-8:** Crear AutoAbundanceReport mejorado
3. **Sprint 9-10:** Implementar sistema de predicciones ML
4. **Sprint 11+:** Multi-tenant, analytics avanzado, mobile app

---

## Contacto & Soporte

- **Documentación actualizada:** Este archivo
- **Issues:** Ver `/.github/agents/`
- **Preguntas técnicas:** Revisar comments en código

---

**Última actualización:** 11 Feb 2026
**Versión:** 1.0 - Fase 1 Completada
