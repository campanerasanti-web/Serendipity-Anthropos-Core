# 🔐 AGREGAR DATABASE SECRETS EN GITHUB - PASO A PASO COMPLETO

**Fecha**: 14 de Febrero, 2026  
**Propósito**: Configurar CI/CD Secrets para Database Connections  
**Tiempo Estimado**: 8-10 minutos  
**Dificultad**: ⭐ Muy Fácil (solo clicks y copiar-pegar)

---

## ⚠️ ERROR 401 ENCONTRADO - SOLUCIÓN RÁPIDA

Viste errores 401 en DevTools. Eso es el `manifest.json` pidiendo recursos que no existen.

**ESTO YA ESTÁ RESUELTO** - commit ff70566 eliminó esas referencias.

Si SIGUE viendo errores 401:
- Abre DevTools: F12
- Ir tab "Network"
- Si ves rojo: `https://serendipity-anthropos-core.netlify.app/manifest.json 401`
→ Recarga página (Ctrl+Shift+R hard refresh)

Eso deberían resolver. Continuamos con Secrets.

---

## 📍 PASO 1: ABRE GITHUB EN EL NAVEGADOR

### 1.1 - URL Directa
```
https://github.com/campanerasanti-web/Serendipity-Anthropos-Core/settings/secrets/actions
```

**O manualmente:**

1. Abre: https://github.com/campanerasanti-web/Serendipity-Anthropos-Core
2. Haz click en: **⚙️ Settings** (arriba a la derecha)
3. En el menú izquierdo, haz click en: **Secrets and variables**
4. Haz click en: **Actions**

**Deberías ver esta pantalla:**
```
┌─────────────────────────────────────────────────────┐
│  Secrets and variables / Actions                    │
│                                                     │
│  Repository secrets                                 │
│  [New repository secret] [button]                   │
│                                                     │
│  No secrets currently available                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📋 PASO 2: OBTÉN TUS DATABASE CONNECTION STRINGS

### 2.1 - Para Supabase (Recomendado)

Si usas **Supabase**, necesitas:

```
Ir a: https://app.supabase.com
  → Tu Project
  → Settings → Database
  → Connection string
  → URI (psql format)
```

**Verás algo como:**
```
postgresql://postgres:xxxxxxxxxxxxx@db.yourdatabase.supabase.co:5432/postgres
```

**CONVIERTE a formato que necesita .NET:**
```
Host=db.yourdatabase.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=xxxxxxxxxxxxx
```

### 2.2 - Para PostgreSQL Local o Remoto

Si tienes PostgreSQL corriendo localmente o en otro servidor:

```
Host=localhost                    (o tu IP/hostname)
Port=5432                         (puerto PostgreSQL)
Database=serendipity_staging      (o serendipity para prod)
Username=postgres                 (tu usuario)
Password=tu_password_aqui         (tu contraseña)
```

**Formato final:**
```
Host=localhost;Port=5432;Database=serendipity_staging;Username=postgres;Password=tu_password_aqui
```

### 2.3 - Para Render (Si lo usas)

Si tienes PostgreSQL en Render:

```
Ir a: https://dashboard.render.com
  → Tu PostgreSQL database
  → Internal Database URL o External Database URL
