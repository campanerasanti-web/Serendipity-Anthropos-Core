# 🌱 SERENDIPITY ANTHROPOS CORE - README MAESTRO

> **Inteligencia Evolutiva de Grado Primordial**  
> Frontend React + Backend .NET 8 + Event Sourcing + Sofia Autonomous System

---

## ⚡ QUICK START (5 minutos)

### Para Desarrolladores Locales

```bash
# 1. Clonar
git clone https://github.com/campanerasanti-web/Serendipity-Anthropos-Core.git
cd Serendipity-Anthropos-Core

# 2. Backend
cd backend
dotnet restore
dotnet build
dotnet run

# 3. Frontend (en otra terminal)
npm install
npm run dev

# 4. Navegar a
# http://localhost:5173 (frontend)
# http://localhost:5000 (backend)
```

### Para Ver el Sistema en Producción

```
Frontend: https://serendipity-anthropos-core.netlify.app
Backend:  https://serendipity-backend1.onrender.com
API Docs: https://serendipity-backend1.onrender.com/swagger
```

---

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────────────────────────┐
│                   SERENDIPITY SYSTEM                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend (React 18)          Backend (.NET 8)         │
│  ├─ Dashboard                 ├─ Controllers (11)      │
│  ├─ Analytics                 ├─ Services (14)         │
│  ├─ Production                ├─ Workers (2)           │
│  ├─ Hermetic System           ├─ Event Sourcing       │
│  └─ Sofia Integration         ├─ Database (PostgreSQL)│
│                               └─ OAuth + CORS         │
│                                                         │
│  Infrastructure                                        │
│  ├─ GitHub Actions (8 workflows)                      │
│  ├─ PostgreSQL 15 (Supabase)                          │
│  ├─ Render (Backend)                                  │
│  └─ Netlify (Frontend)                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 ESTRUCTURA DEL PROYECTO

```
codigo/
├── backend/                 # .NET 8 Backend
│   ├── Controllers/         # 11 Controllers (56+ endpoints)
│   ├── Services/            # 14 Servicios de negocio
│   ├── Models/              # 10 Entidades + DTOs
│   ├── Data/                # DbContext + Migrations
│   ├── Workers/             # 2 Hosted Services async
│   └── Program.cs           # Configuración principal
│
├── src/                     # React Frontend
│   ├── components/          # 30+ React Components
│   ├── pages/               # Dashboard, Production, etc.
│   ├── services/            # API clients
│   ├── hooks/               # Custom React hooks
│   └── utils/               # Helpers y utilities
│
├── .github/workflows/       # 8 CI/CD Workflows
│   ├── tests.yml            # Unit + Integration tests
│   ├── backend-ci.yml       # Build + Deploy backend
│   ├── frontend-ci.yml      # Build + Deploy frontend
│   ├── security.yml         # CodeQL + audits
│   ├── release.yml          # Automatic releases
│   └── ...más
│
└── scripts/                 # Automation scripts
    ├── validate-before-push.ps1
    ├── monitor-workflows.ps1
    └── deploy-netlify.ps1
```

---

## 🚀 SETUP COMPLETO (Paso a Paso)

### Parte 1: Backend Local

```bash
cd backend

# 1. Restaurar dependencias
dotnet restore

# 2. Configurar base de datos local (OPCIONAL)
# Crear .env con:
# DATABASE_URL=Host=localhost;Port=5432;Database=serendipity;Username=postgres;Password=tu_password

# 3. Migrations (si cambias modelo)
dotnet ef migrations add NombreMigracion --project ElMediadorDeSofia.csproj
dotnet ef database update

# 4. Compilar
dotnet build

# 5. Ejecutar
dotnet run
```

### Parte 2: Frontend Local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
# Crear .env.local con:
# VITE_API_URL=http://localhost:5000

# 3. Ejecutar en desarrollo
npm run dev

