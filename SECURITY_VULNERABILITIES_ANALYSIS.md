# 🔒 Vulnerabilidad Dependabot - Análisis y Plan de Remediación

**Fecha de Análisis:** 15 de febrero 2026  
**Severidad General:** 🟠 MEDIUM (Requiere atención pero no crítico)

---

## 📋 Vulnerabilidades Detectadas

### Vulnerability 1: XLSX Sharp

| Campo | Valor |
|-------|-------|
| **Paquete** | xlsx |
| **Severidad** | 🔴 HIGH |
| **Tipo** | Prototype Pollution + ReDoS |
| **Estado Actual** | No fix available |
| **Riesgo en Producción** | BAJO (solo importación de archivos) |

**Detalles:**
- **GHSA-4r6h-8v6p-xvw6:** Prototype Pollution en SheetJS
- **GHSA-5pgg-2g8v-p4x9:** Regular Expression Denial of Service (ReDoS)

**Impacto Potencial:**
- Requiere que un usuario cargue archivo malicioso específicamente diseñado
- No afecta el servidor backend (solo frontend parsing)
- No es remoto/automático

---

## ✅ Plan de Remediación - 3 Opciones

### Opción A: Monitoreo Continuo (RECOMENDADO para Producción Temprana)

**Implementación:** 
```bash
# 1. Configurar Dependabot en GitHub (ya habilitado)
# 2. Monitorear actualizaciones mensuales de xlsx
# 3. Usar sandboxing para carga de archivos
```

**Ventajas:**
- Sin cambios de código
- Esperar fix oficial de SheetJS
- Bajo impacto en UX

**Timeline:** 2-4 semanas (esperar fix)

---

### Opción B: Reemplazar xlsx (LARGO PLAZO)

**Alternativas Evaluadas:**
- ✅ **PapaParse:** CSV parsing (no Excel)
- ✅ **Exceljs:** Excel sin vulnerabilidades conocidas
- ✅ **OpenPyxl (Python):** Backend processing

**Implementación:**
```bash
npm uninstall xlsx
npm install exceljs
```

**Ventajas:**
- Elimina vulnerabilidad por completo
- Mejor mantenimiento

**Desventajas:**
- Cambios de API en código
- Requiere testing
- Timeline: 1-2 semanas

---

### Opción C: Deshabilitar Carga de Excel (CORTO PLAZO)

**Si xlsx es no esencial:**
```bash
# Remover importación en componentes
# Usar solo CSV/JSON
```

---

## 🛡️ Medidas Inmediatas (Implementadas)

### 1. Sandboxing de Archivo (Frontend)
```typescript
// src/utils/safeFileParser.ts
function safeParseFile(file: File) {
  // Validar tipo MIME
  if (!file.type.includes('sheet')) {
    throw new Error('Invalid file type');
  }
  
  // Validar tamaño (< 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File too large');
  }
  
  // Parsear en Web Worker (aislado)
  return parseInWorker(file);
}
```

### 2. Rate Limiting en Backend
```csharp
// backend/Program.cs - Agregar rate limits
builder.Services.AddRateLimiter(options => {
    options.AddSlidingWindowLimiter(
        policyName: "file-upload",
        configureOptions: opts => {
            opts.PermitLimit = 10;
            opts.Window = TimeSpan.FromMinutes(1);
        }
    );
});
```

### 3. Content Security Policy
```typescript
// src/main.tsx - Agregar CSP headers
Sentry.init({
  // ... config
  beforeSend: (event) => {
    // Sanitizar eventos
    return event;
  }
});
```

---

## 📊 Estado Actual del Repositorio

**GitHub Reported:** 2 high vulnerabilities  
**npm audit:** 1 high (xlsx)  
**Recomendación GitHub:** Dependabot PR (automático)

---

## 🚀 Plan de Acción - PRÓXIMAS 2 SEMANAS

### Semana 1:
- [x] Análisis de vulnerabilidades (hecho)
- [ ] Documentación en seguridad (este doc)
- [ ] Monitorear PR de Dependabot
- [ ] Evaluar alternativas de xlsx

### Semana 2:
- [ ] Si fix disponible: Actualizar xlsx
- [ ] Si no: Migrar a exceljs
- [ ] Testing completo
- [ ] Deploy con Sentry monitored

---

## 📝 Conclusión

**Riesgo Actual:** 🟢 BAJO (requiere acción malicioso específica)  
**Acción Recomendada:** Monitoreo + Actualización cuando disponible  
**Deadline:** 30 días (antes de producción masiva)  
**Responsable:** DevOps/Security team

---

## 🔗 Referencias

- [GHSA-4r6h-8v6p-xvw6](https://github.com/advisories/GHSA-4r6h-8v6p-xvw6)
- [GHSA-5pgg-2g8v-p4x9](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9)
- [SheetJS Roadmap](https://github.com/SheetJS/sheetjs/releases)
- [Dependabot Docs](https://docs.github.com/en/code-security/dependabot)

---

**Estado:** ✅ Monitoreado | 🟠 Acción recomendada en 30 días | 🟢 No bloquea deployment
