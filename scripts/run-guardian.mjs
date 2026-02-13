/**
 * 🛡️ SCRIPT PARA EJECUTAR EL GUARDIÁN DEL SISTEMA
 *
 * Uso:
 *   node scripts/run-guardian.mjs --mode=audit
 *   node scripts/run-guardian.mjs --mode=repair --auto-fix
 *   node scripts/run-guardian.mjs --mode=full --auto-fix
 */

import { existsSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';

const args = process.argv.slice(2);
const modeArg = args.find(arg => arg.startsWith('--mode='));
const mode = modeArg ? modeArg.split('=')[1] : 'audit';
const autoFix = args.includes('--auto-fix');

const distPath = path.resolve(process.cwd(), 'dist/agents/SystemGuardianAgent.js');

console.log('\n🛡️  ═══════════════════════════════════════════════════════');
console.log('    GUARDIÁN DEL SISTEMA SERENDIPITY');
console.log('    El Mediador de Sofía - Vigilancia Continua');
console.log('═══════════════════════════════════════════════════════\n');

if (!existsSync(distPath)) {
  console.log('⚠️  Guardián compilado no encontrado.');
  console.log('    1. Compilar TypeScript: npm run build');
  console.log('    2. Ejecutar: node scripts/run-guardian.mjs --mode=audit\n');
  process.exit(1);
}

const agentModule = await import(pathToFileURL(distPath).href);
const SystemGuardianAgent = agentModule.default || agentModule.SystemGuardianAgent;

if (!SystemGuardianAgent) {
  console.error('❌ No se pudo cargar SystemGuardianAgent desde dist/agents/SystemGuardianAgent.js');
  process.exit(1);
}

const guardian = new SystemGuardianAgent({
  mode: mode === 'repair' || mode === 'full' || mode === 'audit' ? mode : 'audit',
  autoFix
});

await guardian.run();
