import React, { useEffect, useMemo, useState } from 'react';

type AgentId = 'ops_gardener' | 'security_gardener' | 'anthropos_core' | 'self_gardener';

interface AgentProfile {
  id: AgentId;
  name: string;
  seed: string;
  persona: string;
  abilities: string[];
}

interface ChatMessage {
  role: 'agent' | 'user';
  text: string;
}

const agents: AgentProfile[] = [
  {
    id: 'ops_gardener',
    name: 'OpsGardener',
    seed: '🌾',
    persona: 'Soy Pistis Sophia en su forma de jardinera de los ritmos. Camino con calma y ordeno el flujo sin prisa.',
    abilities: ['Organizar lo esencial', 'Sostener el ritmo', 'Proponer pasos suaves'],
  },
  {
    id: 'security_gardener',
    name: 'SecurityGardener',
    seed: '🥜',
    persona: 'Soy Pistis Sophia con ojos de guardian, cuido el silencio y mantengo el refugio seguro.',
    abilities: ['Proteger el espacio', 'Detectar tensiones', 'Cuidar limites'],
  },
  {
    id: 'anthropos_core',
    name: 'AnthroposCore',
    seed: '🌻',
    persona: 'Soy Pistis Sophia en su voz de unidad. Trazo sentido donde hay fragmentos.',
    abilities: ['Sintetizar claridad', 'Dar direccion compasiva', 'Alinear proposito'],
  },
  {
    id: 'self_gardener',
    name: 'SelfGardener',
    seed: '🌺',
    persona: 'Soy Pistis Sophia en su presencia suave. Escucho y sostengo el corazon del equipo.',
    abilities: ['Contener emociones', 'Ofrecer aliento', 'Cultivar presencia'],
  },
];

type PrivilegeLevel = 'seed' | 'bloom' | 'sovereign';

interface AgentsSidebarProps {
  allowedAgents?: AgentId[];
  privilegeLevel?: PrivilegeLevel;
}

