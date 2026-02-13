#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;

// Helper function to create directories recursively
function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

console.log('\n🎯 INICIANDO PRARA SALES PIPELINE\n');
console.log('📅 Fecha: ' + new Date().toISOString().split('T')[0]);
console.log('⏰ Hora: ' + new Date().toLocaleTimeString());

// Create directory structure
const pipelineDir = path.join(rootDir, 'sales-pipeline');
const prospectDir = path.join(pipelineDir, 'prospects');
const templatesDir = path.join(pipelineDir, 'templates');
const metricsDir = path.join(pipelineDir, 'metrics');

ensureDirSync(prospectDir);
ensureDirSync(templatesDir);
ensureDirSync(metricsDir);
console.log('✅ Estructura creada en: sales-pipeline/');

// Create prospect database
const prospectDatabase = {
  metadata: {
    version: '1.0',
    createdAt: new Date().toISOString(),
    totalProspects: 5,
    stage: 'INITIALIZATION'
  },
  prospects: [
    {
      id: 'PROSPECT_001',
      company: 'PharmaCorp Vietnam',
      industry: 'Pharmaceuticals',
      region: 'Ho Chi Minh City',
      estimatedRevenue: 200,
      contactEmail: 'sales@pharmacorp.vn',
      status: 'RESEARCH',
      priority: 'HIGH'
    },
    {
      id: 'PROSPECT_002',
      company: 'ExportTech Solutions',
      industry: 'Manufacturing/Export',
      region: 'Hanoi',
      estimatedRevenue: 180,
      contactEmail: 'contact@exporttech.vn',
      status: 'RESEARCH',
      priority: 'HIGH'
    },
    {
      id: 'PROSPECT_003',
      company: 'Logistics Vietnam Group',
      industry: 'Supply Chain',
      region: 'Can Tho',
      estimatedRevenue: 220,
      contactEmail: 'biz@logisticsvn.com',
      status: 'RESEARCH',
      priority: 'MEDIUM'
    },
    {
      id: 'PROSPECT_004',
      company: 'BioTech Asia',
      industry: 'Biotechnology',
      region: 'Da Nang',
      estimatedRevenue: 190,
      contactEmail: 'partnerships@biotech-asia.vn',
      status: 'RESEARCH',
      priority: 'HIGH'
    },
    {
      id: 'PROSPECT_005',
      company: 'Fashion Forward Vietnam',
      industry: 'Textile/Apparel',
      region: 'Ho Chi Minh City',
      estimatedRevenue: 150,
      contactEmail: 'ceo@fashionvn.com',
      status: 'RESEARCH',
      priority: 'MEDIUM'
    }
  ]
};

fs.writeFileSync(
  path.join(prospectDir, '00_prospects_master.json'),
  JSON.stringify(prospectDatabase, null, 2)
);
console.log(`✅ Base de prospectos creada: ${prospectDatabase.metadata.totalProspects} prospectos`);

// Create CRM config
const crmConfig = {
  version: '1.0',
  salesCycle: {
    phase1: { name: 'PROSPECTING', duration: '7 days' },
    phase2: { name: 'QUALIFICATION', duration: '7 days' },
    phase3: { name: 'PROPOSAL', duration: '7 days' },
    phase4: { name: 'CLOSING', duration: '7 days' }
  },
  nextSteps: [
    '1. Choose CRM provider (Pipedrive recommended)',
    '2. Import prospect list',
    '3. Schedule daily check-ins',
    '4. Send first batch of emails (target: 20)',
    '5. Report metrics every Friday'
  ]
};

fs.writeFileSync(
  path.join(pipelineDir, 'crm_config.json'),
  JSON.stringify(crmConfig, null, 2)
);
console.log('✅ Configuración de CRM generada');

// Create metrics tracker
const metricsTracker = {
  initialization: {
    date: new Date().toISOString(),
    prospectCount: 5,
    status: 'ACTIVE'
  },
  phase1Target: {
    duration: '30 days',
    goal: 'Reduce PRARA from 81.74% to 70%',
    newClientTarget: 1,
    estimatedRevenue: '120-150M VND'
  }
};

fs.writeFileSync(
  path.join(metricsDir, '00_metrics_tracker.json'),
  JSON.stringify(metricsTracker, null, 2)
);
console.log('✅ Dashboard de métricas creado');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║      🎉 PRARA SALES PIPELINE ACTIVADO EXITOSAMENTE     ║');
console.log('╚════════════════════════════════════════════════════════╝');
console.log('\n📊 ESTADO INICIAL:');
console.log(`   ✅ Prospectos: ${prospectDatabase.metadata.totalProspects}`);
console.log(`   ✅ CRM Config: LISTA`);
console.log(`   ✅ Métricas: ACTIVO`);
console.log('\n🎯 PHASE 1 TARGET (30 días):');
console.log(`   → Reduce PRARA: 81.74% → 70%`);
console.log(`   → New clients: 1 target`);
console.log(`   → Estimated revenue: 120-150M VND`);
console.log('\n📁 Directory: ' + pipelineDir);
console.log('\n✅ LISTO PARA ACTIVACIÓN MANUAL\n');
