#!/usr/bin/env node
/**
 * 🌙 Vigilancia Nocturna - Modo Silencioso
 * 
 * Ejecuta el Jardinero en modo harmonize cada hora durante la noche
 * (22:00 - 06:00) sin generar logs en consola.
 */

import { OpsGardenerAgent } from "../src/agents/OpsGardener/OpsGardenerAgent";
import * as fs from "fs";
import * as path from "path";

const WATCH_INTERVAL = 60 * 60 * 1000; // 1 hora
const WATCH_START_HOUR = 22; // 10 PM
const WATCH_END_HOUR = 6;    // 6 AM

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     🌙  VIGILANCIA NOCTURNA - EL JARDINERO SILENCIOSO          ║
║                                                                ║
║     Horario: 22:00 - 06:00                                     ║
║     Intervalo: Cada hora                                       ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

async function runNightWatch() {
  const now = new Date();
  const hour = now.getHours();

  // Solo ejecutar en horario nocturno
  if (hour < WATCH_START_HOUR && hour >= WATCH_END_HOUR) {
    console.log(`⏰ Fuera de horario de vigilancia (${hour}:00). Esperando...`);
    return;
  }

  console.log(`\n🌙 Iniciando recorrido nocturno [${now.toLocaleTimeString("es-ES")}]...`);

  try {
    const gardener = new OpsGardenerAgent({
      mode: "harmonize",
      autoFix: false,
      mqttEnabled: true,
      silentMode: true
    });

    await gardener.run();
    const stats = gardener.getStats();

    // Log mínimo en consola
    console.log(`   ✅ Completado en ${stats.duration}ms`);
    console.log(`   Reglas: ${stats.rules.passed}/${stats.rules.total} OK`);
    console.log(`   Críticos: ${stats.rules.critical}`);

    // Guardar log detallado en archivo
    const logDir = path.join(process.cwd(), "ops", "logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, `watch-${now.toISOString().split("T")[0]}.jsonl`);
    const logEntry = JSON.stringify({
      timestamp: now.toISOString(),
      stats,
      alerts: stats.rules.critical > 0 ? "🚨 ENERGÍA INUSUAL DETECTADA" : null
    }) + "\n";

    fs.appendFileSync(logFile, logEntry, "utf-8");

    // Alerta si hay issues críticos
    if (stats.rules.critical > 0) {
      console.log(`   🚨 ALERTA: ${stats.rules.critical} issue(s) crítico(s) detectado(s)`);
      console.log(`   Ver reporte en ops/reports/`);
    }

  } catch (error) {
    console.error(`   ❌ Error en recorrido nocturno:`, error);
  }
}

async function startWatchLoop() {
  console.log("\n🌙 Vigilancia nocturna activada.");
  console.log("   Presiona Ctrl+C para detener.\n");

  // Ejecutar inmediatamente al inicio
  await runNightWatch();

  // Configurar intervalo
  setInterval(async () => {
    await runNightWatch();
  }, WATCH_INTERVAL);
}

startWatchLoop();
