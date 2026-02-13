#!/usr/bin/env node
/**
 * 🗃️ Creador de Tablas del Jardinero en Supabase
 * Ejecuta el schema SQL directamente contra Supabase
 */

import { supabase } from "../src/supabase/supabaseClient.node";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     🗃️  CREANDO TABLAS DEL JARDINERO EN SUPABASE              ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

async function createTables() {
  try {
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, "..", "src", "supabase", "sql", "ops-gardener-schema.sql");
    
    if (!fs.existsSync(sqlPath)) {
      console.error(`❌ No se encontró el archivo SQL: ${sqlPath}`);
      process.exit(1);
    }

    const sqlContent = fs.readFileSync(sqlPath, "utf-8");
    
    console.log("📋 Ejecutando schema SQL en Supabase...\n");
    
    // Supabase no permite ejecutar SQL raw directamente desde el cliente JS
    // por seguridad. Debemos usar el SQL Editor o la API REST.
    
    console.log("⚠️ Las tablas deben crearse desde el SQL Editor de Supabase:");
    console.log("\n1. Abre: https://app.supabase.com/project/uikemwxbndwidqebeyre/sql");
    console.log("\n2. Copia TODO el contenido de:");
    console.log("   src/supabase/sql/ops-gardener-schema.sql");
    console.log("\n3. Pégalo en el editor y ejecuta (botón RUN)");
    
    console.log("\n📊 El schema creará:");
    console.log("   • operational_processes (7 flujos iniciales)");
    console.log("   • gardener_reports (reportes históricos)");
    console.log("   • iot_alerts (alertas MQTT)");
    console.log("   • language_mappings (6 mapeos iniciales)");
    console.log("   • 3 funciones RPC (get_latest_climate, etc.)");
    
    console.log("\n💡 Verificando tablas actuales...\n");
    
    // Intentar verificar tablas
    const tables = ["operational_processes", "gardener_reports", "iot_alerts", "language_mappings"];
    
    for (const tableName of tables) {
      const { data, error } = await supabase.from(tableName).select("*").limit(1);
      
      if (error) {
        if (error.code === "42P01") {
          console.log(`   ❌ ${tableName} → No existe (código 42P01)`);
        } else {
          console.log(`   ⚠️ ${tableName} → Error: ${error.message}`);
        }
      } else {
        console.log(`   ✅ ${tableName} → Existe (${data?.length || 0} registros de muestra)`);
      }
    }
    
    console.log("\n🔗 Abre este link para crear las tablas:");
    console.log("   https://app.supabase.com/project/uikemwxbndwidqebeyre/sql/new");
    
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

createTables();
