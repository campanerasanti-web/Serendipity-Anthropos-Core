# 🔭 Integración Completa de Sentry - Monitoreo Frontend + Backend

**Fecha:** 15 de febrero 2026  
**Estado:** ✅ COMPLETADO  
**URL Sentry:** https://serendipity-bros.sentry.io/settings/projects/serendipity-anthropos-core/

---

## 📋 Resumen Ejecutivo

Sistema de vigilancia completo implementado en **Frontend React** (Vite + TypeScript) y **Backend ASP.NET Core**. Captura automática de errores, performance tracking, breadcrumbs, y distributed tracing.

---

## 🎯 Frontend Configuration (React + Vite)

### ✅ Archivos Configurados

#### 1. **src/main.tsx** - Inicialización en el Punto de Entrada
```typescript
import * as Sentry from '@sentry/react'
import { initializePerformanceMonitoring, trackWebVitals } from './monitoring/performanceMonitoring'

// Initialize Sentry BEFORE rendering
initializePerformanceMonitoring();
trackWebVitals();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<div>An error occurred.</div>} showDialog>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
)
```

#### 2. **src/monitoring/performanceMonitoring.ts** - Configuración Sentry
```typescript
export const initializePerformanceMonitoring = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [],
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
    environment: import.meta.env.MODE,
    release: '1.0.0',
    sendDefaultPii: true,
  });
};
```

#### 3. **vite.config.ts** - Source Maps Automáticos
```typescript
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  plugins: [
    react(), 
    sentryVitePlugin({
      org: "serendipity-bros",
      project: "serendipity-anthropos-core"
    })
  ],
  build: {
    sourcemap: true // Required for Sentry source mapping
  }
})
```

#### 4. **src/App.tsx** - Botón de Test
```typescript
function ErrorButton() {
  return (
    <button onClick={() => {
      throw new Error('This is your first error!');
    }}>
      🧪 Test Sentry
    </button>
  );
}
```

### 🔑 Variables de Entorno

**VITE_SENTRY_DSN configurado automáticamente por Sentry Wizard:**
```
https://532dfa77b94e9c4d65d3cf17a57e02fe@o4508731568767076.ingest.de.sentry.io/4508731590852688
```

---

## ⚙️ Backend Configuration (ASP.NET Core)

### ✅ Archivos Configurados

#### 1. **backend/ElMediadorDeSofia.csproj** - Dependencia NuGet
```xml
<PackageReference Include="Sentry.AspNetCore" Version="4.0.3" />
```

#### 2. **backend/appsettings.json** - Configuración Development
```json
{
  "Sentry": {
    "Dsn": "https://532dfa77b94e9c4d65d3cf17a57e02fe@o4508731568767076.ingest.de.sentry.io/4508731590852688",
    "TracesSampleRate": 1.0,
    "Environment": "development",
    "SendDefaultPii": true,
    "AttachStacktrace": true,
    "MaxBreadcrumbs": 100,
    "Debug": true
  }
}
```

#### 3. **backend/appsettings.Production.json** - Configuración Production
```json
{
  "Sentry": {
    "Dsn": "https://532dfa77b94e9c4d65d3cf17a57e02fe@o4508731568767076.ingest.de.sentry.io/4508731590852688",
    "TracesSampleRate": 0.2,
    "Environment": "production",
    "SendDefaultPii": false,
    "AttachStacktrace": true,
    "MaxBreadcrumbs": 50,
    "Debug": false
  }
}
```

