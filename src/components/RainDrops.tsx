/**
 * RainDrops - Animación de Gotas de Luz
 * Se activa cuando entra un ingreso grande al sistema
 * 
 * "Cuando el río fluye, las gotas hidratan las gráficas"
 */

import React, { useEffect, useState } from 'react';

interface RainDropsProps {
  isActive: boolean;
  duration?: number; // Duración en ms
}

export const RainDrops: React.FC<RainDropsProps> = ({ isActive, duration = 5000 }) => {
  const [drops, setDrops] = useState<number[]>([]);

  useEffect(() => {
    if (isActive) {
      // Generar 12 gotas
      setDrops(Array.from({ length: 12 }, (_, i) => i));

      // Remover después de la duración
      const timeout = setTimeout(() => {
        setDrops([]);
      }, duration);

      return () => clearTimeout(timeout);
    } else {
      setDrops([]);
    }
  }, [isActive, duration]);

  if (drops.length === 0) return null;

  return (
    <div className="rain-drops-container" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none',
      zIndex: 9999 
    }}>
      {drops.map((drop) => (
        <div
          key={drop}
          className="rain-drop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${drop * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
};
