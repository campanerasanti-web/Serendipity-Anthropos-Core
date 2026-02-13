#!/usr/bin/env node

/**
 * 🌱 SISTEMA DE MUTACIÓN Y CRECIMIENTO DIARIO
 * 
 * Este script se ejecuta automáticamente cada día para:
 * 1. Generar snapshot del día actual
 * 2. Actualizar modelos de aprendizaje
 * 3. Crear reportes históricos
 * 4. Hacer crecer el conocimiento del sistema
 * 
 * Uso:
 *   node scripts/daily-mutation.mjs
 * 
 * Para automatizar (cron):
 *   0 23 * * * cd /path/to/codigo && node scripts/daily-mutation.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🎯 RUTAS
const BASE_PATH = path.join(__dirname, '../Serendipity bros 26');
const DATOS_ACTUALES = path.join(BASE_PATH, 'datos-actuales');
const HISTORICO = path.join(BASE_PATH, 'datos-historicos');
const APRENDIZAJE = path.join(BASE_PATH, 'aprendizaje');
const REPORTES = path.join(BASE_PATH, 'reportes-generados');

// 📅 FECHA ACTUAL
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const timestamp = today.toISOString();

console.log(`\n🌱 SISTEMA DE MUTACIÓN Y CRECIMIENTO`);
console.log(`📅 Fecha: ${year}-${month}-${day}`);
console.log(`⏰ Timestamp: ${timestamp}\n`);

// 📖 LEER DATOS ACTUALES
function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`❌ Error leyendo ${filePath}:`, error.message);
    return null;
  }
}

// 💾 GUARDAR JSON
function saveJSON(filePath, data) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Guardado: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error guardando ${filePath}:`, error.message);
  }
}

// 🔥 PASO 1: GENERAR SNAPSHOT DEL DÍA
console.log('📸 Paso 1: Generando snapshot del día...');

const financialState = loadJSON(path.join(DATOS_ACTUALES, 'financial-state.json'));
const teamRoster = loadJSON(path.join(DATOS_ACTUALES, 'team-roster.json'));
const invoices = loadJSON(path.join(DATOS_ACTUALES, 'invoices.json'));
const fixedCosts = loadJSON(path.join(DATOS_ACTUALES, 'fixed-costs.json'));

if (!financialState) {
  console.error('❌ No se pudo generar snapshot - datos financieros faltantes');
  process.exit(1);
}

// Generar alertas dinámicamente
const alertas = [];

if (financialState.praraPercentage > 75) {
  alertas.push({
    severity: 'CRITICAL',
    category: 'Revenue Concentration',
    message: `PRARA representa ${financialState.praraPercentage.toFixed(2)}% de ingresos - ALTO RIESGO`,
    recommendation: 'Diversificar base de clientes urgentemente',
    fechaDeteccion: timestamp
  });
}

if (financialState.errorRate > 5) {
  alertas.push({
    severity: 'MEDIUM',
    category: 'Quality Control',
    message: `Tasa de errores: ${financialState.errorRate.toFixed(1)}% (objetivo: <5%)`,
    recommendation: 'Implementar capacitación adicional en QC',
    fechaDeteccion: timestamp
  });
}

const snapshot = {
  fecha: `${year}-${month}-${day}`,
  timestamp,
  datosFinancieros: {
    totalMonthlyRevenue: financialState.totalMonthlyRevenue,
    totalMonthlyExpenses: financialState.totalMonthlyExpenses,
    grossMargin: financialState.grossMargin,
    grossMarginPercentage: financialState.grossMarginPercentage,
    payroll: financialState.payroll,
    praraPercentage: financialState.praraPercentage,
    customerCount: financialState.customerCount,
    employeeCount: financialState.employeeCount,
    errorRate: financialState.errorRate,
    onTimeDeliveryRate: financialState.onTimeDeliveryRate
  },
  alertasGeneradas: alertas,
  metricasOperativas: {
    errorRate: financialState.errorRate,
    onTimeDeliveryRate: financialState.onTimeDeliveryRate,
    activeOrdersMonth: financialState.activeOrdersMonth,
    ventasPorEmpleado: Math.round(financialState.totalMonthlyRevenue / financialState.employeeCount)
  },
  estadoSistema: 'operativo',
  notas: `Snapshot automático del día ${day} de ${getMonthName(parseInt(month))} ${year}`
};

// Guardar snapshot histórico
const historicPath = path.join(HISTORICO, year.toString(), month, `${day}-snapshot.json`);
saveJSON(historicPath, snapshot);

// 🧠 PASO 2: ACTUALIZAR MODELOS DE APRENDIZAJE
console.log('\n🧠 Paso 2: Actualizando modelos de aprendizaje...');

const modelosPath = path.join(APRENDIZAJE, 'modelos-proyeccion.json');
let modelos = loadJSON(modelosPath) || {
  version: '1.0.0',
  ultimaActualizacion: timestamp,
  modelosActivos: {},
  metricas: { diasConDatos: 0 }
};

// Contar días con datos históricos
const historicFiles = getAllHistoricFiles();
const diasConDatos = historicFiles.length;

modelos.ultimaActualizacion = timestamp;
modelos.metricas.diasConDatos = diasConDatos;
modelos.metricas.estadoAprendizaje = diasConDatos < 7 ? 'inicializando' : diasConDatos < 30 ? 'aprendiendo' : 'maduro';

// Calcular proyecciones simples si hay suficientes datos
if (diasConDatos >= 3) {
  const recentSnapshots = historicFiles.slice(-3).map(f => loadJSON(f));
  const avgRevenue = recentSnapshots.reduce((sum, s) => sum + s.datosFinancieros.totalMonthlyRevenue, 0) / recentSnapshots.length;
  const growth = ((financialState.totalMonthlyRevenue - avgRevenue) / avgRevenue) * 100;

  modelos.modelosActivos.proyeccionVentas = {
    algoritmo: 'promedio-movil-3-dias',
    precision: diasConDatos >= 7 ? 0.75 : 0.5,
    datosEntrenamiento: diasConDatos,
    ultimoEntrenamiento: timestamp,
    promedioMovil: avgRevenue,
    tendenciaCrecimiento: growth.toFixed(2) + '%'
  };
}

saveJSON(modelosPath, modelos);

// 📊 PASO 3: GENERAR REPORTE MARKDOWN
console.log('\n📊 Paso 3: Generando reporte markdown...');

const reportMarkdown = `# 📊 Reporte Diario - ${day}/${month}/${year}

## 💰 Estado Financiero

- **Revenue Mensual**: ${formatVND(financialState.totalMonthlyRevenue)} VND
- **Gastos Mensuales**: ${formatVND(financialState.totalMonthlyExpenses)} VND
- **Margen Bruto**: ${financialState.grossMarginPercentage.toFixed(2)}%
- **Nómina**: ${formatVND(financialState.payroll)} VND
- **PRARA %**: ${financialState.praraPercentage.toFixed(2)}%

## 👥 Equipo

- **Total personas**: ${financialState.employeeCount}
- **Ventas por empleado**: ${formatVND(Math.round(financialState.totalMonthlyRevenue / financialState.employeeCount))} VND

## 📈 Métricas Operativas

- **Error Rate**: ${financialState.errorRate.toFixed(1)}%
- **On-Time Delivery**: ${financialState.onTimeDeliveryRate.toFixed(1)}%
- **Órdenes activas**: ${financialState.activeOrdersMonth}

## 🚨 Alertas Generadas: ${alertas.length}

${alertas.map((a, i) => `### ${i+1}. [${a.severity}] ${a.category}

**Mensaje**: ${a.message}

**Recomendación**: ${a.recommendation}

---
`).join('\n')}

## 🧠 Sistema de Aprendizaje

- **Días con datos**: ${diasConDatos}
- **Estado**: ${modelos.metricas.estadoAprendizaje}
- **Precision proyecciones**: ${modelos.modelosActivos.proyeccionVentas?.precision || 'N/A'}

---

*Reporte generado automáticamente por el sistema el ${timestamp}*
`;

const reportPath = path.join(REPORTES, `reporte-${year}-${month}-${day}.md`);
fs.mkdirSync(REPORTES, { recursive: true });
fs.writeFileSync(reportPath, reportMarkdown, 'utf8');
console.log(`✅ Reporte: ${reportPath}`);

// 🎉 RESUMEN FINAL
console.log(`\n🎉 MUTACIÓN COMPLETA`);
console.log(`✅ Snapshot guardado en histórico`);
console.log(`✅ Modelos actualizados (${diasConDatos} días de datos)`);
console.log(`✅ Reporte markdown generado`);
console.log(`\n💡 El sistema ha crecido. Total días con datos: ${diasConDatos}`);

// 🛠️ FUNCIONES AUXILIARES
function getAllHistoricFiles() {
  const files = [];
  const yearsPath = HISTORICO;
  
  if (!fs.existsSync(yearsPath)) return files;
  
  const years = fs.readdirSync(yearsPath);
  
  years.forEach(year => {
    const yearPath = path.join(yearsPath, year);
    if (!fs.statSync(yearPath).isDirectory()) return;
    
    const months = fs.readdirSync(yearPath);
    
    months.forEach(month => {
      const monthPath = path.join(yearPath, month);
      if (!fs.statSync(monthPath).isDirectory()) return;
      
      const days = fs.readdirSync(monthPath).filter(f => f.endsWith('-snapshot.json'));
      
      days.forEach(day => {
        files.push(path.join(monthPath, day));
      });
    });
  });
  
  return files.sort();
}

function formatVND(amount) {
  return amount.toLocaleString('es-ES');
}

function getMonthName(month) {
  const names = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return names[month - 1];
}
