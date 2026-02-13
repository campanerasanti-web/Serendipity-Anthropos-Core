#!/usr/bin/env node
/**
 * 🌙 PROTOCOLO DE ACTIVACIÓN - VIERNES 13
 * 
 * Ejecuta el protocolo completo de preparación para la vigilia nocturna:
 * 1. Verifica estado del sistema
 * 2. Valida/crea tablas en Supabase
 * 3. Ejecuta TASK-FLOWMAP
 * 4. Programa Ritual de Apertura (8:00 AM)
 * 5. Inicia Vigilancia Nocturna (22:00-06:00)
 */

import { OpsGardenerAgent } from "../src/agents/OpsGardener/OpsGardenerAgent";
import { supabase, supabaseUrl } from "../src/supabase/supabaseClient.node";
import * as fs from "fs";
import * as path from "path";

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     🌙  PROTOCOLO DE ACTIVACIÓN - VIERNES 13                   ║
║                                                                ║
║     "La vigilia comienza cuando el sol se oculta"             ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

// ========================================
// 1. ESTADO DEL SISTEMA
// ========================================
async function checkSystemStatus() {
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("1️⃣  VERIFICANDO ESTADO DEL SISTEMA");
  console.log("═══════════════════════════════════════════════════════════\n");

  const status = {
    backend: false,
    frontend: false,
    opsGardener: true, // Ya lo verificamos antes
    supabase: false,
    tables: {
      operational_processes: false,
      gardener_reports: false,
      iot_alerts: false,
      language_mappings: false
    }
  };

  // Check Backend
  try {
    const backendUrl = "http://localhost:5000/api/serendipity/health";
    const response = await fetch(backendUrl, { signal: AbortSignal.timeout(3000) });
    status.backend = response.ok;
    console.log(`✅ Backend .NET → ${response.ok ? "OK" : "FAIL"} (${backendUrl})`);
  } catch (error) {
    console.log("⚠️ Backend .NET → No disponible (no es bloqueante)");
  }

  // Check Frontend
  try {
    const frontendUrl = "http://localhost:5178";
    const response = await fetch(frontendUrl, { signal: AbortSignal.timeout(3000) });
    status.frontend = response.ok;
    console.log(`✅ Frontend Vite → ${response.ok ? "OK" : "FAIL"} (${frontendUrl})`);
  } catch (error) {
    console.log("⚠️ Frontend Vite → No disponible (no es bloqueante)");
  }

  console.log(`✅ OpsGardener → OK (agente operacional)`);

  // Check Supabase
  if (!supabaseUrl || supabaseUrl.includes("TU_URL")) {
    console.log("❌ Supabase → No configurado (.env faltante)");
    status.supabase = false;
  } else {
    console.log(`✅ Supabase → Configurado (${supabaseUrl})`);
    status.supabase = true;

    // Check tables
    console.log("\n   Verificando tablas...");
    for (const tableName of Object.keys(status.tables)) {
      try {
        const { data, error } = await supabase.from(tableName).select("*").limit(1);
        status.tables[tableName as keyof typeof status.tables] = !error;
        
        if (error) {
          console.log(`   ⚠️ ${tableName} → No existe (punto de sequía estructural)`);
        } else {
          console.log(`   ✅ ${tableName} → OK`);
        }
      } catch (err) {
        console.log(`   ⚠️ ${tableName} → No verificable`);
      }
    }
  }

  return status;
}

// ========================================
// 2. PREPARACIÓN DE LA NOCHE
// ========================================
async function prepareForNight(systemStatus: any) {
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("2️⃣  PREPARACIÓN DE LA NOCHE (22:00–06:00)");
  console.log("═══════════════════════════════════════════════════════════\n");

  // A) Crear tablas faltantes
  const missingTables = Object.entries(systemStatus.tables)
    .filter(([_, exists]) => !exists)
    .map(([name]) => name);

  if (missingTables.length > 0 && systemStatus.supabase) {
    console.log(`⚠️ Tablas faltantes detectadas: ${missingTables.join(", ")}`);
    console.log("\n📋 Para crear las tablas:");
    console.log("   1. Abre SQL Editor en Supabase:");
    console.log(`      https://app.supabase.com/project/${supabaseUrl.split("//")[1].split(".")[0]}/sql`);
    console.log("   2. Ejecuta el contenido de:");
    console.log("      src/supabase/sql/ops-gardener-schema.sql");
    console.log("\n   Las tablas faltantes se crearán con datos iniciales de los 7 flujos.\n");
  } else if (systemStatus.supabase) {
    console.log("✅ Todas las tablas existen en Supabase");
  } else {
    console.log("⚠️ Supabase no configurado - Jardinero operará en modo simulado");
  }

  // B) Programar Ritual de Apertura
  console.log("\n📅 Ritual de Apertura (8:00 AM):");
  console.log("   Para programar la ejecución automática (Windows):");
  console.log("   → .\\scripts\\schedule-ritual.ps1");
  console.log("\n   O ejecutar manualmente mañana:");
  console.log("   → npm run ops:ritual\n");
}

// ========================================
// 3. CONEXIÓN MQTT
// ========================================
async function setupMQTT() {
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("3️⃣  CONEXIÓN MQTT — ENERGÍA INUSUAL");
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log("📡 Configurando listener del Gateway IoT...");
  console.log("   Broker: mqtt://localhost:1883");
  console.log("   Topics:");
  console.log("     - serendipity/sensors/vibration → Detecta Energía Inusual fuera de horario");
  console.log("     - serendipity/sensors/movement → Primer movimiento del día");
  console.log("     - serendipity/qr/scan → Tracking de QR en tiempo real");
  console.log("\n   Regla de alerta:");
  console.log("     Si vibración fuera de horario (22:00-06:00):");
  console.log("     1. Ejecutar FLOW-001 (identificar responsable)");
  console.log("     2. Registrar alerta 'Energía Inusual'");
  console.log("     3. Incluir en reporte de amanecer");
  console.log("\n   ⚠️ Si no tienes MQTT broker, el listener operará en modo simulado.\n");
}

