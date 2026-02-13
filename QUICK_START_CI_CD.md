# ⚡ QUICK START - CI/CD EN 5 MINUTOS

> **No leas nada, solo sigue estos pasos. 5 minutos máximo.**

---

## 🚀 Paso 1: Copiar workflows (1 min)

```bash
# En tu terminal, en la raíz del proyecto
cd c:\Users\santiago campanera\OneDrive\Desktop\codigo

# Verifica que existan los workflows
ls .github/workflows/

# Deberias ver 7 archivos YAML
# ✅ backend-ci.yml
# ✅ frontend-ci.yml
# ✅ tests.yml
# ✅ migrations.yml
# ✅ release.yml
# ✅ docs.yml
# ✅ security.yml
```

---

## 🚀 Paso 2: Git commit (1 min)

```bash
git add .github/workflows/
git commit -m "✨ Add CI/CD workflows"
git push origin main
```

---

## 🚀 Paso 3: GitHub Secrets (2 min)

1. Abre GitHub → Tu repositorio
2. Settings → Secrets and variables → Repository secrets
3. Click "New repository secret"
4. Name: `DB_CONNECTION_STAGING`
5. Value: (copia de tu archivo de config o `.env`)
6. Click "Add secret"

Repite para `DB_CONNECTION_PRODUCTION`

**Ejemplo de formato:**
```
Host=localhost;Port=5432;Database=serendipity;Username=postgres;Password=***
```

---

## 🚀 Paso 4: Branch Protection (1 min)

1. GitHub → Settings → Branches
2. Click "Add rule"
3. Branch name pattern: `main`
4. ✅ Require a pull request before merging
5. ✅ Require 1 approval
6. ✅ Require status checks to pass before merging
7. Search and select:
   - `backend-ci / build`
   - `frontend-ci / build`
   - `tests / backend-tests`
   - `security / security-summary`
8. Click "Create"

---

## ✅ Verificación (0 min)

1. Abre GitHub → Actions
2. Deberías ver tus workflows listados
3. Si ves errores en rojo → lee el log

---

## 🎯 Próximo paso

Ahora puedes:
- **Hacer push** a cualquier rama → ¡Auto build y test! ✅
- **Crear tag** `v2.0.0` → ¡Auto release! ✅
- **Mergear a main** → ¡Todo corre automático! ✅

---

## 🆘 Si algo falla

1. GitHub → Actions → Ver el workflow que falló
2. Click en el job rojo
3. Lee los logs (arriba dice qué salió mal)
4. Problemas comunes:
   - ❌ Secrets no configurados → Hacer paso 3 nuevamente
   - ❌ Rama protegida falló → Hacer paso 4 nuevamente
   - ❌ PostgreSQL error → Verificar DB_CONNECTION_*

---

## 📖 Para más detalles

Leer estos en orden:
1. `CI_CD_SETUP_GUIDE.md` (guía completa, 30 min)
2. `CI_CD_WORKFLOWS_RESUMEN.md` (técnico, 1 hora)
3. `CI_CD_INDICE_MAESTRO.md` (este archivo, 10 min)

---

**¡LISTO!** 🎉

Tu infraestructura CI/CD está activada. Ahora cada push será automático.

¿Preguntas? → CI_CD_SETUP_GUIDE.md sección "FAQ"
