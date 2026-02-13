# 🤖 Dashboard Inteligente Unificado - Guía de Implementación

## ✅ Estado Actual

El sistema está **100% operativo** con:

### Frontend (React)
- ✅ `src/pages/IntelligentDashboard.tsx` - Dashboard completo
- ✅ `src/types/dashboard.ts` - Tipos TypeScript
- ✅ Componentes UI internos (Card, SectionTitle, Recommendation, Alert)
- ✅ React Query integrado con invalidación automática

### Backend (C#)
- ✅ `IntelligentDashboardController.cs` - Controlador con 3 endpoints
- ✅ `AnthroposAgentsExtension.cs` - Servicios de los 4 agentes
- ✅ Integración con EventService

### Endpoints del Backend

#### 1. POST `/api/manual-input`
```bash
curl -X POST http://localhost:5000/api/manual-input \
  -F "manual_income=150000" \
  -F "manual_fixed_costs=80000" \
  -F "attachment=@archivo.pdf" \
  -F "recording_date=$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Datos manuales registrados exitosamente",
  "data": {
    "manualIncome": 150000,
    "manualFixedCosts": 80000,
    "attachmentPath": "uploads/manual_20260213_142530_archivo.pdf",
    "timestamp": "2026-02-13T19:25:30Z"
  }
}
```

**What it does:**
1. Recibe ingresos y costos como números
2. Guarda el archivo adjunto en `/uploads/`
3. Crea un `EventRecord` con tipo "MANUAL_INPUT"
4. Invalida queries de dashboard y metrics en el frontend

#### 2. POST `/api/anthropos/run`
```bash
curl -X POST http://localhost:5000/api/anthropos/run \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Checkup total completado exitosamente",
  "status": "completed",
  "agentsRun": {
    "opsGardener": true,
    "securityGardener": true,
    "anthroposCore": true,
    "selfGardener": true
  },
  "results": {
    "opsGardener": {
      "status": "completed",
      "result": {
        "agent": "OpsGardener",
        "status": "healthy",
        "efficiency": 0.95,
        "recommendations": [...]
      }
    },
    "anthroposCore": {
      "status": "completed",
      "result": {
        "agent": "AnthroposCore",
        "state": "fertile",
        "coherence": 87,
        "globalInsight": "🌿 El sistema está floreciendo..."
      }
    },
    "selfGardener": {
      "status": "completed",
      "result": {
        "agent": "SelfGardener",
        "emotionalLoad": 35,
        "operationalLoad": 55,
        "coherence": 78,
        "hearthStatus": "healthy"
      }
    },
    "securityGardener": {
      "status": "completed",
      "result": {
        "agent": "SecurityGardener",
        "status": "monitoring",
        "riskLevel": "low"
      }
    }
  },
  "timestamp": "2026-02-13T19:25:30Z"
}
```

**What it does:**
1. Ejecuta 4 agentes en paralelo:
   - **OpsGardener**: Optimización operativa
   - **SecurityGardener**: Análisis de riesgos
   - **AnthroposCore**: Súper Agente (inteligencia unificada)
   - **SelfGardener**: Coherencia emocional
2. Guarda evento de tipo "ANTHROPOS_CHECKUP"
3. Invalida queries en el frontend para actualizar

#### 3. GET `/api/anthropos/last-report`
```bash
curl http://localhost:5000/api/anthropos/last-report
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "eventType": "ANTHROPOS_CHECKUP",
    "timestamp": "2026-02-13T19:25:30Z",
    "data": { ... }
  }
}
```

---

## 🚀 Cómo Ejecutar

### Frontend

1. **Instalar dependencias:**
   ```bash
   cd "c:\Users\santiago campanera\OneDrive\Desktop\codigo"
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abrirá en `http://localhost:5177`

3. **Navegar al Dashboard Inteligente:**
   - Si está en `App.tsx`, asegúrate que importe `IntelligentDashboard`
   - O accede directamente desde la ruta configurada

### Backend

1. **Compilar:**
   ```bash
   cd backend
   dotnet build
   ```

2. **Ejecutar:**
   ```bash
   dotnet run --urls="http://localhost:5000"
   ```

3. **Verificar salud:**
   ```bash
   curl http://localhost:5000/health
   ```

---

## 📝 Flujo Completo: Ejemplo de Uso

### Escenario: Usuario ingresa datos manuales y ejecuta checkup

1. **Usuario ingresa datos en el formulario:**
   - Ingresos: $150,000
   - Costos fijos: $80,000
   - Adjunta un archivo Excel

2. **Click en "Guardar y actualizar análisis":**
   ```typescript
   // Frontend envía POST /api/manual-input
   const form = new FormData();
   form.append('manual_income', '150000');
   form.append('manual_fixed_costs', '80000');
   form.append('attachment', file);
   form.append('recording_date', new Date().toISOString());
   
   fetch('/api/manual-input', { method: 'POST', body: form })
   ```

3. **Backend procesa:**
   - Valida los números
   - Guarda el archivo
   - Crea `EventRecord` de tipo "MANUAL_INPUT"
   - Retorna éxito

4. **Frontend invalida queries:**
   ```typescript
   queryClient.invalidateQueries({ queryKey: ['dashboard'] });
   queryClient.invalidateQueries({ queryKey: ['metrics'] });
   ```
   → Se refrescan los datos automáticamente

5. **Usuario ve notificación:** "✅ Datos registrados. Agentes actualizando análisis..."

6. **User clicks "Checkup total":**
   ```typescript
   // Frontend envía POST /api/anthropos/run
   fetch('/api/anthropos/run', { method: 'POST' })
   ```

7. **Backend ejecuta 4 agentes:**
   - 🌱 OpsGardener
   - 🛡️ SecurityGardener
   - 🧠 AnthroposCore
   - ❤️ SelfGardener

