import React from 'react';

interface DynamicBackgroundProps {
  mood?: 'flowing' | 'stressed' | 'fragmented' | 'fertile';
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ mood = 'flowing' }) => {
  const getGradient = () => {
    switch (mood) {
      case 'fertile':
        return 'from-emerald-50/30 to-green-100/30';
      case 'stressed':
        return 'from-amber-50/30 to-orange-100/30';
      case 'fragmented':
        return 'from-rose-50/30 to-red-100/30';
      default:
        return 'from-blue-50/30 to-indigo-100/30';
    }
  };

  const gradient = getGradient();

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none`}>
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full blur-3xl animate-pulse" 
          style={{ opacity: 0.3 }} 
        />
        <div 
          className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-200 rounded-full blur-3xl animate-pulse" 
          style={{ opacity: 0.3, animationDelay: '1s' }} 
        />
      </div>
    </div>
  );
};
