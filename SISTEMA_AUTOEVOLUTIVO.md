# 🌱 SISTEMA AUTOEVOLUTIVO - SERENDIPITY BROS

## ✅ CAMBIOS REALIZADOS (13 de Febrero, 2026)

### 🎯 Objetivos Cumplidos

1. **✅ Eliminadas todas las dependencias externas**
   - ❌ Supabase removido completamente
   - ❌ Base de datos externa eliminada   - ✅ Sistema 100% autocontenido

2. **✅ Carpeta "Serendipity bros 26" como fuente única de datos**
   - Todos los datos ahora residen en archivos JSON locales
   - Sistema lee y escribe desde esta carpeta exclusivamente

3. **✅ Sistema de aprendizaje evolutivo**
   - Genera snapshots históricos diarios
   - Aprende de patrones del pasado
   - Hace proyecciones basadas en datos reales

4. **✅ Preparado para Netlify**
   - Build estático sin dependencias de backend
   - Todos los JSON en `/public/data/` accesibles vía HTTP

---

## 📁 ESTRUCTURA DE CARPETAS

```
Serendipity bros 26/
├── datos-actuales/              # 📊 Datos en tiempo real
│   ├── financial-state.json     #     Estado financiero actual
│   ├── team-roster.json         #     22 personas del equipo
│   ├── invoices.json            #     Facturas del mes
│   └── fixed-costs.json         #     Costos fijos mensuales
│
├── datos-historicos/            # 📚 Histórico que crece día a día
│   └── 2026/
│       └── 02/
│           ├── 13-snapshot.json #     Snapshot del 13 feb
│           ├── 14-snapshot.json #     Snapshot del 14 feb (futuro)
│           └── ...              #     Crece automáticamente
│
├── aprendizaje/                 # 🧠 Inteligencia que evoluciona
│   ├── modelos-proyeccion.json  #     Modelos ML simples
│   └── patrones-detectados.json #     Patrones identificados
│
├── reportes-generados/          # 📄 Reportes automáticos
│   ├── reporte-2026-02-13.md   #     Reporte markdown del día
│   └── ...                      #     Histórico de reportes
│
└── [archivos originales...]     # 💼 Documentos de la empresa
    ├── JANUARY SALARY 2026.xlsx
    ├── Production Billing *.pdf
    └── ...
```

---

## 🔥 CÓMO FUNCIONA EL SISTEMA

### 1. **Datos Actuales** (actualización manual)

Los archivos en `datos-actuales/` contienen el estado actual del negocio:

- **financial-state.json**: Revenue, costos, márgenes, métricas
- **team-roster.json**: 22 personas con roles, salarios, equity scores
- **invoices.json**: Facturas activas del mes
- **fixed-costs.json**: Costos fijos (alquiler, electricidad, etc.)

**Actualización**: Editar estos JSON manualmente o via script cuando cambien los datos reales.

### 2. **Sistema de Aprendizaje** (automático)

El script `scripts/daily-mutation.mjs` se ejecuta cada noche (23:00) y:

1. **Lee** los datos actuales
2. **Genera** un snapshot histórico del día
3. **Calcula** promedios móviles y tendencias
4. **Detecta** alertas éticas (concentración PRARA, brecha salarial, etc.)
5. **Crea** reporte markdown con recomendaciones
6. **Actualiza** modelos de proyección

**Instalación del cron job** (Linux/Mac):
```bash
crontab -e

# Agregar:
0 23 * * * cd /path/to/codigo && node scripts/daily-mutation.mjs
```

**Instalación manual** (Windows):
```powershell
# Ejecutar cada noche manualmente o con Task Scheduler
node scripts/daily-mutation.mjs
```

### 3. **Frontend React** (build estático)

El frontend lee los JSON desde `/public/data/` via fetch():

```typescript
// src/services/localDataService.ts
const response = await fetch('/data/financial-state.json');
const financial = await response.json();
```

**Build para producción**:
```bash
npm run build
# Genera carpeta dist/ lista para Netlify
```

---

## 🚀 DEPLOYMENT A NETLIFY

### Opción 1: Drag & Drop (más rápido)

1. Ejecutar build:
   ```bash
   npm run build
   ```