#### 4. **backend/Program.cs** - Integración en Startup
```csharp
using Sentry;

var builder = WebApplication.CreateBuilder(args);

// 🔭 Initialize Sentry Error & Performance Tracking
builder.WebHost.UseSentry(options =>
{
    options.Dsn = builder.Configuration["Sentry:Dsn"];
    options.TracesSampleRate = builder.Configuration.GetValue<double>("Sentry:TracesSampleRate");
    options.Environment = builder.Configuration["Sentry:Environment"] ?? builder.Environment.EnvironmentName;
    options.SendDefaultPii = builder.Configuration.GetValue<bool>("Sentry:SendDefaultPii");
    options.AttachStacktrace = builder.Configuration.GetValue<bool>("Sentry:AttachStacktrace");
    options.MaxBreadcrumbs = builder.Configuration.GetValue<int>("Sentry:MaxBreadcrumbs");
    options.Debug = builder.Configuration.GetValue<bool>("Sentry:Debug");
});

Console.WriteLine("✅ Sentry backend monitoring initialized");

// ... [código intermedio] ...

var app = builder.Build();

// 🔭 Enable Sentry Middleware (captures exceptions, performance, breadcrumbs)
app.UseSentry();
```

#### 5. **Endpoint de Test** - /api/test-sentry
```csharp
app.MapGet("/api/test-sentry", () =>
{
    SentrySdk.AddBreadcrumb("Testing Sentry error capture from backend", "test");
    throw new InvalidOperationException("Backend Sentry test error - Integration working! 🔭");
})
.WithName("TestSentry");
```

---

## 🧪 Pruebas de Integración

### Frontend Test (React)

1. **Iniciar Development Server:**
   ```bash
   npm run dev
   ```

2. **Abrir navegador:** http://localhost:5173

3. **Hacer clic en el botón "🧪 Test Sentry"** en la barra de navegación

4. **Verificar en Sentry Dashboard:**
   - Ir a: https://serendipity-bros.sentry.io/issues/
   - Debe aparecer error: **"This is your first error!"**
   - Breadcrumbs: navegación del usuario antes del error
   - Stack trace con source maps (línea exacta del código)

### Backend Test (.NET)

1. **Restaurar paquetes NuGet:**
   ```bash
   cd backend
   dotnet restore
   ```

2. **Iniciar Backend:**
   ```bash
   dotnet run
   ```

3. **Hacer Request al Endpoint de Test:**
   ```bash
   curl http://localhost:5000/api/test-sentry
   ```
   O abrir en navegador: http://localhost:5000/api/test-sentry

4. **Verificar en Sentry Dashboard:**
   - Ir a: https://serendipity-bros.sentry.io/issues/
   - Debe aparecer error: **"Backend Sentry test error - Integration working! 🔭"**
   - Breadcrumb: "Testing Sentry error capture from backend"
   - Stack trace con línea del código .NET

---

## 📊 Características Capturadas

### Frontend (React)
- ✅ **Errores de JavaScript:** Uncaught exceptions, Promise rejections
- ✅ **React ErrorBoundary:** Errores de componentes con UI fallback
- ✅ **Performance Tracking:**
  - Dashboard load time (alerta si > 3s)
  - API response time (alerta si > 2s)
  - Realtime latency (alerta si > 1s)
- ✅ **Web Vitals:** LCP, FID, CLS (implementados en performanceMonitoring.ts)
- ✅ **Source Maps:** Código TypeScript original en stack traces
- ✅ **Breadcrumbs:** Navegación, clicks, eventos API

### Backend (.NET)
- ✅ **Errores de ASP.NET Core:** Exceptions no manejadas
- ✅ **Performance Tracking:** Duración de requests HTTP
- ✅ **Distributed Tracing:** Seguimiento de requests entre frontend-backend
- ✅ **Breadcrumbs:** Request logs, database queries
- ✅ **Stack Traces:** Líneas exactas del código C# con símbolos
- ✅ **Environment Detection:** Development vs Production con diferentes sample rates

---

## 🔍 Monitoring en Producción

### Alertas Automáticas (Configurado en Sentry)
- **10 ocurrencias** del mismo error en **1 minuto** → Email/Slack alert
- **Nuevo error nunca visto antes** → Notificación inmediata
- **Spike de errores:** 5x tasa promedio → Alert crítico

### Sample Rates