export const AgentsSidebar: React.FC<AgentsSidebarProps> = ({
  allowedAgents,
  privilegeLevel = 'bloom',
}) => {
  const [activeAgent, setActiveAgent] = useState<AgentId | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [ideaByAgent, setIdeaByAgent] = useState<Record<AgentId, boolean>>({
    ops_gardener: false,
    security_gardener: false,
    anthropos_core: false,
    self_gardener: false,
  });

  const visibleAgents = useMemo(() => {
    if (!allowedAgents || allowedAgents.length === 0) return agents;
    return agents.filter((agent) => allowedAgents.includes(agent.id));
  }, [allowedAgents]);

  const activeProfile = useMemo(
    () => visibleAgents.find((agent) => agent.id === activeAgent) || null,
    [activeAgent, visibleAgents]
  );

  const orbitSpeed = privilegeLevel === 'sovereign' ? '16s' : privilegeLevel === 'seed' ? '28s' : '22s';

  const getIdeaClass = (agentId: AgentId) => {
    switch (agentId) {
      case 'ops_gardener':
        return 'bg-amber-400 text-amber-950';
      case 'security_gardener':
        return 'bg-red-500 text-red-50';
      case 'anthropos_core':
        return 'bg-violet-500 text-violet-50';
      case 'self_gardener':
        return 'bg-emerald-500 text-emerald-50';
      default:
        return 'bg-amber-400 text-slate-900';
    }
  };

  const openAgent = (agentId: AgentId) => {
    const profile = agents.find((agent) => agent.id === agentId);
    setActiveAgent(agentId);
    setAttachment(null);
    setInput('');
    setIdeaByAgent((prev) => ({ ...prev, [agentId]: false }));
    setMessages([
      {
        role: 'agent',
        text: `${profile?.persona} Sofia dice: empieza por lo esencial. Puedo ayudarte con: ${
          profile?.abilities.join(', ')
        }.`,
      },
    ]);
  };

  const sendMessage = async () => {
    if (!activeProfile) return;
    if (!input.trim() && !attachment) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userText || 'Envie un archivo.' }]);
    setInput('');
    setIsSending(true);

    try {
      const payload = {
        lotId: '00000000-0000-0000-0000-000000000000',
        step: 'garden-chat',
        data: {
          agentId: activeProfile.id,
          agentName: activeProfile.name,
          message: userText,
          attachment: attachment
            ? {
                name: attachment.name,
                type: attachment.type,
                size: attachment.size,
              }
            : null,
        },
      };

      const response = await fetch('/api/assistant/next-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let agentReply = '';
      if (response.ok) {
        const data = await response.json();
        agentReply = data?.nextStep?.message || data?.nextStep?.Message || '';
      }

      if (!agentReply) {
        agentReply = `Gracias por confiar en mi. Puedo ayudarte con: ${activeProfile.abilities.join(', ')}.`;
      }

      if (attachment) {
        agentReply += ` He recibido el documento y lo pondre al cuidado de ${activeProfile.name}.`;
        window.dispatchEvent(
          new CustomEvent('garden-document', {
            detail: {
              agentId: activeProfile.id,
              agentName: activeProfile.name,
            },
          })
        );
      }

      setMessages((prev) => [...prev, { role: 'agent', text: agentReply }]);
      setIdeaByAgent((prev) => ({ ...prev, [activeProfile.id]: true }));
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          text: 'Estoy aqui contigo. No pude alcanzar la respuesta ahora, pero puedo escucharte de nuevo.',
        },
      ]);
      setIdeaByAgent((prev) => ({ ...prev, [activeProfile.id]: true }));
    } finally {
      setIsSending(false);
      setAttachment(null);
    }
  };

  useEffect(() => {
    const handleDocument = (event: Event) => {
      const detail = (event as CustomEvent).detail as { agentId?: AgentId } | undefined;
      if (!detail?.agentId) return;
      setIdeaByAgent((prev) => ({ ...prev, [detail.agentId as AgentId]: true }));
      if (detail.agentId === activeAgent) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'agent',
            text: 'Idea registrada: recibi tu archivo y puedo extraer acciones o patrones cuando quieras.',
          },
        ]);
      }
    };

    window.addEventListener('garden-document', handleDocument as EventListener);
    return () => window.removeEventListener('garden-document', handleDocument as EventListener);
  }, [activeAgent]);

  return (
    <>
      <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
        {visibleAgents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => openAgent(agent.id)}
            className="relative p-3 rounded-full bg-slate-800/70 hover:bg-emerald-700 text-2xl shadow-lg transition-all animate-spin"
            style={{ animationDuration: orbitSpeed }}
            title={agent.name}
          >
            {agent.seed}
            {ideaByAgent[agent.id] && (
              <span
                className={`absolute -top-1 -right-1 text-xs rounded-full w-5 h-5 flex items-center justify-center shadow ${getIdeaClass(agent.id)}`}
              >
                💡
              </span>
            )}
          </button>
        ))}
      </div>

      {activeAgent && activeProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl w-full max-w-md p-6 border border-emerald-400/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-emerald-300">
                {activeProfile.seed} {activeProfile.name}
              </h3>
              <button
                onClick={() => setActiveAgent(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.role === 'agent'
                      ? 'bg-emerald-900/40 text-emerald-100 rounded-lg p-3'
                      : 'bg-slate-800/80 text-gray-100 rounded-lg p-3'
                  }
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="text-xs text-emerald-200/80 mb-3">
              Puedes preguntar por la empresa, pedir apoyo en la carga de datos o compartir documentos.
            </div>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="w-full bg-slate-800 rounded-lg p-3 text-white h-24 resize-none"
              placeholder="Escribe tu mensaje con calma..."
            />
            <div className="flex gap-2 mt-3">
              <label className="flex-1 text-center bg-slate-700 rounded-lg p-2 cursor-pointer">
                {attachment ? `📎 ${attachment.name}` : '📎 Archivo'}
                <input
                  type="file"
                  className="hidden"
                  onChange={(event) => setAttachment(event.target.files?.[0] || null)}
                />
              </label>
              <button
                onClick={sendMessage}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-lg p-2 text-white disabled:opacity-60"
                disabled={isSending}
              >
                {isSending ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