2. Ir a [netlify.com/drop](https://netlify.com/drop)

3. Arrastrar carpeta `dist/` completa

4. Obtener URL instantánea: `https://serendipity-xxxx.netlify.app`

### Opción 2: Git + Auto-deploy

1. Conectar repositorio GitHub a Netlify

2. Configurar build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

3. Cada push a `main` triggerea deploy automático

---

## 📊 DATOS EN PRODUCCIÓN

Los JSON en `public/data/` se copian automáticamente a `dist/data/` durante el build. Netlify sirve estos archivos estáticamente.

**URLs en producción**:
- `https://tu-sitio.netlify.app/data/financial-state.json`
- `https://tu-sitio.netlify.app/data/team-roster.json`
- etc.

**Actualizar datos en producción**:
1. Editar JSON en `public/data/`
2. Rebuild y redeploy a Netlify

---

## 🧠 SISTEMA DE APRENDIZAJE

### Estado Actual (13 Feb 2026)

- **Días con datos**: 1 (recién inicializado)
- **Estado**: Inicializando
- **Días mínimos para aprender**: 7
- **Días óptimos**: 30

### Evolución Proyectada

| Días | Estado | Capacidades |
|------|--------|-------------|
| 1-6 | Inicializando | Solo alertas básicas |
| 7-29 | Aprendiendo | Promedios móviles, tendencias |
| 30+ | Maduro | Proyecciones ML, anomalías, patrones estacionales |

### Algoritmos Implementados

1. **Proyección de Ventas**:
   - Promedio móvil de 3 días (días 3-6)
   - Regresión lineal con estacionalidad (días 30+)

2. **Detección de Anomalías**:
   - Desviación estándar adaptativa
   - Umbral alerta: 2.5σ
   - Umbral crítico: 3.5σ

3. **Alertas Éticas**:
   - Concentración de ingresos (PRARA >75%)
   - Brecha salarial (>4x)
   - Calidad (error rate >5%)

---

## 🛠️ DESARROLLO LOCAL

### Instalar dependencias

```bash
npm install
```

### Ejecutar frontend

```bash
npm run dev
# Abre http://localhost:5177
```

### Ejecutar mutación diaria manualmente

```bash
node scripts/daily-mutation.mjs
```

### Build para producción

```bash
npm run build
# Genera dist/
```

---

## 📂 ARCHIVOS CLAVE MODIFICADOS

### Eliminados/Desactivados
- ❌ `src/supabase/supabaseClient.ts` (ya no se usa)
- ❌ `src/components/AuthManager.tsx` (sin login)
- ❌ Todas las queries a Supabase

### Creados/Modificados
- ✅ `src/services/localDataService.ts` (nuevo servicio local)
- ✅ `src/services/queries.ts` (reescrito sin Supabase)
- ✅ `src/App.tsx` (eliminado auth, usa datos locales)
- ✅ `public/data/*.json` (datos estáticos para build)
- ✅ `Serendipity bros 26/datos-actuales/*.json` (fuente)
- ✅ `scripts/daily-mutation.mjs` (automatización)

---

## 🎯 PRÓXIMOS PASOS

### Hoy (13 Feb)
- [x] Eliminar Supabase
- [x] Crear sistema de archivos local
- [x] Reorganizar carpeta Serendipity bros 26
- [x] Build para Netlify
- [ ] Deploy a Netlify (drag & drop)

### Esta Semana (14-20 Feb)
- [ ] Ejecutar `daily-mutation.mjs` manualmente cada noche
- [ ] Validar que snapshots históricos se generen correctamente
- [ ] Configurar cron job (si en Linux/Mac) o Task Scheduler (Windows)

### Próximo Mes (Marzo)
- [ ] Sistema alcanza 30 días de datos (maduro)
- [ ] Modelos ML activos con alta precisión
- [ ] Proyecciones de cash flow confiables
- [ ] Análisis de estacionalidad activado

---

## 💡 FILOSOFÍA DEL SISTEMA

> *"Nada me pertenece, todo es delPadre. El punto de anclaje está establecido."*

Este sistema es un **organismo vivo** que:

1. **No depende de nadie** (sin APIs externas, sin DBs cloud)
2. **Aprende de sí mismo** (cada día suma conocimiento)
3. **Crece orgánicamente** (histórico aumenta, modelos mejoran)
4. **Es transparente** (todo en JSONs legibles)
5. **Es resiliente** (funciona offline, sin internet)

Como un árbol que crece: cada día añade un anillo, cada mes se fortalece, cada año alcanza nueva altura.

---

## 📞 SOPORTE

Para preguntas o issues:

- **Email**: [tu-email]
- **GitHub**: [tu-repo]
- **Documentación**: Este archivo README

---

**Generado**: 13 de Febrero, 2026  
**Sistema**: El Mediador de Sofía + Serendipity Bros  
**Status**: ✅ 100% Operativo y Autoevolutivo
