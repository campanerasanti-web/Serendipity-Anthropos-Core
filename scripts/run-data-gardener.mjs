import { existsSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const args = process.argv.slice(2);
const modeArg = args.find(arg => arg.startsWith('--mode='));
const mode = modeArg ? modeArg.split('=')[1] : 'audit';
const autoFix = args.includes('--auto-fix');

const distPath = path.resolve(process.cwd(), 'dist/DataAgents/DataGardenerAgent.js');

console.log('Data Gardener Runner');

if (!existsSync(distPath)) {
  console.log('Compiled DataGardenerAgent not found.');
  console.log('Build C# project or provide compiled output in dist/DataAgents.');
  process.exit(1);
}

const agentModule = await import(pathToFileURL(distPath).href);
const DataGardenerAgent = agentModule.default || agentModule.DataGardenerAgent;

if (!DataGardenerAgent) {
  console.error('DataGardenerAgent not found in compiled output.');
  process.exit(1);
}

const agent = new DataGardenerAgent(mode, autoFix);
await agent.Run();
