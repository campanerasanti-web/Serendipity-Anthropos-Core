#!/usr/bin/env node
/**
 * 🌱 Ejecutor del Jardinero de Operaciones
 * 
 * USO:
 *   npm run ops:gardener           → Modo harmonize (por defecto)
 *   npm run ops:gardener audit     → Solo inspección
 *   npm run ops:gardener repair    → Inspección + auto-fix
 *   npm run ops:gardener full      → Ciclo completo
 *   npm run ops:watch               → Vigilancia silenciosa
 */

import { OpsGardenerAgent, OpsMode } from "../src/agents/OpsGardener/OpsGardenerAgent";

// Determinar el modo desde argumentos de línea de comandos
const modeArg = process.argv[2] as OpsMode | undefined;
const validModes: OpsMode[] = ["audit", "repair", "harmonize", "full"];

const mode: OpsMode = modeArg && validModes.includes(modeArg) ? modeArg : "harmonize";
const isSilent = process.argv.includes("--silent") || process.argv.includes("-s");
const autoFix = process.argv.includes("--auto-fix") || mode === "repair";

// Configuración del Jardinero
const config = {
  mode,
  autoFix,
  mqttEnabled: true,
  silentMode: isSilent
};

// ASCII Art Header
if (!isSilent) {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     🌱  AGENTE JARDINERO DE OPERACIONES - SERENDIPITY BROS     ║
║                                                                ║
║     "El que cuida los flujos, cuida la cosecha"               ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
}

// Ejecutar el Jardinero
async function main() {
  try {
    const gardener = new OpsGardenerAgent(config);
    const results = await gardener.run();

    // Mostrar estadísticas finales
    if (!isSilent) {
      const stats = gardener.getStats();
      
      console.log("\n📈 ESTADÍSTICAS FINALES:");
      console.log(`   Duración: ${stats.duration}ms`);
      console.log(`   Reglas: ${stats.rules.passed}/${stats.rules.total} OK`);
      console.log(`   Tareas: ${stats.tasks.successful}/${stats.tasks.total} OK`);
      
      if (stats.rules.critical > 0) {
        console.log(`   🚨 ${stats.rules.critical} issue(s) crítico(s) detectado(s)`);
      }

      console.log("\n✨ El Jardinero ha completado su recorrido.\n");
    }

    // Salir con código de error si hay issues críticos
    process.exit(gardener.getStats().rules.critical > 0 ? 1 : 0);

  } catch (error) {
    console.error("\n💥 Error fatal en el Jardinero:");
    console.error(error);
    process.exit(1);
  }
}

main();
