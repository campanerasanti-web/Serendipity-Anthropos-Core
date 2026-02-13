import React from 'react';

const ArchitectureDiagram = ({ layers }) => {
  return (
    <div className="architecture-diagram bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🏛️ Diagrama de Arquitectura en Capas
      </h3>
      
      <div className="space-y-4">
        {layers.map((layer, index) => (
          <div key={index} className="relative">
            {/* Layer Box */}
            <div className={`bg-gradient-to-r ${layer.color} p-6 rounded-lg shadow-lg text-white transform transition-all hover:scale-105 hover:shadow-2xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold mb-2">{layer.name}</h4>
                  <p className="text-sm opacity-90">{layer.tech}</p>
                </div>
                <div className="text-4xl opacity-50">
                  {index + 1}
                </div>
              </div>
            </div>
            
            {/* Arrow to next layer */}
            {index < layers.length - 1 && (
              <div className="flex justify-center my-3">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Data Flow Indicator */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
        <div className="flex items-center justify-center gap-4 text-sm text-gray-700">
          <span className="font-semibold">Flujo de Datos:</span>
          <span>Usuario</span>
          <span>→</span>
          <span>React</span>
          <span>→</span>
          <span>REST API</span>
          <span>→</span>
          <span>Services</span>
          <span>→</span>
          <span>PostgreSQL</span>
          <span>→</span>
          <span>Event Sourcing</span>
        </div>
      </div>

      {/* Technology Stack Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl mb-2">⚛️</div>
          <h5 className="font-bold text-blue-900 mb-1">Frontend</h5>
          <p className="text-sm text-gray-700">React 18 + Vite + Tailwind</p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-2xl mb-2">🔷</div>
          <h5 className="font-bold text-purple-900 mb-1">Backend</h5>
          <p className="text-sm text-gray-700">.NET 8 + C# + EF Core</p>
        </div>
        
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-2xl mb-2">🗄️</div>
          <h5 className="font-bold text-orange-900 mb-1">Database</h5>
          <p className="text-sm text-gray-700">PostgreSQL + Supabase</p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