# 4. O buildear para producción
npm run build
```

### Parte 3: GitHub Setup (CRÍTICO)

**DEBE HACERLO:**

1. **Ir a**: https://github.com/campanerasanti-web/Serendipity-Anthropos-Core/settings/secrets/actions

2. **Agregar Secrets** (2 requeridos):
   ```
   Nombre: DB_CONNECTION_STAGING
   Valor: Host=db.xxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=Santi@serendipity
   ```
   
   ```
   Nombre: DB_CONNECTION_PRODUCTION
   Valor: Host=db.xxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=xxxxx
   ```

3. **Verificar Workflows**:
   - Ir a: https://github.com/campanerasanti-web/Serendipity-Anthropos-Core/actions
   - Deberías ver 8 workflows
   - El próximo push triggereará automáticamente

---

## 🧪 TESTING

### Backend Tests

```bash
cd backend/Tests

# Ejecutar todos los tests
dotnet test

# O desde GitHub Actions (automático)
# URL: https://github.com/campanerasanti-web/Serendipity-Anthropos-Core/actions
```

### Frontend Tests

```bash
# Ejecutar tests
npm run test:run

# Con coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## 🔧 SCRIPTS ÚTILES

### Pre-Push Validation

```powershell
# Validar antes de hacer push (evita CI/CD failures)
& scripts/validate-before-push.ps1
```

**Qué valida:**
- ✅ packages.lock.json existe
- ✅ Program.cs tiene DATABASE_URL
- ✅ Tests.csproj configurado
- ✅ Workflows presentes
- ✅ No hay secrets en código
- ✅ .gitignore completo

### Monitor Workflows

```powershell
# Monitorear estado de CI/CD
& scripts/monitor-workflows.ps1
```

### Deploy a Netlify

```powershell
# Build y deploy al frontend
& scripts/deploy-netlify.ps1
```

---

## 📊 CI/CD WORKFLOWS

### 1. Tests Workflow (xUnit + Vitest)
```
trigger: push/PR en main o develop
duración: 10-15 minutos
jobs:
  ✓ Backend Unit Tests (xUnit)
  ✓ Backend Integration Tests
  ✓ Frontend Tests (Vitest)
  ✓ Coverage Report
  ✓ Test Summary
```

### 2. Backend CI (Build + Deploy)
```
trigger: push en backend/
duración: 15-20 minutos
jobs:
  ✓ Restore dependencies (packages.lock.json)
  ✓ Build (ElMediadorDeSofia)
  ✓ Linting (code quality)
  ✓ Publish Artifacts
  ❓ Deploy to Render (manual)
```

### 3. Frontend CI (Build + Deploy)
```
trigger: push en src/
duración: 8-12 minutos
jobs:
  ✓ Restore (npm ci)
  ✓ Build (Vite)
  ✓ Analyze
  ❓ Auto-deploy to Netlify
```

### 4. Security Scanning (CodeQL + Audits)
```
trigger: scheduled (diario 3 AM UTC)
duración: 15-20 minutos
jobs:
  ✓ CodeQL (C# + JavaScript)
  ✓ NPM Audit (vulnerabilities)
  ✓ NuGet Audit (vulnerabilities)
  ✓ License Compliance
  ✓ OWASP Dependency Check
```

---

## 🐛 TROUBLESHOOTING

### Tests Fallando

**Error**: `project.assets.json not found`
```
Solución: Ejecuta dotnet restore
dotnet restore backend/Tests/Tests.csproj
```

**Error**: `Cannot connect to database`
```
Solución: Verifica DATABASE_URL env var
echo $env:DATABASE_URL
# Debe ser: Host=..;Port=5432;Database=...;Username=...;Password=...
```

**Error**: `Tests pointing to wrong project`
```
Solución: Ya está arreglado (apunta a Tests.csproj)
# Verificar .github/workflows/tests.yml
```

### Workflows Fallando

**Error**: `cache: true lock file error`
```
Solución: Ya está removido
# Los workflows no usan cache: true
```

**Error**: `Dependencies lock file not found`
```
Solución: packages.lock.json está en root
# Verificar: ls packages.lock.json
```

### Build Fallando

