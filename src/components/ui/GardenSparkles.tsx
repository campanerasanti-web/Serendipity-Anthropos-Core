import React, { useMemo } from 'react';

interface GardenSparklesProps {
  active: boolean;
}

export const GardenSparkles: React.FC<GardenSparklesProps> = ({ active }) => {
  const sparkles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, index) => ({
      id: index,
      left: `${Math.random() * 90 + 5}%`,
      top: `${Math.random() * 70 + 10}%`,
      size: Math.random() * 6 + 4,
      delay: Math.random() * 0.6,
      duration: Math.random() * 1.2 + 1.2,
    }));
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <style>{`
        @keyframes sparkleRise {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          30% { opacity: 0.8; }
          100% { transform: translateY(-60px) scale(1.1); opacity: 0; }
        }
      `}</style>
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="absolute rounded-full bg-emerald-300/70 shadow-[0_0_12px_rgba(16,185,129,0.7)]"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
            animation: `sparkleRise ${sparkle.duration}s ease-out ${sparkle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
