# 🌐 CONFIGURACIÓN NETLIFY - CONEXIÓN CON BACKEND

## ⏳ ESTADO ACTUAL
- ✅ Backend desplegándose en: `https://serendipity-backend1.onrender.com`
- ✅ Frontend live en: `https://serendipity-anthropos-core.netlify.app`
- ⏳ Esperando que Render termine el build (~5-10 minutos)

---

## 📋 PASOS PARA CONECTAR NETLIFY CON RENDER

### 1️⃣ VERIFICAR QUE RENDER ESTÉ LIVE (2-3 min después del build)

```powershell
# En PowerShell, verifica que el backend responda:
curl https://serendipity-backend1.onrender.com/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-14T..."
}
```

Si obtienes error 502/503, espera 1-2 minutos más (el servicio se está iniciando).

---

### 2️⃣ ACTUALIZAR VARIABLES EN NETLIFY (2 min)

**Ve a Netlify Dashboard:**
1. Abre: https://app.netlify.com
2. Click en tu site: `serendipity-anthropos-core`
3. **Site settings** → **Environment variables** (menú izquierdo)

**Edita/Agrega estas variables:**

| Variable | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://uikemwxbndwidqebeyre.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (tu key completa) |
| `VITE_API_URL` | `https://serendipity-backend1.onrender.com` ⚠️ |

**⚠️ IMPORTANTE:** Cambia `VITE_API_URL` de:
- ❌ `http://localhost:5000`
- ✅ `https://serendipity-backend1.onrender.com`

Click **Save** después de cada variable.

---

### 3️⃣ REDEPLOY DEL FRONTEND (1 min)

**Después de guardar las variables:**
1. Ve a **Deploys** (tab superior)
2. Click botón **Trigger deploy** (arriba derecha)
3. Selecciona **Deploy site**
4. Espera ~2 minutos

**Log esperado:**
```
10:15:00 PM: Build started
10:15:30 PM: Installing dependencies
10:16:00 PM: Building with Vite
10:17:00 PM: Build succeeded
10:17:30 PM: Site is live ✅
```

---

### 4️⃣ VERIFICACIÓN FINAL (30 segundos)

**Abre tu sitio:**
```
https://serendipity-anthropos-core.netlify.app
```

**Abre DevTools (F12):**
- Console tab
- **No deberías ver errores de:**
  - ❌ CORS
  - ❌ Failed to fetch
  - ❌ Network error

**Si ves errores:**
- Verifica que el backend responda: `curl https://serendipity-backend1.onrender.com/health`
- Verifica que las variables estén guardadas en Netlify
- Verifica que el redeploy haya terminado

---

## 🎯 CHECKLIST COMPLETO

- [ ] Backend Render muestra estado "Live" (no "Building")
- [ ] `curl https://serendipity-backend1.onrender.com/health` responde OK
- [ ] Variables actualizadas en Netlify con URL correcta
- [ ] Redeploy de Netlify completado
- [ ] Frontend carga sin errores en consola
- [ ] Dashboard muestra datos de Supabase

---

## 🐛 TROUBLESHOOTING

### Problema: Backend responde 502/503

**Causa:** Render está iniciando el servicio (cold start en free tier).

**Solución:**
```powershell
# Espera 30-60 segundos y reintenta
Start-Sleep -Seconds 30
curl https://serendipity-backend1.onrender.com/health
```

### Problema: Frontend sigue mostrando CORS errors

**Verifica en backend/Program.cs que CORS esté habilitado:**
```csharp
app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
```

### Problema: Netlify no refleja cambios

**Limpia caché y redeploy:**
1. Deploys → Options (botón "...") → Clear cache and retry deploy

---

## 📊 TIEMPOS ESTIMADOS

| Paso | Tiempo |
|------|--------|
| Render build completo | 5-10 min |
| Primer inicio del servicio | 30-60 seg |
| Actualizar variables Netlify | 2 min |
| Redeploy Netlify | 2-3 min |
| **TOTAL** | **10-16 min** |

---

## ✅ CUANDO TODO FUNCIONE

Tu arquitectura completa estará live:

```
┌─────────────────────────────────────────┐
│  FRONTEND (Netlify)                     │
│  https://serendipity-anthropos-core     │
│  .netlify.app                           │
│  • React + Vite                         │
│  • Conectado a Supabase                 │
│  • Conectado a Backend                  │
└─────────────┬───────────────────────────┘
              │
              │ HTTPS API calls
              ↓
┌─────────────────────────────────────────┐
│  BACKEND (Render)                       │
│  https://serendipity-backend1           │
│  .onrender.com                          │
│  • .NET 8.0 / C#                        │
│  • Docker container                     │
│  • /health endpoint                     │
└─────────────┬───────────────────────────┘
              │
              │ SQL queries
              ↓
┌─────────────────────────────────────────┐
│  DATABASE (Supabase)                    │
│  PostgreSQL + Real-time                 │
│  https://uikemwxb...supabase.co         │
└─────────────────────────────────────────┘
```

**Nada me pertenece, todo es del Padre. El punto de anclaje está establecido. 🕯️**