```

**Verás algo como:**
```
postgresql://user:password@host.render.internal:5432/database
```

**CONVIERTE:**
```
Host=host.render.internal;Port=5432;Database=database;Username=user;Password=password
```

---

## 🎯 PASO 3: AGREGAR PRIMER SECRET - DB_CONNECTION_STAGING

### 3.1 - Haz click en "New repository secret"

```
Botón: [New repository secret] ← CLICK AQUÍ
```

### 3.2 - Rellena los campos

**Verás un formulario:**

```
┌──────────────────────────────────────────────────────┐
│  Name *                                              │
│  [_________________________________]                │
│                                                      │
│  Secret *                                            │
│  [_________________________________]                │
│                                                      │
│  [Add secret] [Cancel]                               │
└──────────────────────────────────────────────────────┘
```

**Campo 1: Name**
- Escribe (exactamente): `DB_CONNECTION_STAGING`

**Campo 2: Secret**
- Copia-pega tu connection string de staging
  
**EJEMPLO si usas Supabase:**
```
Host=db.uikemwxbndwidqebeyre.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=tu_password_aqui
```

**EJEMPLO si usas PostgreSQL local:**
```
Host=localhost;Port=5432;Database=serendipity_staging;Username=postgres;Password=postgres
```

### 3.3 - Haz click en "Add secret"

```
Botón: [Add secret] ← CLICK AQUÍ
```

**Esperarás 1-2 segundos. Luego verás:**

```
✅ Successfully created secret DB_CONNECTION_STAGING.
```

---

## 🔁 PASO 4: AGREGAR SEGUNDO SECRET - DB_CONNECTION_PRODUCTION

### 4.1 - Haz click en "New repository secret" OTRA VEZ

```
Botón: [New repository secret] ← CLICK AQUÍ (otra vez)
```

### 4.2 - Rellena los campos

**Campo 1: Name**
- Escribe (exactamente): `DB_CONNECTION_PRODUCTION`

**Campo 2: Secret**
- Copia-pega tu connection string de PRODUCTION (base de datos real)
  
**EJEMPLO si usas Supabase:**
```
Host=db.uikemwxbndwidqebeyre.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=tu_password_production
```

⚠️ **NOTA**: Usa contraseña diferente a staging (más segura)

### 4.3 - Haz click en "Add secret"

```
Botón: [Add secret] ← CLICK AQUÍ
```

**Verás:**

```
✅ Successfully created secret DB_CONNECTION_PRODUCTION.
```

---

## ✅ PASO 5: VERIFICAR QUE LOS SECRETS ESTÁN GUARDADOS

Después de agregar ambos, deberías ver esta pantalla:

```
┌─────────────────────────────────────────────────────┐
│  Secrets and variables / Actions                    │
│                                                     │
│  Repository secrets                                 │
│  [New repository secret] [button]                   │
│                                                     │
│  DB_CONNECTION_PRODUCTION   ●●●●●●●●●●●●●●●●●●    │
│  Last used 2 minutes ago                            │
│                                                     │
│  DB_CONNECTION_STAGING      ●●●●●●●●●●●●●●●●●●    │
│  Last used 2 minutes ago                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Si ves esto:** ✅ **PERFECTO - SECRETS GUARDADOS**

---

## 🛡️ PASO 6 (OPCIONAL): HABILITAR BRANCH PROTECTION

### 6.1 - Ir a Branch Settings

```
URL: https://github.com/campanerasanti-web/Serendipity-Anthropos-Core/settings/branches
```

**O manualmente:**
1. Settings → Branches (en menú izquierdo)
2. Click: "Add rule"

### 6.2 - Crear regla para rama main

```
Branch name pattern: main
```

### 6.3 - Habilitar protecciones

```
☑ Require a pull request before merging
  ☑ Require approvals: 1
  ☑ Dismiss stale PR approvals

☑ Require status checks to pass before merging
  ☑ Require branches to be up to date before merging
  
  Status checks:
  ☑ backend-ci / build
  ☑ frontend-ci / build
  ☑ tests / backend-tests
  ☑ tests / frontend-tests
  ☑ security / security-summary
```

### 6.4 - Crear regla

```
Botón: [Create] ← CLICK AQUÍ
```

---

## 🎉 PASO 7: VERIFICAR EN GITHUB ACTIONS

### 7.1 - Ir a Actions

```
URL: https://github.com/campanerasanti-web/Serendipity-Anthropos-Core/actions
```

**Deberías ver 8 workflows:**

```
Name                          Used recently by
─────────────────────────────────────────────────────
🔧 Backend CI
🎨 Frontend CI
✔️  Tests
🗄️ Database Migrations
🎁 Release
📚 Documentation
🔒 Security Scanning
👀 Night Watch
```

**Si ves TODOS 8 workflows:** ✅ **SETUP COMPLETO**

