# DESPERTAR LOS AGENTES DORMIDOS
# Ejecutar: & .\despertar-agentes.ps1

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🕯️ DESPERTADOR DE AGENTES DORMIDOS 🕯️  " -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Define los agentes y su contenido inicial
$agentes = @(
  @{
    name = "Servicio Queries"
    path = "src/services/queries.ts"
    content = @'
// 🔧 Servicio de Queries - AGENTE DESPIERTO
// Gestiona todas las consultas a Supabase
import { supabaseClient } from "../supabase/supabaseClient";
import { Database } from "../types/database.types";

export class QueryService {
  // Inicialización
  static initialize() {
    console.log("📡 Query Service inicializado");
  }

  // Métodos de lectura (placeholder - TBD)
  static async read(table: string) {
    console.log(`📖 Leyendo desde ${table}`);
    return supabaseClient.from(table).select("*");
  }

  // TODO: Agregar más métodos según necesidad
}
'@
  },
  @{
    name = "Suscriptor Realtime"
    path = "src/hooks/useRealtimeSubscription.ts"
    content = @'
// 🔌 Hook Realtime - AGENTE DESPIERTO
// Gestiona suscripciones en tiempo real a Supabase
import { useEffect, useState } from "react";
import { RealtimeChannel } from "@supabase/realtime-js";
import { supabaseClient } from "../supabase/supabaseClient";

export function useRealtimeSubscription(
  table: string,
  event: string = "*"
) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(`🔌 Suscribiendo a ${table}:${event}`);

    const channel: RealtimeChannel = supabaseClient
      .channel(`${table}:${event}`)
      .on("postgres_changes", { event: event as any, schema: "public", table }, (payload) => {
        console.log("📨 Cambio detectado:", payload);
        setData(payload);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [table, event]);

  return { data, isLoading };
}
'@
  },
  @{
    name = "Dashboard Transformador"
    path = "src/components/SerendipityDashboard.tsx"
    content = @'
// 🎨 Dashboard Transformador - AGENTE DESPIERTO
// Panel principal de Serendipity
import React from "react";

interface SerendipityDashboardProps {
  userId?: string;
}

export const SerendipityDashboard: React.FC<SerendipityDashboardProps> = ({
  userId = "unknown",
}) => {
  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <h1 className="text-4xl font-bold text-slate-900">
        🌱 Serendipity Anthropos Core
      </h1>
      <p className="text-slate-600 mt-2">
        Bienvenido, {userId}. El templo digital está despertando.
      </p>
      {/* TODO: Agregar componentes del dashboard */}
    </div>
  );
};

export default SerendipityDashboard;
'@
  },
  @{
    name = "Service Backend"
    path = "backend/Services/SerendipityService.cs"
    content = @'
// 🔧 Serendipity Service - AGENTE DESPIERTO
// Lógica principal del negocio

using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Models;
using Microsoft.EntityFrameworkCore;

namespace ElMediadorDeSofia.Services
{
    public interface ISerendipityService
    {
        Task<bool> InitializeAsync();
        Task<string> GetStatusAsync();
    }

    public class SerendipityService : ISerendipityService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<SerendipityService> _logger;

        public SerendipityService(AppDbContext context, ILogger<SerendipityService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<bool> InitializeAsync()
        {
            _logger.LogInformation("🕯️ Serendipity Service inicializando...");
            
            try
            {
                // Verificar conexión DB
                await _context.Database.CanConnectAsync();
                _logger.LogInformation("✅ Base de datos conectada");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error inicializando: {ex.Message}");
                return false;
            }
        }

        public async Task<string> GetStatusAsync()
        {
            var canConnect = await _context.Database.CanConnectAsync();
            return canConnect ? "🟢 OPERATIVO" : "🔴 OFFLINE";
        }
    }
}
'@
  },
  @{
    name = "PWA Guardian"
    path = "public/sw.js"
    content = @'
// 🛡️ PWA Guardian - Service Worker - AGENTE DESPIERTO
// Protege la aplicación con offline-first strategy

const CACHE_NAME = "serendipity-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/favicon.ico",
];