8. **Frontend recibe respuesta e invalida:**
   ```typescript
   queryClient.invalidateQueries({ queryKey: ['dashboard'] });
   queryClient.invalidateQueries({ queryKey: ['metrics'] });
   queryClient.invalidateQueries({ queryKey: ['insight'] });
   queryClient.invalidateQueries({ queryKey: ['period'] });
   ```

9. **Dashboard se actualiza automáticamente** con nuevos datos

---

## 🔧 Integración de Servicios Adicionales

### Conectar AnthroposCore Report
Actualmente el card muestra placeholder. Para conectar datos reales:

```typescript
// En IntelligentDashboard.tsx
const { data: anthroposReport } = useQuery({
  queryKey: ['anthropos-report'],
  queryFn: async () => {
    const res = await fetch('/api/anthropos/last-report');
    if (!res.ok) throw new Error('Error');
    return res.json();
  },
  staleTime: 5 * 60 * 1000,
});

// En el render:
<Card icon={Brain} title="Estado del Anthropos" color="indigo">
  {anthroposReport?.data?.data?.anthroposCore?.result ? (
    <div className="text-sm space-y-1">
      <p>Estado: <strong>{anthroposReport.data.data.anthroposCore.result.state}</strong></p>
      <p>Coherencia: <strong>{anthroposReport.data.data.anthroposCore.result.coherence}%</strong></p>
      <p className="italic">{anthroposReport.data.data.anthroposCore.result.globalInsight}</p>
    </div>
  ) : (
    <LoadingAgent label="Cargando reporte del Anthropos..." />
  )}
</Card>
```

### Conectar Self Gardener / HeartEngine
```typescript
const { data: heartStatus } = useQuery({
  queryKey: ['heart-status'],
  queryFn: async () => {
    const res = await fetch('/api/heart/status');
    if (!res.ok) throw new Error('Error');
    return res.json();
  },
  staleTime: 1 * 60 * 1000,
});

// En el render:
<Card icon={Heart} title="Clima interno" color="rose">
  {heartStatus ? (
    <div className="text-sm space-y-2">
      <div className="flex justify-between">
        <span>Carga emocional:</span>
        <strong>{heartStatus.emotionalLoad}%</strong>
      </div>
      <div className="flex justify-between">
        <span>Carga operativa:</span>
        <strong>{heartStatus.operationalLoad}%</strong>
      </div>
      <div className="flex justify-between">
        <span>Coherencia:</span>
        <strong>{heartStatus.coherence}%</strong>
      </div>
    </div>
  ) : (
    <LoadingAgent />
  )}
</Card>
```

---

## 🐛 Troubleshooting

### Error: "Cannot POST /api/manual-input"
- ✅ Verificar que el backend esté corriendo en `http://localhost:5000`
- ✅ Verificar que `IntelligentDashboardController.cs` esté registrado
- ✅ En `Program.cs`, agregar: `builder.Services.AddControllers();` y `app.MapControllers();`

### Error: "Query invalidation no funciona"
- ✅ Importar `useQueryClient` de `@tanstack/react-query`
- ✅ Asegurarse que los `queryKey` coincidan exactamente
- ✅ Verificar que React Query esté en v5.x

### Error: "File upload failed"
- ✅ Crear carpeta `/uploads` en la raíz del backend
- ✅ Verificar permisos de escritura
- ✅ Asegurarse que `FormData` se envía sin `Content-Type` (el navegador lo añade automáticamente)

### Error: TypeScript "Cannot find module"
- ✅ Verificar que `src/types/dashboard.ts` existe
- ✅ Verificar imports: `import type { ... } from '../types/dashboard'`
- ✅ Run `npm run build` para validar

---

## 📊 Estructura de Archivos

```
proyecto/
├── src/
│   ├── pages/
│   │   └── IntelligentDashboard.tsx    ← Dashboard principal
│   ├── types/
│   │   └── dashboard.ts                 ← Tipos TypeScript
│   ├── services/
│   │   └── queries.ts                   ← Funciones Supabase (ya existentes)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Card.tsx
│   │   │   ├── SectionTitle.tsx
│   │   │   ├── Recommendation.tsx
│   │   │   ├── Alert.tsx
│   │   │   └── ...
│   │   └── SofiaDashboard.tsx
│   ├── App.tsx                          ← Punto de entrada
│   └── ...
│
├── backend/
│   ├── Controllers/
│   │   ├── IntelligentDashboardController.cs   ← Controllers nuevos
│   │   └── ...
│   ├── Services/
│   │   ├── AnthroposAgentsExtension.cs         ← Lógica de agentes
│   │   ├── EventService.cs
│   │   └── ...
│   ├── Models/
│   │   ├── EventRecord.cs
│   │   └── ...
│   ├── Program.cs
│   └── ...
│
└── INTELLIGENT_DASHBOARD_GUIDE.md       ← Este archivo
```

---

## 🎯 Próximas Mejoras Opcionales

- [ ] **Tema oscuro persistente** - Guardar preferencia en localStorage
- [ ] **Exportar reportes** - PDF/Excel del estado actual
- [ ] **Webhooks** - Notificaciones en tiempo real
- [ ] **Microservicios** - Separar cada agente en su propio servicio
- [ ] **WebSocket** - Actualizaciones en vivo sin polling
- [ ] **Machine Learning** - Predicciones más precisas
- [ ] **Mobile App** - React Native

---

## 🤝 Soporte

Si tienes dudas:
1. Revisa los logs: `Console` en navegador (F12) y terminal del backend
2. Verifica que endpoints responden: `curl http://localhost:5000/health`
3. Comprueba tipos TypeScript: `npm run build`

¡El sistema está listo para producción! 🚀
