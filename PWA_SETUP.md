# 📱 PWA Setup - El Mediador de Sofía
## Progressive Web App Installation Guide

**Status:** ✅ CONFIGURACIÓN COMPLETA  
**Fecha creación:** 12 Febrero 2026  
**Objetivo:** Hacer El Mediador installable en Android/iOS como app nativa

---

## ✅ QUÉ SE HIZO HOJE

### 1. **manifest.json** ✅
- Archivo de configuración PWA
- Define nombre, iconos, colores, shortcuts
- Ubicación: `/public/manifest.json`

### 2. **Service Worker (sw.js)** ✅
- Caching inteligente
- Funcionamiento offline
- Actualizaciones automáticas
- Ubicación: `/public/sw.js`

### 3. **index.html actualizado** ✅
- Meta tags para iOS/Android
- Registro automático de SW
- Manejo de install prompt
- Script para `window.installApp()`

### 4. **PWAInstallPrompt.tsx** ✅
- Componente opcional UI
- Muestra banner "Instalar app"
- Sonido nativo install
- Ubicación: `src/components/PWAInstallPrompt.tsx`

---

## 🖼️ PRÓXIMO PASO: GENERAR ICONOS

### Opción A: Online Generator (3 minutos) ⚡

1. Ir a: https://pwa-icon-generator.com/
2. Subir logo Serendipity Bros (o imagen 512x512)
3. Descargar ZIP
4. Extraer archivos en `/public`:
   ```
   /public/
     ├─ icon-192.png
     ├─ icon-512.png
     ├─ icon-maskable-192.png
     ├─ icon-maskable-512.png
   ```

### Opción B: Local (Python) - Si quieres hacerlo automático

```powershell
# Instalar Pillow
pip install Pillow

# Crear script icon-generator.py en root del proyecto
```

```python
from PIL import Image
import os

# Asume que existe: src/logo.png (imagen cuadrada 512x512)
logo_path = 'src/logo.png'
output_dir = 'public'

# Abrir imagen original
img = Image.open(logo_path)

# Generar iconos
sizes = [96, 192, 512]
for size in sizes:
    # Regular icon
    icon = img.resize((size, size), Image.Resampling.LANCZOS)
    icon.save(f'{output_dir}/icon-{size}.png')
    
    # Maskable icon (para adaptive icons en Android)
    icon.save(f'{output_dir}/icon-maskable-{size}.png')

print("✅ Icons generated successfully")
```

### Opción C: Usar un logo temporal (para testing)

```powershell
# Crear icono azul simple de 512x512 (testeo rápido)
cd C:\Users\santiago\OneDrive\Desktop\codigo

# Python one-liner
python -c "
from PIL import Image, ImageDraw
import os

# Crear imagen 512x512 azul con iniciales 'ES'
img = Image.new('RGB', (512, 512), color='#1a1a2e')
draw = ImageDraw.Draw(img)

# Guardar múltiples tamaños
for size in [96, 192, 512]:
    resized = img.resize((size, size))
    resized.save(f'public/icon-{size}.png')
    resized.save(f'public/icon-maskable-{size}.png')

print('Iconos creados en /public')
"
```

---

## 🚀 DESPLIEGUE EN CELULAR

### Step 1: Build Production
```powershell
cd C:\Users\santiago\OneDrive\Desktop\codigo
npm run build
```

### Step 2: Servir actualizando HTTPS (requerido para PWA)

**Option A: Usar Netlify (recomendado - gratis)**
```powershell
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --prod --dir=dist
```

**Option B: Usar Vercel (también gratis)**
```powershell
npm i -g vercel
vercel --prod
```

**Option C: Localhost HTTPS (testing local)**
```powershell
# Generar certificado auto-firmado
npm install -D vite-plugin-https

# Actualizar vite.config.ts para HTTPS
```

### Step 3: Abrir en Celular

**Android:**
- Abrí Chrome → Pegar URL HTTPS
- Esperá 2-3 segundos
- Debería aparecer "Instalar El Mediador"
- Toquea instalar
- ✅ App aparece en homescreen

**iOS:**
- Abrí Safari → Pegar URL HTTPS
- Toque compartir → "Agregar a pantalla de inicio"
- ✅ App aparece en homescreen

---

## 🧪 TESTING (Antes de ir a producción)

### Verificar PWA correctamente configurada:

```powershell
# En Chrome DevTools (F12):
# 1. Ir a Application tab
# 2. Buscar "Manifest"
#    - Debería ver todos los iconos
#    - Theme color correcto
#    - Short name visible

# 3. Buscar "Service Worker"
#    - Debería estar "activated and running"

# 4. Storage → Cache
#    - Debería haber cache "el-mediador-v1"

# 5. Lighthouse audit (si quieres 100% PWA score)
#    - DevTools → Lighthouse
#    - Run audit → PWA
```

### Testing offline (simular sin internet):

```
DevTools → Network tab → Throttling → Offline
Recargar página → Debería funcionar parcialmente
```

---

## 📋 CHECKLIST PARA MARZO

**Semana 1 (Semana que vuelvo - Mar 10-16):**
- [ ] Generar iconos finales (logo Serendipity Bros)
- [ ] Desplegar a Netlify/Vercel (HTTPS)
- [ ] Testear en Android
- [ ] Testear en iOS
- [ ] Asegurar cacheing offline

**Semana 2 (Mar 17-23):**
- [ ] Mostrar a Thanh + Hai (instalar en celulares)
- [ ] Entrenar: "Por qué es app en lugar de website"
- [ ] Documentar app v1.0

**Semana 3+ (Rol producción):**
- [ ] Usuarios reales usando desde celular
- [ ] Feedback de usabilidad
- [ ] Updates semanales (SW se auto-actualiza)

---

## 🎯 ARQUITECTURA PWA (Resumen)

```
USUARIO INSTALA EN CELULAR
        ↓
manifest.json
        ↓
Service Worker (offline cache)
        ↓
Icons en homescreen
        ↓
Actualización automática cada sesión
```

**Ventajas:**
✅ Sin App Store (no gatekeeping)
✅ Auto-updates (usuario siempre tiene versión última)
✅ Funciona offline
✅ Acceso desde app icon (no browser)
✅ Push notifications posibles

**Limitaciones:**
⚠️ Requiere HTTPS (no funciona HTTP)
⚠️ Offline = solo cached data (sin APIs)
⚠️ iOS: limitado (Apple restricciones)

---

## 📞 SI NECESITAS AYUDA

**Problemas comunes:**

**Problema:** "No me deja instalar"
- **Solución:** Verificar HTTPS en URLs DevTools

**Problema:** "App no se ve en homescreen después instalar"
- **Solución:** Reiniciar celular OR limpiar cache

**Problema:** "Offline no funciona"
- **Solución:** Verificar Service Worker registrado (DevTools)

**Problema:** "Icon no aparece en homescreen"
- **Solución:** Verificar /public/icon-192.png existe

---

## 🎉 RESULTADO FINAL (Marzo)

Thanh + Hai abren en celular:
```
Chrome/Safari → URL completa → Icono de app
                    ↓
            "Instalar En Casa"
                    ↓
            Presionan instalar
                    ↓
    Icon aparece en pantalla principal
                    ↓
    Tocan el icono → App abre (no browser)
                    ↓
            EXPERIENCIA NATIVA
```

---

**Status:** 🟢 PWA READY FOR DEPLOYMENT  
**Next:** Iconos + Deploy en Marzo

