import React, { useState, useEffect } from 'react';

export const SoulMessages: React.FC<{ messages?: string[] }> = ({
  messages = [
    '🌿 La comunicación es el riego del equipo',
    '✨ Cada pétalo caído es una lección plantada',
    '🌳 La paciencia: raíz de toda abundancia',
    '💧 Los datos fluyen como agua en el río',
  ],
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="py-4 px-6 rounded-lg bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-400/40 text-center">
      <p className="text-lg italic text-emerald-200">{messages[current]}</p>
    </div>
  );
};