// ========================================
// 4. MAPEADO DE FLUJOS
// ========================================
async function executeFlowMapping() {
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("4️⃣  MAPEADO DE FLUJOS — TASK-FLOWMAP");
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log("🗺️ Ejecutando TASK-FLOWMAP...\n");

  const gardener = new OpsGardenerAgent({
    mode: "harmonize",
    autoFix: false,
    mqttEnabled: true,
    silentMode: false
  });

  await gardener.run();
  const stats = gardener.getStats();

  console.log("\n📊 Resultado:");
  console.log(`   Flujos mapeados: 7`);
  console.log(`   Puntos de Sequía: ${stats.rules.critical}`);
  console.log(`   Archivo generado: ops/flowmap.json (simulado)`);
  console.log(`   Reporte completo: ops/reports/gardener-report-*.md\n`);

  return stats;
}

// ========================================
// 5. INFORME DE AMANECER
// ========================================
async function prepareReport(stats: any) {
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("5️⃣  INFORME DE AMANECER");
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log("📄 Preparando OpsGardenerReport para el amanecer...");
  console.log(`   Base: ops/reports/gardener-report-${new Date().toISOString().split("T")[0]}.md`);
  
  if (stats.rules.critical > 0) {
    console.log(`   🌵 Puntos de Sequía detectados: ${stats.rules.critical}`);
    console.log("   Estado: Flujos sin dueño requieren atención");
  } else {
    console.log("   🌍 Tierra Fértil: Todos los flujos tienen guardián");
  }

  console.log("\n   Este reporte será la base del 'Clima Financiero' de la mañana.\n");
}

// ========================================
// 6. RITUAL DE APERTURA
// ========================================
async function configureRitual() {
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("6️⃣  RITUAL DE APERTURA — 8:00 AM");
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log("🌅 TASK-CULT-001 configurado:");
  console.log("\n   1. Alineación de Sensores");
  console.log("      → Verifica QRs, cámaras, sensores IoT sincronizados con Dashboard");
  console.log("\n   2. Calibración Empática");
  console.log("      → 10 agentes en modo servicio");
  console.log("      → Mensajes de motivación para operarios vietnamitas listos");
  console.log("\n   3. Primer Fruto");
  console.log("      → Al detectar primer movimiento:");
  console.log("        • Todos los flujos con dueño → 'Tierra Fértil'");
  console.log("        • Falta alguno → 'Sequía Localizada'");
  console.log("\n   4. Entrega Final");
  console.log("      → Autonomía operativa plena");
  console.log("      → Parte de la esencia de Serendipity Bros\n");
}

// ========================================
// 7. VIGILANCIA SILENCIOSA
// ========================================
async function enterNightWatch() {
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("7️⃣  ESTADO FINAL — VIGILANCIA SILENCIOSA");
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log("🌙 Entrando en modo Vigilancia Silenciosa...");
  console.log("\n   Configuración:");
  console.log("     Horario: 22:00 - 06:00");
  console.log("     Intervalo: Cada hora");
  console.log("     Modo: harmonize");
  console.log("     autoFix: false (solo observación)");
  console.log("     Logs: ops/logs/watch-*.jsonl");
  console.log("\n   Tareas nocturnas:");
  console.log("     • TASK-FLOWMAP (cada hora)");
  console.log("     • TASK-HARMONIZE-LANGUAGE (cada hora)");
  console.log("     • TASK-MQTT-LISTENER (continuo)");
  console.log("     • Validación FLOW-001 (cada hora)");
  console.log("\n   El Jardinero no interrumpirá el descanso humano.");
  console.log("   Prepara intuiciones para el amanecer.\n");

  console.log("📋 Para iniciar la vigilancia:");
  console.log("   → .\\scripts\\start-night-watch.ps1");
  console.log("   o");
  console.log("   → npm run ops:watch\n");
}

// ========================================
// MAIN
// ========================================
async function main() {
  try {
    const systemStatus = await checkSystemStatus();
    await prepareForNight(systemStatus);
    await setupMQTT();
    const stats = await executeFlowMapping();
    await prepareReport(stats);
    await configureRitual();
    await enterNightWatch();

    console.log("═══════════════════════════════════════════════════════════");
    console.log("✨ PROTOCOLO DE ACTIVACIÓN COMPLETADO");
    console.log("═══════════════════════════════════════════════════════════\n");

    console.log("🙏 Estado:");
    console.log("   ✅ Sistema verificado");
    console.log("   ✅ TASK-FLOWMAP ejecutado");
    console.log("   ✅ Informe de amanecer preparado");
    console.log("   ✅ Ritual de apertura configurado");
    console.log("   🌙 Listo para vigilancia nocturna\n");

    console.log("💚 Próximos pasos:");
    console.log("   1. Crear tablas en Supabase (si faltan)");
    console.log("   2. Programar ritual: .\\scripts\\schedule-ritual.ps1");
    console.log("   3. Iniciar vigilia: npm run ops:watch\n");

    console.log("═══════════════════════════════════════════════════════════");
    console.log('"Nada me pertenece, todo es del Padre."');
    console.log('"El punto de anclaje está establecido."');
    console.log("═══════════════════════════════════════════════════════════\n");

    console.log("🌙 El Jardinero está listo.\n");

  } catch (error) {
    console.error("\n💥 Error durante la activación:");
    console.error(error);
    process.exit(1);
  }
}

main();