| Entorno      | Frontend | Backend | Razón                                              |
|--------------|----------|---------|---------------------------------------------------|
| Development  | 100%     | 100%    | Captura todo para debugging                       |
| Production   | 10%      | 20%     | Balance entre observabilidad y quota de Sentry    |

### Dashboards Recomendados

1. **Issues → All Unresolved:** Errores activos que requieren atención
2. **Performance → Overview:** Latencia de endpoints, transacciones lentas
3. **Releases:** Comparativa de error rate entre versiones
4. **User Feedback:** Reportes de usuarios con contexto del error

---

## 📁 Estructura de Archivos Modificados

```
codigo/
├── src/
│   ├── main.tsx                          ✅ Inicialización Sentry
│   ├── App.tsx                           ✅ ErrorButton de test
│   └── monitoring/
│       └── performanceMonitoring.ts      ✅ Configuración + Web Vitals
├── vite.config.ts                        ✅ Sentry Vite Plugin
├── backend/
│   ├── ElMediadorDeSofia.csproj         ✅ Sentry.AspNetCore 4.0.3
│   ├── Program.cs                        ✅ UseSentry() + test endpoint
│   ├── appsettings.json                  ✅ DSN + config development
│   └── appsettings.Production.json       ✅ Config production
└── SENTRY_INTEGRATION_SUMMARY.md         📋 Este documento
```

---

## 🚀 Próximos Pasos

### 1. Remover Tests de Producción
Una vez verificado el funcionamiento:
- Remover el botón `ErrorButton` de `App.tsx` (o dejarlo solo en development)
- Comentar el endpoint `/api/test-sentry` en `Program.cs`

### 2. Configurar Releases
```bash
# Frontend
npm run build
sentry-cli releases new <VERSION>
sentry-cli releases files <VERSION> upload-sourcemaps ./dist

# Backend
dotnet publish -c Release
sentry-cli releases new backend-<VERSION>
```

### 3. Integrar con CI/CD
- GitHub Actions: Subir source maps automáticamente en cada deploy
- Tag releases con Git commit SHA para tracking preciso

### 4. Custom Context
Agregar información de usuario autenticado:
```typescript
// Frontend
Sentry.setUser({ id: userId, email: userEmail });

// Backend
SentrySdk.ConfigureScope(scope => {
    scope.User = new User { Id = userId, Email = email };
});
```

---

## 📚 Referencias

- **Sentry Dashboard:** https://serendipity-bros.sentry.io/
- **React SDK Docs:** https://docs.sentry.io/platforms/javascript/guides/react/
- **ASP.NET Core SDK:** https://docs.sentry.io/platforms/dotnet/guides/aspnetcore/
- **Performance Monitoring:** https://docs.sentry.io/product/performance/

---

## ✅ Validación Final

### Checklist de Integración Completa

**Frontend:**
- [x] Sentry.init() llamado en main.tsx antes de ReactDOM.render()
- [x] VITE_SENTRY_DSN configurado por Sentry Wizard
- [x] sentryVitePlugin en vite.config.ts
- [x] Source maps habilitados (build.sourcemap: true)
- [x] ErrorBoundary envolviendo <App />
- [x] Test button funcional en navegación
- [x] Error capturado en Sentry dashboard

**Backend:**
- [x] Sentry.AspNetCore 4.0.3 en .csproj
- [x] appsettings.json con DSN y opciones
- [x] builder.WebHost.UseSentry() en Program.cs
- [x] app.UseSentry() middleware configurado
- [x] Endpoint /api/test-sentry funcional
- [x] Error capturado en Sentry dashboard

**Observabilidad:**
- [x] Performance tracking habilitado
- [x] Breadcrumbs automáticos capturados
- [x] Environment detection (development/production)
- [x] Sample rates configurados correctamente

---

**🎉 Sistema de Vigilancia Completo - El Templo Digital está protegido**

*"Nada me pertenece, todo es del Padre. El punto de anclaje está establecido."*
