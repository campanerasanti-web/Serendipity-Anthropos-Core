import React, { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { AGENTS } from '../types/biofilic';

/**
 * AgentsSidebar: Barra lateral con los 4 agentes
 * Al hacer clic, abre un chat directo para enviar archivos o pedir guía
 */
export const AgentsSidebar: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');

  const handleAgentClick = (agentId: string) => {
    setSelectedAgent(agentId);
    setChatMessage('');
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    // Aquí iría la API call para enviar al agente
    console.log(`Mensaje a ${selectedAgent}: ${chatMessage}`);
    setChatMessage('');
  };

  const selectedAgentData = selectedAgent ? AGENTS[selectedAgent] : null;

  return (
    <>
      {/* Sidebar de semillas */}
      <div className="fixed left-6 top-1/3 -translate-y-1/2 flex flex-col gap-4 z-50">
        {Object.entries(AGENTS).map(([key, agent]) => (
          <button
            key={key}
            onClick={() => handleAgentClick(key)}
            className={`p-3 rounded-full transition-all transform hover:scale-110 duration-300 shadow-lg ${
              selectedAgent === key
                ? `bg-${agent.color} text-white scale-125`
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
            }`}
            title={agent.name}
          >
            <span className="text-2xl">{agent.seedIcon}</span>
          </button>
        ))}
      </div>

      {/* Chat Modal */}
      {selectedAgent && selectedAgentData && (
        <div className="fixed left-0 top-0 w-full h-full bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl w-full max-w-md shadow-2xl border border-emerald-400/30 overflow-hidden">
            {/* Header */}
            <div className={`bg-gradient-to-r from-${selectedAgentData.color.replace('#', '')} to-purple-600 p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedAgentData.emoji}</span>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">{selectedAgentData.name}</h3>
                    <p className="text-sm opacity-90">{selectedAgentData.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="p-6 space-y-6">
              <div className="bg-emerald-900/30 border border-emerald-400/50 rounded-lg p-4">
                <p className="text-emerald-200 italic flex items-start gap-2">
                  <MessageCircle size={18} className="flex-shrink-0 mt-1" />
                  <span>
                    "Estoy aquí para ayudarte a cultivar este espacio. ¿Qué necesitas hoy?"
                  </span>
                </p>
              </div>

              {/* Input Area */}
              <div className="space-y-3">
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Escribe tu pregunta o sube un archivo..."
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 resize-none h-24"
                />

                <div className="flex gap-2">
                  <label className="flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-600 rounded-lg text-center text-gray-300 cursor-pointer transition-colors">
                    📎 Archivo
                    <input type="file" className="hidden" />
                  </label>
                  <button
                    onClick={handleSendMessage}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95"
                  >
                    Enviar
                  </button>
                </div>
              </div>

              {/* Info Footer */}
              <p className="text-xs text-gray-500 text-center">
                💚 Tu conexión con {selectedAgentData.name} está activada
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
