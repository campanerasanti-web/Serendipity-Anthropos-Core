# ⚡ QUICK START - Próximos Pasos Inmediatos

## Lo Que Ya Está Hecho ✅

```
✅ hooks/useMonthlyStats.ts - React Query hook listo
✅ hooks/useRealtimeSubscription.ts - Realtime listeners listos
✅ services/queries.ts - Service layer centralizado
✅ supabase/sql/rpc-consolidados.sql - 7 RPCs optimizados
✅ SurvivalThermometer.tsx.txt - Mejorado con React Query
✅ UnifiedCommandCenter.tsx.txt - Mejorado con predicciones
✅ components/DailyInsightCard.tsx - Insights narrativos
✅ components/TrendChart.tsx - Gráficos de 30 días
✅ components/AlertSystem.tsx - Alertas inteligentes
✅ IMPLEMENTATION_GUIDE.md - Documentación completa
✅ STATUS_REPORT.md - Reporte de estado
✅ ARCHITECTURE.md - Diagrama de arquitectura
```

---

## HOY - Próximas 2 Horas

### 1️⃣ Instalar Dependencias (15 min)

```bash
npm install @tanstack/react-query recharts @tanstack/react-query-devtools
```

**O** si tienes package.json viejo, usar las versiones del recomendado:
```bash
npm install @tanstack/react-query@5.28.0 recharts@2.10.0
```

### 2️⃣ Ejecutar RPCs en Supabase (10 min)

1. Ir a: https://app.supabase.com → Tu proyecto → SQL Editor
2. Click "New Query"
3. Copiar todo el contenido de: `supabase/sql/rpc-consolidados.sql`
4. Pegar en el editor
5. Click "RUN" (botón verde arriba a la derecha)
6. Esperar a que compilar (30 segundos)
7. Verás "7 functions created" al final

**Verificación:**
- Ir a "Database" → "Functions" 
- Deberías ver los 7 RPCs listados

### 3️⃣ Agregar QueryClientProvider (20 min)

En tu `main.tsx` o `App.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Crear una sola instancia (fuera del componente)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutos
      gcTime: 30 * 60 * 1000,           // 30 minutos
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Tu app aquí */}
      <YourRoutes />
    </QueryClientProvider>
  );
}
```

### 4️⃣ Actualizar Componentes de Dashboard (15 min)

Donde renderices el dashboard:

```typescript
import { SurvivalThermometer } from '@/components/SurvivalThermometer';
import { UnifiedCommandCenter } from '@/components/UnifiedCommandCenter';
import { DailyInsightCard } from '@/components/DailyInsightCard';
import { TrendChart } from '@/components/TrendChart';
import { AlertSystem } from '@/components/AlertSystem';

export function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Esto renderiza UNA SOLA VEZ en root */}
      <AlertSystem />
      
      {/* Estos componentes están listos */}
      <SurvivalThermometer />
      <UnifiedCommandCenter />
      <DailyInsightCard />
      <TrendChart />
    </div>
  );
}
```

### 5️⃣ Probar que Todo Funcione (20 min)

```bash
npm run dev
```

**Checklist:**
- [ ] Dashboard carga sin errores
- [ ] No hay 404 en console
- [ ] React Query DevTools muestra queries cacheadas
- [ ] SurvivalThermometer muestra números
- [ ] UnifiedCommandCenter muestra 4 cards

---

## MAÑANA - Sprint Siguiente

### Crear Tabla `daily_metrics`

Esto es necesario para que DailyInsightCard funcione:

```sql
-- En Supabase SQL Editor
CREATE TABLE IF NOT EXISTS daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  revenue_today NUMERIC NOT NULL DEFAULT 0,
  costs_today NUMERIC NOT NULL DEFAULT 0,
  net_flow_today NUMERIC NOT NULL DEFAULT 0,
  pace_vs_breakeven NUMERIC NOT NULL DEFAULT 0,
  days_to_crisis INT,
  confidence_score NUMERIC DEFAULT 85,
  narrative TEXT,
  emoji TEXT DEFAULT '🤔',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_daily_metrics_date ON daily_metrics(date);
```

Luego insertar dato de hoy para testing:

```sql
INSERT INTO daily_metrics (
  date, 
  revenue_today, 
  costs_today, 
  pace_vs_breakeven, 
  confidence_score,
  narrative,
  emoji
) VALUES (
  CURRENT_DATE,
  8500,      -- revenue del día
  20000,     -- costos mensuales
  42.5,      -- % del objetivo
  85,        -- confianza
  'Hoy ganaste $8,500. Estás al 42% del objetivo. ¡Mantén el ritmo!',
  '🟡'
);
```

---

## ESTA SEMANA - Testing

### Test 1: Verifica que React Query caché funciona

```typescript
// En DevTools → Vieja tab → Performance
// Abre dashboard 10 veces en 5 minutos
// Deberías ver: 1 red query, 9 cache hits
// ✅ Si ves esto, caché funciona
```

### Test 2: Verifica que Realtime funciona

