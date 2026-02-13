# 📱 DEPLOYMENT RÁPIDO PWA - El Mediador de Sofía
## Guía para Marzo 2026

**Objetivo:** Tener El Mediador instalable en celular (Thanh + Hai)  
**Timeline:** Marzo 10-16, 2026

---

## 🚀 CHECKLIST DEPLOYMENT PWA

### PASO 1: Generar Iconos (5 minutos)

```powershell
cd C:\Users\santiago\OneDrive\Desktop\codigo

# Opción A: Ejecutar script Python (genera iconos azules de prueba)
python scripts/generate-pwa-icons.py

# Opción B: Descargar iconos reales en https://pwa-icon-generator.com/
```

**Resultado esperado:**
```
public/
  ├─ icon-96.png
  ├─ icon-192.png
  ├─ icon-512.png
  ├─ icon-maskable-192.png
  └─ icon-maskable-512.png
```

### PASO 2: Build Production

```powershell
npm run build
```

**Resultado:** carpeta `dist/` lista para desplegar

### PASO 3: Deploy a Netlify (GRATIS con HTTPS)

```powershell
# Si no tienes Netlify CLI instalado:
npm install -g netlify-cli

# Login a Netlify (necesitas cuenta GitHub/Gmail)
netlify login

# Deploy (automático en HTTPS)
netlify deploy --prod --dir=dist
```

**Output esperado:**
```
✨ Deploy is live!
🔥 Live URL: https://el-mediador.netlify.app
```

### PASO 4: Test en Celular Android

```
1. Abrir Chrome en celular
2. Ir a: https://el-mediador.netlify.app (o tu URL)
3. Esperar 2-3 segundos
4. Debería aparecer: "Instalar El Mediador"
5. Tocar instalar
6. ✅ Icon aparece en pantalla de inicio
```

### PASO 5: Test en iPhone (iOS)

```
1. Abrir Safari
2. Ir a URL
3. Tocar compartir (ícono cuadrado con flecha)
4. "Agregar a pantalla de inicio"
5. ✅ Icon aparece en pantalla de inicio
```

---

## 📊 QUÉ YA ESTÁ HECHO

✅ **manifest.json** - Configuración PWA  
✅ **sw.js** - Service Worker (offline + caching)  
✅ **index.html** - Meta tags + Service Worker registration  
✅ **PWAInstallPrompt.tsx** - Componente UI opcional  
✅ **PWA_SETUP.md** - Documentación completa  

---

## 🎯 INTEGRACIÓN EN APP

### Para mostrar componente "Instalar":

En `src/App.tsx` o componente principal:

```typescript
import PWAInstallPrompt from './components/PWAInstallPrompt';

export function App() {
  return (
    <>
      <PWAInstallPrompt />
      {/* resto de la app... */}
    </>
  );
}
```

---

## 🔧 VERIFICACIONES

### Verificar PWA en Chrome DevTools:

```
F12 → Application → Manifest
  ✓ Debería ver nombre, iconos, colores

F12 → Application → Service Workers
  ✓ Debería estar "activated and running"

F12 → Application → Storage → Cache
  ✓ Debería haber "el-mediador-v1"
```

---

## 🌐 OPCIONES DE DEPLOY

| Opción | Tiempo | Costo | HTTPS | Recomendación |
|--------|--------|-------|-------|--------------|
| Netlify | 1 min | Gratis | ✅ | ⭐ MEJOR |
| Vercel | 1 min | Gratis | ✅ | ✅ Muy bueno |
| GitHub Pages | 5 min | Gratis | ✅ | OK (más complejj) |
| Manual VPS | 30 min | ~$5/mes | ⚠️ Requiere config | No recomendado ahora |

---

## 📱 EXPERIENCIA FINAL

Cuando Thanh toca el icono en celular:
```
Icono app → Toca → Abre app completa (no browser)
                → Sin barra de dirección
                → Funcionamiento offline
                → Auto-actualiza cada sesión
```

---

## 🎓 MARCH 10-16 TASK

```
MON 10:
  [ ] Generar iconos
  [ ] Build prod
  [ ] Deploy Netlify

TUE 11-WED 12:
  [ ] Testear Android
  [ ] Testear iOS
  [ ] Documentar

THU 13-FRI 14:
  [ ] Presentar a Thanh + Hai
  [ ] Entrenar: "Instala desde Chrome"
  [ ] Feedback recolecta

WEEK 2:
  [ ] Users reales usando app
  [ ] Monitor performance
  [ ] Updates si necesario
```

---

## 🆘 TROUBLESHOOTING

**P: No me deja instalar**
R: 
- Verificar HTTPS (DevTools > Security)
- Esperar 2-3 segundos después cargar
- Recargar página (Ctrl+F5)

**P: Icono no aparece en homescreen**
R:
- Tocar "Instalar" completamente hasta final
- Reiniciar celular
- Limpiar cache Chrome

**P: Offline no funciona**
R:
- Verificar Service Worker registrado (DevTools)
- Permitir app acceso a datos offline
- Ver Console para errores

**P: Cómo actualizo después desplegar?**
R:
- Cambios en código → git push → auto-deploy Netlify
- Service Worker auto-detecta cambios
- Usuarios reciben update siguiente vez abren app

---

## 💡 TIPS

- PWA funciona MEJOR en Android que iOS (limitaciones Apple)
- Para producción: reemplazar iconos azules con logo real
- Considerar agregar splash screen (imagen loading)
- Push notifications = feature futura (agosto+)

---

**Status:** 🟢 LISTO PARA MARZO  
**Próxima revisión:** 10 de Marzo 2026

