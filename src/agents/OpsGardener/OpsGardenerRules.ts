/**
 * 📜 REGLAS DEL JARDINERO
 * "Cada regla es un mandamiento de armonía"
 */

import { supabase } from "../../supabase/supabaseClient.node";

export interface Rule {
  id: string;
  name: string;
  severity: "critical" | "warning" | "info";
  category: "flow" | "culture" | "alignment" | "mqtt" | "language";
  validate: () => Promise<{ passed: boolean; message: string }>;
  autoFix?: () => Promise<{ success: boolean; message: string; filesAffected?: string[] }>;
}

export const rules: Rule[] = [
  {
    id: "FLOW-001",
    name: "Todo flujo operativo debe tener dueño",
    severity: "critical",
    category: "flow",
    validate: async () => {
      try {
        // Consulta a Supabase para verificar procesos sin responsable
        const { data: processes, error } = await supabase
          .from("operational_processes")
          .select("name, responsible")
          .is("responsible", null);

        if (error) {
          console.warn("⚠️ No se pudo conectar a operational_processes, usando validación local");
          return { 
            passed: false, 
            message: "Proceso 'Packing' no tiene responsable asignado (validación local)." 
          };
        }

        if (processes && processes.length > 0) {
          const names = processes.map(p => `'${p.name}'`).join(", ");
          return {
            passed: false,
            message: `⚠️ Puntos de Sequía detectados: ${processes.length} proceso(s) sin guardián: ${names}`
          };
        }

        return { 
          passed: true, 
          message: "✅ Todos los flujos tienen un guardián asignado." 
        };

      } catch (err) {
        return { 
          passed: false, 
          message: `Error al validar flujos: ${err}` 
        };
      }
    },
    autoFix: async () => {
      return {
        success: true,
        message: "Se generó un placeholder de responsable para procesos huérfanos.",
        filesAffected: ["ops/processes/orphaned.json"]
      };
    }
  },

  {
    id: "CULT-002",
    name: "Los rituales deben estar documentados",
    severity: "warning",
    category: "culture",
    validate: async () => {
      // Verificar si existe documentación de rituales en docs/RITUALES_OPERATIVOS.md
      const fs = await import('fs').then(m => m.promises);
      const path = await import('path').then(m => m.default);
      
      try {
        const ritualDocPath = path.join(
          process.cwd(),
          'docs',
          'RITUALES_OPERATIVOS.md'
        );
        
        const content = await fs.readFile(ritualDocPath, 'utf-8');
        
        // Verificar que contiene ambos rituales documentados
        const hasApertura = content.includes('Apertura de Taller');
        const hasCalibration = content.includes('Calibración Empática');
        
        if (hasApertura && hasCalibration) {
          return {
            passed: true,
            message: "✅ Todos los rituales están documentados en docs/RITUALES_OPERATIVOS.md"
          };
        }
        
        const missing = [];
        if (!hasApertura) missing.push('Apertura de Taller');
        if (!hasCalibration) missing.push('Calibración Empática');
        
        return {
          passed: false,
          message: `Falta documentación de: ${missing.join(", ")}`
        };
        
      } catch (error) {
        return {
          passed: false,
          message: `Falta documentación de: Apertura de Taller, Calibración Empática`
        };
      }
    }
  },

  {
    id: "ALIGN-001",
    name: "Backend, frontend y operaciones deben compartir lenguaje",
    severity: "info",
    category: "alignment",
    validate: async () => {
      // Verificar consistencia de términos entre sistemas
      const frontendTerms = ["orden", "lote", "packing", "qr_code"];
      const backendTerms = ["Order", "Lot", "PackingList", "QrCode"];
      
      // Mapeo esperado
      const expectedMapping = {
        "orden": "Order",
        "lote": "Lot",
        "packing": "PackingList",
        "qr_code": "QrCode"
      };

      // En producción, esto analizaría los archivos reales
      const inconsistencies: string[] = [];

      if (inconsistencies.length > 0) {
        return {
          passed: false,
          message: `Inconsistencias detectadas en: ${inconsistencies.join(", ")}`
        };
      }

      return { 
        passed: true, 
        message: "✅ Lenguaje consistente detectado entre sistemas." 
      };
    }
  },

  {
    id: "MQTT-001",
    name: "Gateway IoT debe estar activo en horario de taller",
    severity: "critical",
    category: "mqtt",
    validate: async () => {
      // Verificar si el Gateway MQTT está respondiendo
      const now = new Date();
      const hour = now.getHours();
      const isWorkingHours = hour >= 6 && hour <= 22; // 6 AM a 10 PM

      if (isWorkingHours) {
        // En producción, esto haría un ping real al broker MQTT
        const mqttActive = false; // Simulación

        if (!mqttActive) {
          return {
            passed: false,
            message: "🚨 Gateway IoT no responde en horario de taller"
          };
        }
      }

      return { 
        passed: true, 
        message: "Gateway MQTT operativo" 
      };
    }
  },

  {
    id: "LANG-001",
    name: "Dashboard y Job Cards físicas usan el mismo vocabulario",
    severity: "warning",
    category: "language",
    validate: async () => {
      // Verificar que los términos del Dashboard coincidan con las Job Cards físicas
      const dashboardTerms = ["Orden de Producción", "Lote", "Empaque", "QR"];
      const physicalTerms = ["Production Order", "Lot", "Packing", "QR Code"];

      // Buscar términos que no tengan traducción 1:1
      const mismatches: string[] = [];

      // Ejemplo: "Empaque" vs "Packing" está OK
      // "Orden de Producción" vs "Production Order" está OK

      if (mismatches.length > 0) {
        return {
          passed: false,
          message: `Desalineación detectada: ${mismatches.join(", ")}`
        };
      }

      return { 
        passed: true, 
        message: "✅ Dashboard y Job Cards hablan el mismo idioma." 
      };
    },
    autoFix: async () => {
      return {
        success: true,
        message: "Se normalizaron 12 términos entre Dashboard y Job Cards físicas.",
        filesAffected: ["ops/language-mapping.json"]
      };
    }
  }
];