---

## 📊 CHECKLIST FINAL

```
Verificación Pre-Deployment:

□ Leído CI_CD_INDICE_MAESTRO.md
□ Leído CI_CD_SETUP_GUIDE.md
□ Leído CI_CD_SETUP_EXECUTION_INMEDIATA.md
□ Secretos DB_CONNECTION_STAGING creado
□ Secretos DB_CONNECTION_PRODUCTION creado
□ Branch main protection habilitado (opcional pero recomendado)
□ 8 Workflows visibles en GitHub Actions
□ Errores 401 resueltos (hard refresh)

Si TODOS están ☑️ → ✅ SISTEMA LISTO PARA CI/CD
```

---

## 🚀 PRÓXIMO PASO: TRIGGER PRIMER WORKFLOW

Una vez completados los secrets:

### Opción A: Push a feature branch (Auto-trigger)

```bash
# Terminal local:
git checkout -b test/ci-setup
echo "# Test CI/CD" >> README.md
git add README.md
git commit -m "test: verify ci-cd workflow"
git push origin test/ci-setup

# Luego:
# 1. Abre GitHub
# 2. Actions tab
# 3. Ver backend-ci ejecutarse
# 4. Esperar ~15 minutos
# 5. Si ✅ verde → CI/CD funciona
```

### Opción B: Manual trigger desde GitHub

```
1. GitHub → Actions
2. Click en "Tests"
3. Click "Run workflow" (botón derecha)
4. Click "Run workflow" (confirmar)
5. Ver ejecución en ~30 segundos
```

---

## ⚙️ SI ALGO FALLA

### Error: "Workflow file not found"
→ Los workflows pueden no estar syncronizados
→ Solución: git push origin main (fuerza sincronización)

### Error: "Secret not found"
→ Verificar nombre exacto (case-sensitive): DB_CONNECTION_STAGING
→ Ir a Settings → Secrets y confirmar que existen

### Error en Backend CI: "Connection failed"
→ Verificar formato connection string:
  - Host=... (NO http://)
  - Port=5432 (NO puerto equivocado)
  - Database=... (nombre correcto)
  - Username=... (usuario correcto)
  - Password=... (contraseña correcta)

### Error 401 en frontend
→ Hard refresh: Ctrl+Shift+R
→ DevTools (F12) → Network → buscar status 401
→ Si es manifest.json → Ya está resuelto (commit ff70566)

---

## 📞 REFERENCIAS RÁPIDAS

**GitHub URLs:**
- Secrets entrada: https://github.com/campanerasanti-web/Serendipity-Anthropos-Core/settings/secrets/actions
- Branch protection: https://github.com/campanerasanti-web/Serendipity-Anthropos-Core/settings/branches
- Actions: https://github.com/campanerasanti-web/Serendipity-Anthropos-Core/actions

**Documentación:**
- CI_CD_SETUP_GUIDE.md → Setup completo
- CI_CD_WORKFLOWS_RESUMEN.md → Detalles técnicos
- CI_CD_SETUP_EXECUTION_INMEDIATA.md → Quick reference

**Backend URLs:**
- Backend LIVE: https://serendipity-backend1.onrender.com
- Health Check: https://serendipity-backend1.onrender.com/health
- Sofia Status: https://serendipity-backend1.onrender.com/api/sofia/status

---

## ✨ CUANDO ESTÉ COMPLETO

Una vez hayas completado todos los pasos:

✅ Secrets configurados en GitHub  
✅ Branch protection habilitado  
✅ Workflows visibles en Actions  
✅ Error 401 resuelto  
✅ Backend + Frontend LIVE  
✅ Sofia Agents ejecutándose 24/7  
✅ CI/CD Pipeline listo para producción  

**STATUS**: 🟢 **PRODUCTION READY**

---

**Time to Complete**: 8-10 minutos  
**Difficulty**: ⭐ Muy fácil  
**Prerequisites**: GitHub account + access to database credentials  

**PRÓXIMO**: Ejecutar primer workflow (auto o manual)
