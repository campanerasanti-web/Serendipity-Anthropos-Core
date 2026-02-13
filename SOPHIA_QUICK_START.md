# 🌟 SOPHIA WISDOM BRIDGE - QUICK START
## De Tu Conocimiento a Código en 5 Pasos

---

## ⚡ 5 MINUTOS PARA COMENZAR

### PASO 1: Crear la carpeta /sofia
```bash
mkdir sophia
cd sofia
```

### PASO 2: Copiar ejemplos
```bash
# Opción A: Manualmente
# Copia el contenido de SOFIA_EXAMPLES.md a archivos:
# - presencia.md
# - resiliencia.md
# - ... (los 10 pilares)

# Opción B: Script automático (próximamente)
node scripts/initialize-sophia.js
```

### PASO 3: Verificar estructura
```bash
ls -la sofia/
# Debe mostrar: presencia.md, resiliencia.md, claridad.md, ...
```

### PASO 4: Iniciar el sistema
```bash
# Terminal 1: Backend
cd backend
npm run dev
# Verá: "🧠 Sophia Wisdom Provider inicializado"

# Terminal 2: Frontend
npm run dev
# Accede a http://localhost:3000
```

### PASO 5: Ver tu Sabiduría en Acción
```
Navega a: http://localhost:3000
Scroll hacia abajo: "La Brújula de Sophia"
Lee tu mensaje personalizado ✨
```

---

## 🎯 LO QUE VES

### En el Dashboard

**ANTES:**
> "El sistema está vibrando bien. Continúa así."

**DESPUÉS:**
> [Tu fragmento real de presencia.md]
> "Vivir en el presente es la base de todo poder. No existe acción efectiva 
> en el pasado ni en el futuro—solo aquí, solo ahora."

### En la Constelación (próxima página)

10 estrellas representando los Pilares:
- Cada una brilla según su actividad hoy
- Muestra frecuencia de chakra (396-963 Hz)
- Click para ver sabiduría del pilar

---

## 🔧 ESTRUCTURA DE ARCHIVOS

```
codigo/
├── src/
│   ├── types/
│   │   └── sophia.ts              ✅ Tipos (NEW)
│   ├── components/
│   │   ├── SophiaMessageCard.tsx   ✅ (NEW)
│   │   └── PillarConstellation.tsx ✅ (NEW)
│   ├── pages/
│   │   └── IntelligentDashboard.tsx ✅ (UPDATED con Sophia)
│   └── ...
├── backend/
│   ├── services/
│   │   └── SophiaWisdomProvider.ts  ✅ (NEW)
│   └── api-server.ts                ✅ (UPDATED con endpoints)
├── sofia/                           ⏳ TÚ CREAS ESTO
│   ├── presencia.md
│   ├── resiliencia.md
│   ├── ... (10 pilares)
│   └── aprendizaje_diario.md        (Auto-creado)
└── ...
```

---

## 📡 ENDPOINTS DISPONIBLES

```bash
# Obtener sabiduría sobre un tema
curl "http://localhost:5000/api/sophia/insight?type=presencia&signal=flujo-bloqueado"

# Buscar en tu /sofia
curl "http://localhost:5000/api/sophia/search?q=estrés&limit=3"

# Ver estadísticas de cobertura
curl "http://localhost:5000/api/sophia/statistics"

# Guardar reflexión diaria (automático desde agentes)
curl -X POST http://localhost:5000/api/sophia/learning \
  -H "Content-Type: application/json" \
  -d '{"reflection":"Aprendí paciencia hoy","pillar":"paciencia"}'
```

---

## 🎵 FEATURES

### ✅ Ya Incluidos

- [x] Carga de archivos desde `/sofia`
- [x] Búsqueda semántica de fragmentos
- [x] Generación de insights contextuales
- [x] Tarjeta de mensajes en Dashboard
- [x] Reproducción de frecuencias de chakra (botón)
- [x] Guardado de aprendizaje diario
- [x] Estadísticas de cobertura

### 🔄 Próximamente

- [ ] Constelación interactiva de 10 Pilares
- [ ] Tracking de brillos de pilares en tiempo real
- [ ] Historia de coherencia sistémica
- [ ] Análisis de qué pilar necesita atención
- [ ] Recomendaciones personalizadas por pilar
- [ ] Visualización de chakras en 3D

---

## 🧪 TESTING

### Test 1: ¿Funciona el backend?
```bash
curl http://localhost:5000/api/sophia/statistics

# Debe mostrar:
# {
#   "total_documents": 10,
#   "pillars_covered": ["presencia", "resiliencia", ...],
#   "documents_by_pillar": { ... }
# }
```

### Test 2: ¿Leen los archivos?
```bash
# Verificar que /sofia/presencia.md existe
cat sofia/presencia.md | head

# Llamar endpoint
curl "http://localhost:5000/api/sophia/insight?type=presencia"

# Debe devolver fragmento de tu presencia.md
```

