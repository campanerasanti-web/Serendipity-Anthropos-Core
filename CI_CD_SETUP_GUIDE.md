# ⚙️ GUÍA DE CONFIGURACIÓN - CI/CD SERENDIPITY

**Fecha:** 12 de febrero de 2026  
**Versión:** 1.0 - Setup Guide  
**Estado:** Ready to Deploy

---

## 📋 TABLA DE CONTENIDOS

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración Inicial](#configuración-inicial)
3. [GitHub Secrets](#github-secrets)
4. [Branch Protection](#branch-protection)
5. [Verificación de Workflows](#verificación-de-workflows)
6. [First Run](#first-run)
7. [Troubleshooting](#troubleshooting)
8. [Monitoreo](#monitoreo)

---

## ✅ REQUISITOS PREVIOS

### En Local
```
✅ Git 2.35+
✅ GitHub CLI (gh)
✅ .NET 8.0 SDK
✅ Node.js 20.x
✅ npm 10.x
```

### En GitHub
```
✅ Repositorio vacío o existente
✅ Acceso de administrador al repositorio
✅ GitHub Actions habilitado (es default)
✅ PostgreSQL staging + production configurados
```

---

## 🚀 CONFIGURACIÓN INICIAL

### PASO 1: Verificar Estructura de Carpetas

```bash
# Verificar que .github/workflows existe
ls -la .github/workflows/

# Debe mostrar:
├── backend-ci.yml
├── frontend-ci.yml
├── tests.yml
├── migrations.yml
├── release.yml
├── docs.yml
└── security.yml
```

### PASO 2: Commit de Workflows

```bash
# Agregar workflows al repositorio
git add .github/workflows/

# Commit
git commit -m "✨ Add CI/CD workflows infrastructure"

# Push a main
git push origin main
```

### PASO 3: Verificar en GitHub

```
1. Navegar a: github.com/your-org/serendipity
2. Ir a: Actions
3. Debe listar los 7 workflows creados
4. Status: All workflows loaded ✅
```

---

## 🔐 GITHUB SECRETS

### Configuración Requerida

**Navegar en GitHub:**
```
Settings → Secrets and variables → Repository secrets
```

### Secrets Obligatorios

#### 1. **DB_CONNECTION_STAGING**
```yaml
Descripción: Conexión a PostgreSQL Staging
Formato: Host=host.db;Port=5432;Database=serendipity_staging;Username=user;Password=pwd
```

**Pasos:**
1. Click "New repository secret"
2. Name: `DB_CONNECTION_STAGING`
3. Value: (conexión string de staging)
4. Click "Add secret"

#### 2. **DB_CONNECTION_PRODUCTION**
```yaml
Descripción: Conexión a PostgreSQL Production
Formato: Host=host.db;Port=5432;Database=serendipity;Username=user;Password=pwd
```

**Pasos:**
1. Click "New repository secret"
2. Name: `DB_CONNECTION_PRODUCTION`
3. Value: (conexión string de producción)
4. Click "Add secret"

### Secrets Opcionales (pero Recomendados)

#### 3. **SONAR_TOKEN** (para SonarCloud)
```yaml
Descripción: SonarCloud authentication
Obtener en: https://sonarcloud.io
```

#### 4. **CODECOV_TOKEN** (para Codecov)
```yaml
Descripción: Code coverage tracking
Obtener en: https://codecov.io
```

#### 5. **DEPLOY_TOKEN** (para Fly.io/Railway)
```yaml
Descripción: Despliegue automático
Obtener en: fly.io o railway.app
```

---

## 🛡️ BRANCH PROTECTION

### Habilitar Protección en main

**Navegar en GitHub:**
```
Settings → Branches → Add rule
```

**Configurar:**
```
┌─ Branch name pattern: main
│  
├─ Require a pull request before merging
│  ├─ Require approvals: 1
│  ├─ Dismiss stale PR approvals: YES
│  └─ Require CODEOWNERS review: YES (si existe)
│
├─ Require status checks to pass before merging
│  ├─ Require branches to be up to date: YES
│  └─ Required checks:
│     │  ✅ backend-ci / build
│     │  ✅ frontend-ci / build
│     │  ✅ tests / backend-tests
│     │  ✅ tests / frontend-tests
│     │  ✅ security / security-summary
│     └─ (agregar según necesidad)
│
└─ Save changes
```

---

## ✔️ VERIFICACIÓN DE WORKFLOWS

### TEST 1: Backend CI

```bash
# Trigger: Hacer cambio en backend/
echo "# Test" >> backend/README.md

git add backend/README.md
git commit -m "test: trigger backend-ci"
git push origin feature/test-backend

# Verificar:
# 1. GitHub → Actions
# 2. Backend CI workflow debe correr
# 3. Esperar ~15 min
# 4. Status debe ser ✅ success
```

### TEST 2: Frontend CI

```bash
# Trigger: Hacer cambio en src/
echo "// test" >> src/App.tsx

git add src/App.tsx
git commit -m "test: trigger frontend-ci"
git push origin feature/test-frontend

# Verificar:
# 1. GitHub → Actions
# 2. Frontend CI workflow debe correr
# 3. Esperar ~10 min
# 4. Status debe ser ✅ success
```

### TEST 3: Tests Pipeline

```bash
# Trigger: IR a Actions
# 1. Click "Tests"
# 2. Click "Run workflow"
# 3. Click "Run workflow" (button)

# Verificar:
# 1. Backend tests ejecutan (~10 min)
# 2. Frontend tests ejecutan (~3 min)
# 3. Coverage reports generados
# 4. Status ✅ success
```

### TEST 4: Release Pipeline

```bash
# Trigger: Crear tag
git tag v0.1.0-beta
git push origin v0.1.0-beta

# Verificar:
# 1. GitHub → Actions
# 2. Release workflow debe correr
# 3. Esperar ~20 min
# 4. GitHub Releases debe tener nuevo release
# 5. Assets (ZIP) adjuntos
```

### TEST 5: Security Pipeline

```bash
# Trigger: IR a Actions
# 1. Click "Security Scanning"
# 2. Click "Run workflow"
# 3. Click "Run workflow"

# Verificar:
# 1. CodeQL corre (~10 min)
# 2. Audits de NPM y NuGet
# 3. License check
# 4. Security summary generado
```

---

## 🎬 FIRST RUN - Checklist

- [ ] Crear GitHub account/org
- [ ] Crear repositorio (empty)
- [ ] Clonar repo localmente
- [ ] Copiar código a carpeta
- [ ] Commitear workflows
- [ ] Push a main
- [ ] Configurar secrets (DB_CONNECTION_*)
- [ ] Habilitar branch protection
- [ ] Ejecutar test backend-ci
- [ ] Ejecutar test frontend-ci
- [ ] Ejecutar test tests pipeline
- [ ] Ejecutar test release
- [ ] Ejecutar test security
- [ ] Revisar GitHub Pages (docs.yml)
- [ ] Configurar notificaciones (opcional)
- [ ] **Status: READY FOR PRODUCTION** ✅

---

## 🆘 TROUBLESHOOTING

### Problema: "Workflows no aparecen en Actions"

**Solución:**
```
1. Settings → Actions → General
2. Verify: "Actions permissions" = "All actions and reusable workflows"
3. Verify: "Workflow permissions" = "Read and write permissions"
4. Click Save
5. Esperar 1 minuto
6. Refresh browser
```

### Problema: "Secret no se ve en workflow"

**Solución:**
```
1. Verificar que secret está en repositorio (no en org)
2. Secrets son case-sensitive
3. Resetear: Delete y recrear secret
4. Test: Ejecutar nuevo workflow run
```

### Problema: "Backend CI falla: Cannot find project"

**Solución:**
```
1. Verificar ruta en yaml: backend/ElMediadorDeSofia.csproj
2. Ruta debe ser relativa a repo root
3. Ejecutar localmente: dotnet build backend/
4. Si falla, error es local no en CI
```

### Problema: "Frontend CI: npm ci failed"

**Solución:**
```
1. Verificar package-lock.json está commiteado
2. Ejecutar localmente: npm ci
3. Si falla: npm install --force
4. Commit package-lock.json actualizado
```

### Problema: "Tests falla: Connection refused (PostgreSQL)"

**Solución:**
```
1. Service PostgreSQL debe estar en docker
2. Verificar health check en yaml (--health-cmd)
3. Aumentar timeout si es lento: --health-timeout 10s
4. Verificar puerto: 5432 debe estar abierto
```

### Problema: "Release falla: Invalid version"

**Solución:**
```
1. Tag debe ser semver: v2.1.0
2. NO usar: v2.1, 2.1.0, release-2.1.0
3. Eliminar tag y recrear:
   git tag -d v0.1.0
   git push origin --delete v0.1.0
   git tag v0.1.0
   git push origin v0.1.0
```

### Problema: "GitHub Pages no se publica"

**Solución:**
```
1. Settings → Pages
2. Source: Deploy from branch
3. Branch: main (o la rama donde push)
4. Folder: /docs (si está en carpeta docs)
5. Click Save
6. Esperar 2 minutos
```

### Problema: "Security scan nunca termina"

**Solución:**
```
1. CodeQL puede tardar 15-20 min en repos grandes
2. Es normal, dejar completar
3. Si timeout (> 30 min): 
   - Reducir análisis en codeql.yml
   - Usar queries: "security-only" (en lugar de security-and-quality)
```

---

## 📊 MONITOREO

### Dashboard de GitHub Actions

**Recomendaciones:**
```
1. Navegar a: github.com/your-org/serendipity/actions
2. Bookmarking en navegador
3. Revisar regularmente:
   - Status de workflows
   - Failure patterns
   - Performance trends
```

### Configurar Notificaciones

#### Email (GitHub Default)
```
Settings → Notifications
- Watch: All Activity
- Email: On push
```

#### Slack Integration (Recomendado)
```yaml
1. Crear Slack Workspace
2. Crear #cicd-notifications canal
3. ir a App Management
4. Buscar: "GitHub"
5. Instalar
6. Autorizar
7. Configurar canal
```

#### Custom Webhooks
```yaml
# Próximamente: Implementar webhook personalizado
# Permitiría:
- Notificaciones en Discord
- Notificaciones en Microsoft Teams
- Webhooks a servicio custom
- Alertas en PagerDuty
```

---

## 📈 OPTIMIZACIONES POR ETAPA

### Etapa 1: Setup (Ahora)
- ✅ Workflows básicos funcionando
- ✅ Secrets configurados
- ✅ Tests corriendo
- ⏳ Monitoreo manual

### Etapa 2: Estabilización (2 semanas)
- ✅ Arreglar test failures
- ✅ Optimizar tiempos
- ✅ Habilitar coverage gates
- ✅ Automatizar deployments

### Etapa 3: Advanced (1 mes)
- ✅ Docker registry integrado
- ✅ Staging automatic deploy
- ✅ Production blue-green deploy
- ✅ Observabilidad completa

---

## 🔄 FLUJO TÍPICO DE DESARROLLO

```
1. Developer crea feature branch
   git checkout -b feature/my-feature

2. Realiza cambios (backend + frontend)
   git add .
   git commit -m "feat: add my feature"

3. Push a feature branch
   git push origin feature/my-feature

4. GitHub Actions ejecutan automáticamente:
   ✅ backend-ci
   ✅ frontend-ci
   ✅ tests
   ✅ security

5. Developer crea Pull Request en GitHub

6. PR muestra status de todos los checks:
   ✅ All checks passed

7. Reviewer aprueba PR

8. Merge a develop (o main)

9. Workflows ejecutan en merged code:
   ✅ Todos los checks
   ✅ Artefactos publicados

10. Para release: Tag con v*
    git tag v0.2.0
    git push origin v0.2.0

11. Release pipeline ejecuta:
    ✅ Build final
    ✅ GitHub Release creado
    ✅ Docker image publicada
    ✅ Deployable artifacts

12. Deploy a staging/production manual
    (O automático si está configurado)
```

---

## ✨ MEJORES PRÁCTICAS

### DO's ✅
- ✅ Hacer commits pequeños
- ✅ Escribir buenos mensajes commit
- ✅ Runear tests localmente antes de push
- ✅ Revisar PR antes de merge
- ✅ Usar semantic versioning para tags
- ✅ Monitorear GitHub Actions regularmente
- ✅ Actualizar secrets regularmente

### DON'Ts ❌
- ❌ Nunca pusheando a main sin PR
- ❌ Nunca ignorando failed checks
- ❌ Nunca pushando secrets en código
- ❌ Nunca usando generic tags (latest)
- ❌ Nunca haciendo force push a main
- ❌ Nunca ignorando security warnings

---

## 📚 RECURSOS ADICIONALES

### Documentación Oficial
- [GitHub Actions Guide](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows)
- [Best Practices](https://docs.github.com/en/actions/guides)

### Comunidad
- GitHub Discussions
- Stack Overflow: `github-actions`
- GitHub Community Forum

### Herramientas Útiles
```bash
# act: Ejecutar workflows localmente
brew install act

# Github CLI: Interactuar con GitHub desde terminal
brew install gh

# Docker: Para servicios en CI
# Ya incluido en GitHub Actions runners
```

---

## 🎉 CONCLUSIÓN

✅ **Setup completado**  
✅ **Workflows configurados**  
✅ **Secrets en lugar**  
✅ **Branches protegidas**  
✅ **Tests validados**  
✅ **Documentación disponible**

**Próximos pasos:**
1. Ejecutar first test run
2. Resolver cualquier issue
3. Documentar procesos internos
4. Entrenar al equipo
5. Monitorear y optimizar

---

*Guía de configuración de CI/CD Serendipity v2.0*

**Estado:** 🟢 LISTO PARA USAR  
**Fecha:** 12 de febrero de 2026  
**Versión:** 1.0 Complete

🚀 **LET'S AUTOMATE!**