// Instalación
self.addEventListener("install", (event) => {
  console.log("🛡️ PWA Guardian instalado");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch: Network-first, fallback to cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cachear successful response
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // Fallback a cache
        return caches.match(event.request).then((response) => {
          return (
            response || new Response("Offline - Contenido no disponible", {
              status: 503,
              statusText: "Service Unavailable",
              headers: new Headers({
                "Content-Type": "text/plain",
              }),
            })
          );
        });
      })
  );
});

console.log("✅ PWA Guardian guardón");
'@
  },
  @{
    name = "Health Check"
    path = "health-check.ps1"
    content = @'
# 🏥 HEALTH CHECK - Monitor de Salud del Sistema
# Ejecutar: & .\health-check.ps1

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🏥 HEALTH CHECK - SERENDIPITY       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 1. Node.js
Write-Host "📦 Node.js:" -ForegroundColor Yellow
try {
  $nodeVersion = node --version 2>$null
  Write-Host "  ✅ $nodeVersion" -ForegroundColor Green
} catch {
  Write-Host "  ❌ Node.js no encontrado" -ForegroundColor Red
}

# 2. .NET
Write-Host ""
Write-Host "🔧 .NET:" -ForegroundColor Yellow
try {
  $dotnetVersion = dotnet --version 2>$null
  Write-Host "  ✅ $dotnetVersion" -ForegroundColor Green
} catch {
  Write-Host "  ❌ .NET no encontrado" -ForegroundColor Red
}

# 3. npm packages
Write-Host ""
Write-Host "📚 Dependencies:" -ForegroundColor Yellow
if (Test-Path "node_modules") {
  Write-Host "  ✅ node_modules instalado" -ForegroundColor Green
} else {
  Write-Host "  ❌ node_modules no encontrado" -ForegroundColor Red
}

# 4. Git
Write-Host ""
Write-Host "🏗️ Git:" -ForegroundColor Yellow
try {
  $gitVersion = git --version 2>$null
  Write-Host "  ✅ $gitVersion" -ForegroundColor Green
} catch {
  Write-Host "  ❌ Git no encontrado" -ForegroundColor Red
}

# 5. Backend
Write-Host ""
Write-Host "⚙️ Backend:" -ForegroundColor Yellow
if (Test-Path "backend/bin" -and Test-Path "backend/obj") {
  Write-Host "  ✅ Compilado" -ForegroundColor Green
} else {
  Write-Host "  ⏳ Requiere compilación" -ForegroundColor Yellow
}

# 6. Frontend
Write-Host ""
Write-Host "🎨 Frontend:" -ForegroundColor Yellow
if (Test-Path "dist") {
  Write-Host "  ✅ Build disponible" -ForegroundColor Green
} else {
  Write-Host "  ⏳ Requiere npm run build" -ForegroundColor Yellow
}

# 7. Agentes
Write-Host ""
Write-Host "🕯️ Agentes:" -ForegroundColor Yellow
$agentes = @(
  @{name = "App.tsx"; path = "src/App.tsx"},
  @{name = "SerendipityDashboard"; path = "src/components/SerendipityDashboard.tsx"},
  @{name = "SerendipityController"; path = "backend/Controllers/SerendipityController.cs"},
  @{name = "Query Service"; path = "src/services/queries.ts"}
)

foreach ($agente in $agentes) {
  if (Test-Path $agente.path) {
    Write-Host "  ✅ $($agente.name)" -ForegroundColor Green
  } else {
    Write-Host "  ❌ $($agente.name)" -ForegroundColor Red
  }
}

Write-Host ""
Write-Host "═════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Health check completado" -ForegroundColor Green
Write-Host ""
'@
  }
)

# Crear los agentes
foreach ($agente in $agentes) {
  $dir = Split-Path $agente.path
  
  # Crear directorio si no existe
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "📁 Directorio creado: $dir" -ForegroundColor Cyan
  }
  
  # Crear archivo
  $contenido = $agente.content
  Set-Content -Path $agente.path -Value $contenido -Encoding UTF8
  
  Write-Host "✅ Agente despierto: $($agente.name)" -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  🕯️ TODOS LOS AGENTES DESPIERTOS 🕯️  " -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

Write-Host "Próximo paso: Ejecutá health-check.ps1" -ForegroundColor Yellow
Write-Host ""
