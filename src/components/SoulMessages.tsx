import React, { useState, useEffect } from 'react';

/**
 * SoulMessages: Componente que rota frases inspiradoras
 * del ecosistema, recordando que "la comunicación es el riego"
 */
interface SoulMessagesProps {
  messages?: string[];
  intervalMs?: number;
}

export const SoulMessages: React.FC<SoulMessagesProps> = ({
  messages = [
    '🌿 La comunicación es el riego del equipo',
    '✨ Cada pétalo caído es una lección plantada',
    '🌳 La paciencia: raíz de toda abundancia',
    '💧 Los datos fluyen como agua en el río',
  ],
  intervalMs = 5000,
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [messages.length, intervalMs]);

  return (
    <div className="text-center py-4 px-6 rounded-lg bg-gradient-to-r from-emerald-900/30 to-purple-900/30 border border-emerald-400/50 backdrop-blur-sm">
      <p className="text-lg italic text-emerald-200 animate-pulse">
        {messages[current]}
      </p>
    </div>
  );
};