```bash
# Terminal 1: npm run dev

# Terminal 2: 
# Abre Supabase Dashboard
# Inserta una factura manualmente en tabla invoices
# Mira el dashboard en Terminal 1
# ✅ Si la métrica sube sin refetch, realtime funciona
```

### Test 3: Verifica Performance

```bash
# Lighthouse en Chrome DevTools
# Performance: >90 (target: 95)
# Accessibility: >95
# Security: >95
# SEO: >90
```

---

## PRÓXIMAS 2 SEMANAS - Completar Fase 2

### Priority 1: Edge Function para Daily Metrics

```typescript
// Crear: supabase/functions/generate-daily-metrics/index.ts
// Esta función se ejecuta cada medianoche
// Actualiza daily_metrics con narrativa generada por OpenAI
```

### Priority 2: Setup Cron en Supabase

```
Ir a: Supabase Dashboard → Cron Jobs
Crear: generate-daily-metrics (00:05 UTC)
```

### Priority 3: Email Notifications

```typescript
// Crear: supabase/functions/send-daily-brief/index.ts
// Envía email al CEO cada mañana con resumen
// Usa Resend API
```

---

## Troubleshooting Rápido

### Error: "useMonthlyStats is not exported"

```
✅ Solución: Verificar que archivo existe
  ls hooks/useMonthlyStats.ts
```

### Error: "RPC not found"

```
✅ Solución: 
1. Verificar que SQL se ejecutó sin errores en Supabase
2. Refrescar página (Cmd+Shift+R)
3. Ir a Supabase → Database → Functions, buscar get_unified_dashboard
```

### Dashboard lento

```
✅ Solución:
1. Abrir DevTools → Network
2. Verificar que queries son <300ms
3. Si >500ms, mejorar índices en DB
4. Si realtime listeners causan lag, aumentar staleTime
```

### Realtime no actualiza

```
✅ Solución:
1. Verificar RLS en Supabase
   - Ir a: Security Policies
   - Confirmar que tabla tiene política SELECT para tu rol
2. Revisar consola del navegador → errors
3. Probar desde Supabase Studio directamente
```

---

## KPIs a Monitorear

Después de implementar, revisa estos números semanalmente:

| Métrica | Target | Cómo Medir |
|---------|--------|-----------|
| Dashboard load time | <300ms | DevTools → Network |
| Cache hit rate | >70% | React Query DevTools |
| Realtime latency | <500ms | Insertar factura, medir delay |
| Error rate | <1% | Supabase Dashboard → Logs |
| Network bandwidth | <3MB/page | DevTools → Network → Total |

---

## Stack Final

```
Frontend:
✅ React 18
✅ TypeScript
✅ Tailwind CSS
✅ React Router v6
✅ React Query (TanStack)
✅ Recharts
✅ i18next (3 idiomas)
✅ Sonner (notifications)
✅ Lucide React (icons)

Backend:
✅ Supabase (PostgreSQL)
✅ Realtime WebSocket
✅ Row Level Security (RLS)
✅ 7 RPCs consolidados
✅ Edge Functions (Deno) - próximo

Hosting:
✅ Supabase (DB)
✅ Vercel/Netlify (Frontend)
```

---

## Support & Docs

📖 **Full Documentation:**
- `IMPLEMENTATION_GUIDE.md` - Paso a paso completo
- `ARCHITECTURE.md` - Diagramas y flujos
- `STATUS_REPORT.md` - Estado actual
- Comments en código - inline docs

💬 **Questions?**
- Revisar `supabase/sql/rpc-consolidados.sql` comments
- Ver enunciados en hooks
- Ejecutar tests

---

## Próximo Milestone

```
🎯 META: Código Totalmente Vivo y Dinámico

          COMPLETADO        PRÓXIMO
            |                  |
Pilar 3 ✅  |  Pilar 1 ⏳       |  Pilar 4 ⏳      |  Pilar 2 ⏳
Caché    Query  Real-time   Observability  Automation
         opt.   Listeners   + Insights     + ML

Semana:   1-4     5-7         8-10         11-16
```

---

## Cheat Sheet

```bash
# Ver status de tu proyecto
npm list @tanstack/react-query

# Validar SQL en Supabase
SELECT * FROM pg_catalog.pg_proc WHERE proname LIKE 'get_unified%'

# Limpiar cache de React Query
const queryClient = useQueryClient();
queryClient.clear();

# Ver realtime logs
Supabase Dashboard → Logs → Realtime tab

# Rebuild después de cambios
npm run build && npm run preview
```

---

## ¡Listo para Comenzar! 🚀

Sigue los pasos de HOY, prueba mañana, y para el fin de semana 
tendrás un dashboard completamente funcional, vivo y dinámico.

**Tiempo total:** ~2 horas hoy + testing

**Resultado:** Dashboard que responde en <500ms sin refetch manual

---

**Fecha:** 11 Feb 2026
**Versión:** 1.0 Ready
**Status:** 🟢 GO
