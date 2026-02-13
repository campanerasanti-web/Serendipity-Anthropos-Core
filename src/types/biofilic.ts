// ===== TIPOS PARA EL TEMPLO BIÓFILO =====

export interface AnthroposState {
  mood: 'flowing' | 'stressed' | 'fragmented' | 'fertile';
  coherence: number; // 0-100
  timestamp: string;
}

export interface AgentDefinition {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  seedIcon: string; // SVG path o emoji
}

export const AGENTS: Record<string, AgentDefinition> = {
  ops_gardener: {
    id: 'ops_gardener',
    name: 'OpsGardener',
    emoji: '🌱',
    color: '#10b981',
    description: 'Optimiza el crecimiento operacional',
    seedIcon: '🌾',
  },
  security_gardener: {
    id: 'security_gardener',
    name: 'SecurityGardener',
    emoji: '🛡️',
    color: '#ef4444',
    description: 'Protege el ecosistema de riesgos',
    seedIcon: '🥜',
  },
  anthropos_core: {
    id: 'anthropos_core',
    name: 'AnthroposCore',
    emoji: '🧠',
    color: '#8b5cf6',
    description: 'Inteligencia unificada del templo',
    seedIcon: '🌻',
  },
  self_gardener: {
    id: 'self_gardener',
    name: 'SelfGardener',
    emoji: '💚',
    color: '#3b82f6',
    description: 'Cultiva la coherencia del corazón',
    seedIcon: '🌺',
  },
};

export const SOUL_MESSAGES = [
  '🌿 La comunicación es el riego del equipo',
  '✨ Cada pétalo caído es una lección plantada',
  '🌳 La paciencia: raíz de toda abundancia',
  '💧 Los datos fluyen como agua en el río',
  '🌱 Crecer no es llegar arriba, es profundizar',
  '🎯 Cada acción es un gesto de intención',
  '🌊 La fluidez emerge del equilibrio',
  '📍 Aquí, ahora, presente en la tierra',
];