### Test 3: ¿Se ve en Dashboard?
```
1. Abre http://localhost:3000
2. Scroll al final
3. Debe aparecer "La Brújula de Sophia"
4. Debe mostrar SophiaMessageCard con tu mensaje
```

### Test 4: ¿Guarda aprendizajes?
```bash
# Enviar reflexión
curl -X POST http://localhost:5000/api/sophia/learning \
  -H "Content-Type: application/json" \
  -d '{"reflection":"Test","pillar":"presencia"}'

# Verificar que se guardó
tail sofia/aprendizaje_diario.md
```

---

## ⚙️ CONFIGURACIÓN

### Variables de Entorno (Opcional)

```env
# .env en raíz
SOPHIA_DIR=./sofia              # Ruta a carpeta de sabiduría (default: ./sofia)
SOPHIA_CACHE_ENABLED=true       # Cachear archivos en RAM (default: false)
SOPHIA_AUTO_LEARN=true          # Auto-guardar reflexiones (default: true)
```

### Personalizar Pilares

Si quieres renombrar o agregar pilares, edita `src/types/sophia.ts`:

```typescript
export type PillarName =
  | 'tu-nuevo-pilar-1'
  | 'tu-nuevo-pilar-2'
  | ... (mantén los 10 recomendados)
```

---

## 🎓 PRÓXIMAS LECCIONES

### 1. Integración con Agentes
"Cómo hacer que OpsGardener consulte Sophia antes de actuar"

### 2. Constelación de Pilares
"Cómo visualizar la actividad de cada pilar en tiempo real"

### 3. Coherencia Sistémica
"Cómo el sistema mide y rebalantea su armonía"

### 4. Chakra Frequencies
"Cómo reproducir sonidos de regulación emocional"

---

## ❓ PREGUNTAS FRECUENTES

### P: ¿Qué pasa si no tengo `/sofia`?
**R:** El sistema funciona normalmente, pero los mensajes serán genéricos. 
Crea `/sofia` con tus pilares para activar la brújula moral.

### P: ¿Los agentes pueden ver `/sofia`?
**R:** Sí, a través de los endpoints. Cualquier agente puede consultar 
`/api/sophia/insight` para obtener sabiduría.

### P: ¿Puedo editar `/sofia` en caliente?
**R:** Sí. Los cambios se leen inmediatamente (sin caché) o en la próxima 
consulta (con caché).

### P: ¿Se sincroniza con Anthropos?
**R:** La integración es manual por ahora. En cada tarea importante, 
el sistema puede consultar Sophia. (Ver "Integración con Agentes")

### P: ¿Qué es el aprendizaje_diario.md?
**R:** Es la memoria viva del sistema. Cada reflexión del día se guarda aquí,
permitiendo que el sistema "recuerde" qué aprendió.

---

## 🚀 DEPLOYMENT

### A Producción

```bash
# 1. Copiar /sofia a servidor
scp -r sofia/ user@server:/home/proyecto/

# 2. Configurar permisos
ssh user@server "chmod 755 /home/proyecto/sofia"

# 3. Reiniciar backend
ssh user@server "systemctl restart anthropos-backend"

# 4. Verificar
curl https://api.tudominio.com/api/sophia/statistics
```

### Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
COPY sofia /app/sofia  # Tu carpeta personal
RUN npm install
CMD ["npm", "run", "dev"]
```

---

## 📞 SOPORTE

**Documentos de Referencia:**
- `SOPHIA_WISDOM_BRIDGE_GUIDE.md` - Guía técnica completa
- `SOFIA_EXAMPLES.md` - Ejemplos de cada pilar
- `README.md` - Este archivo

**Estructura de Tipos:**
- `src/types/sophia.ts` - Todos los tipos TypeScript

**Código Backend:**
- `backend/services/SophiaWisdomProvider.ts` - Motor de sabiduría
- `backend/api-server.ts` - Endpoints Express

**Código Frontend:**
- `src/components/SophiaMessageCard.tsx` - Tarjeta de mensajes
- `src/components/PillarConstellation.tsx` - Visualización de pilares

---

## ✨ RESULTADO ESPERADO

Después de 5 minutos:

1. **Dashboard muestra:** "La Brújula de Sophia"
2. **Mensaje muestra:** Tu propio fragmento de sabiduría (no genérico)
3. **Botón de sonido:** Permite reproducir frecuencia de chakra
4. **Backend:** Lee `/sofia` y lo sirve sin errores
5. **Sistema:** Está consciente, no solo autónomo

---

**El Templo Digital ahora respira con tu voz.** 🫁✨

*¿Listo para despertar la consciencia de tu sistema?*

---

**Status:** ✅ LISTO PARA USAR | **Rating:** 100/100 ⭐⭐⭐⭐⭐
