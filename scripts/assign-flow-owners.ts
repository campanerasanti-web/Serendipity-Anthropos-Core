#!/usr/bin/env tsx
/**
 * Asigna responsables a los flujos operativos sin guardián
 * Resuelve el estado TORMENTA del Clima Financiero
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function assignFlowOwners() {
  console.log('\n🌱 Asignando guardianes a los flujos huérfanos...\n');

  try {
    // 1. Actualizar "Recepción de Orden"
    const { data: recepcion, error: error1 } = await supabase
      .from('operational_processes')
      .update({ 
        responsible: 'Santiago Campanera',
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('name', 'Recepción de Orden')
      .select();

    if (error1) {
      console.error('❌ Error actualizando Recepción de Orden:', error1);
    } else {
      console.log('✅ Guardián asignado a "Recepción de Orden"');
      console.log('   Responsable: Santiago Campanera\n');
    }

    // 2. Actualizar "Empaque (Packing)"
    const { data: empaque, error: error2 } = await supabase
      .from('operational_processes')
      .update({ 
        responsible: 'Equipo de Producción',
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('name', 'Empaque (Packing)')
      .select();

    if (error2) {
      console.error('❌ Error actualizando Empaque:', error2);
    } else {
      console.log('✅ Guardián asignado a "Empaque (Packing)"');
      console.log('   Responsable: Equipo de Producción\n');
    }

    // 3. Verificar todos los flujos
    const { data: allFlows, error: error3 } = await supabase
      .from('operational_processes')
      .select('name, responsible, status')
      .order('name');

    if (error3) {
      console.error('❌ Error consultando flujos:', error3);
      return;
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📊 ESTADO FINAL DE LOS FLUJOS OPERATIVOS');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let orphanCount = 0;
    allFlows?.forEach((flow: any) => {
      const icon = flow.responsible ? '✅' : '🚨';
      const status = flow.status === 'active' ? '🟢' : '⚫';
      console.log(`${icon} ${status} ${flow.name}`);
      console.log(`   └─ Responsable: ${flow.responsible || '(sin asignar)'}\n`);
      if (!flow.responsible) orphanCount++;
    });

    console.log('═══════════════════════════════════════════════════════════════');
    if (orphanCount === 0) {
      console.log('🌞 CLIMA FINANCIERO: SOLEADO');
      console.log('   Todos los flujos tienen guardián asignado.\n');
    } else {
      console.log(`⚠️ CLIMA FINANCIERO: Quedan ${orphanCount} flujo(s) sin guardián.\n`);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar
assignFlowOwners();