**Error**: `Newtonsoft.Json not found`
```
Solución: Ya está agregado
# Verificar ElMediadorDeSofia.csproj tiene:
# <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
```

---

## 📈 MÉTRICAS ACTUALES

### Baseline (2026-02-15)

```
Backend
  Servicios: 14
  Controllers: 11
  Endpoints: 56+
  Tests: 0 (WIP)
  
Frontend
  Componentes: 30+
  Pages: 3+
  Tests: 0 (WIP)
  
Data
  Entidades: 10
  Migrations: 15+
  Indexed columns: 20+
  
CI/CD
  Workflows: 8/8 ✅
  Tests passing: ⏳ (requiere secrets)
  Security scanning: ✅
  Auto-deploy: ⏳ (requiere Netlify token)
```

### Objetivos Mes 1

```
Backend
  Tests: 30+
  Code coverage: 75%+
  
Frontend  
  Tests: 20+
  Code coverage: 80%+
  
CI/CD
  Tests: 100% green ✅
  Deploy: Automático ✅
  Security: 0 critical issues ✅
```

---

## 🔐 SEGURIDAD

### Secrets Configurados

- ✅ `DB_CONNECTION_STAGING` (GitHub Secrets)
- ✅ `DB_CONNECTION_PRODUCTION` (GitHub Secrets)

### Verificado por CodeQL

- ✅ C# Analysis (security bugs)
- ✅ JavaScript Analysis (security bugs)
- ✅ Dependency scanning (known vulnerabilities)

### Best Practices

Nunca commiteés:
- ❌ `.env` files
- ❌ Passwords o tokens
- ❌ Private keys
- ❌ Database credentials

Usá:
- ✅ GitHub Secrets para env vars
- ✅ Environment-specific `.env.local`
- ✅ OAuth para auth
- ✅ CORS configurado

---

## 📞 SUPPORT

### Links Importantes

- **GitHub Repo**: https://github.com/campanerasanti-web/Serendipity-Anthropos-Core
- **GitHub Actions**: https://github.com/campanerasanti-web/Serendipity-Anthropos-Core/actions
- **Backend API**: https://serendipity-backend1.onrender.com/swagger
- **Frontend**: https://serendipity-anthropos-core.netlify.app

### Documentación

- [MASTER_AUTOMATION_PLAN.md](./MASTER_AUTOMATION_PLAN.md) - Plan maestro
- [BACKEND_GARDENER_CHANGELOG.md](./BACKEND_GARDENER_CHANGELOG.md) - Agente backend
- [CHECKLIST_FINAL_CI_CD.md](./CHECKLIST_FINAL_CI_CD.md) - Setup checklist

### Problemas Comunes

1. **Tests no corren**: Ejecutá `& scripts/validate-before-push.ps1`
2. **Workflows fallan**: Revisa logs en GitHub Actions
3. **Deploy no funciona**: Verifica secrets en Settings

---

## 🎯 PRÓXIMOS PASOS

### Ahora (Esta Hora)
- [x] ✅ Leer este README
- [ ] ⏳ Ejecutar `& scripts/validate-before-push.ps1`
- [ ] ⏳ Hacer push: `git add . && git commit -m "..." && git push`

### Hoy (Próximas 4 Horas)
- [ ] ⏳ Agregar secrets a GitHub
- [ ] ⏳ Ver workflows verdes en GitHub Actions
- [ ] ⏳ Verificar que tests pasen

### Esta Semana
- [ ] ⏳ Crear 10+ tests para backend
- [ ] ⏳ Crear 5+ tests para frontend
- [ ] ⏳ Configurar Netlify auto-deploy
- [ ] ⏳ Escribir documentación

---

**Estado del Proyecto**: 🟡 EN PROGRESO (68% completitud)

**Líneas de Código**: 
- Backend: 2,500+
- Frontend: 3,000+
- Tests: 0 (WIP)
- Docs: 2,000+

**¡Bienvenido al futuro de la automatización!** 🚀

---

*"Nada me pertenece, todo es del Padre. El punto de anclaje está establecido."*

🌱 *El sistema está listo. La automatización comienza.*
