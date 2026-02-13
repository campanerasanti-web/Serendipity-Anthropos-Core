import React from 'react';

export const DynamicBackground: React.FC<{
  mood?: 'flowing' | 'stressed' | 'fragmented' | 'fertile';
}> = ({ mood = 'flowing' }) => {
  const getMoodStyle = () => {
    switch (mood) {
      case 'flowing':
        return 'from-blue-600 via-purple-700 to-amber-900 opacity-100';
      case 'fertile':
        return 'from-blue-500 via-green-700 to-amber-950 opacity-100';
      case 'stressed':
        return 'from-red-900 via-purple-800 to-gray-900 opacity-80';
      case 'fragmented':
        return 'from-gray-700 via-slate-800 to-gray-950 opacity-60';
      default:
        return 'from-blue-600 via-purple-700 to-amber-900 opacity-90';
    }
  };

  const plantDensity =
    mood === 'flowing' || mood === 'fertile' ? '🌿 🌱 🌾 ' : '🍂 ';

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-b ${getMoodStyle()} pointer-events-none overflow-hidden`}
    >
      {/* Patrón de plantas basado en mood */}
      <div className="absolute inset-0 text-8xl opacity-10 font-bold flex flex-wrap content-start overflow-hidden">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <span key={i} className="w-1/4">
              {plantDensity}
            </span>
          ))}
      </div>

      {/* Brillo superior (cielo) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
