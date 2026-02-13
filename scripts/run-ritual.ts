#!/usr/bin/env node
/**
 * 🌅 Ritual de Apertura - Viernes 13, 8:00 AM
 * 
 * Ejecuta TASK-CULT-001: Preparación del taller para la jornada
 */

import { OpsGardenerAgent } from "../src/agents/OpsGardener/OpsGardenerAgent";

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     🌅  RITUAL DE APERTURA - EL MEDIADOR DE SOFÍA              ║
║                                                                ║
║     Viernes 13 de Febrero, 2026 - 8:00 AM                     ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

async function main() {
  try {
    const gardener = new OpsGardenerAgent({
      mode: "full",
      autoFix: true,
      mqttEnabled: true,
      silentMode: false,
      scheduledTime: "08:00"
    });

    console.log("🙏 Iniciando ritual de apertura...\n");
    
    const results = await gardener.run();
    const stats = gardener.getStats();

    // Verificar si el taller está listo
    const allClear = stats.rules.critical === 0;

    if (allClear) {
      console.log("\n🌍 SEÑAL: TIERRA FÉRTIL");
      console.log("   El taller está listo para la jornada.");
      console.log("   Todos los flujos tienen su guardián.\n");
    } else {
      console.log("\n⚠️ SEÑAL: AJUSTES NECESARIOS");
      console.log(`   ${stats.rules.critical} issue(s) crítico(s) requieren atención.`);
      console.log("   Revisar informe antes de iniciar operaciones.\n");
    }

    console.log("🙏 Ritual completado. Que la jornada sea próspera.\n");

    process.exit(allClear ? 0 : 1);

  } catch (error) {
    console.error("\n💥 Error en el ritual:");
    console.error(error);
    process.exit(1);
  }
}

main();
