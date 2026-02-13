import React, { useState } from 'react';

const ModuleReferenceList = ({ modules }) => {
  const [expandedModule, setExpandedModule] = useState(null);

  const getStatusColor = (status) => {
    if (status.includes('Producción')) return 'bg-green-100 text-green-700 border-green-300';
    if (status.includes('Activo')) return 'bg-blue-100 text-blue-700 border-blue-300';
    if (status.includes('Beta')) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const toggleModule = (index) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  return (
    <div className="module-reference-list space-y-4">
      {modules.map((module, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-all"
        >
          {/* Module Header */}
          <div
            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleModule(index)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                  <span className="mr-3">📦</span>
                  {module.name}
                </h3>
                <p className="text-gray-600 mb-3">{module.description}</p>
                
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">
                    📁 <strong>{module.files}</strong> archivos
                  </span>
                  <span className="text-gray-500">
                    📝 <strong>{module.lines.toLocaleString()}</strong> líneas
                  </span>
                  <span className={`px-3 py-1 rounded-full border font-semibold ${getStatusColor(module.status)}`}>
                    {module.status}
                  </span>
                </div>
              </div>
              
              <div className="ml-4">
                <button className="text-3xl text-gray-400 hover:text-gray-600 transition-colors">
                  {expandedModule === index ? '−' : '+'}
                </button>
              </div>
            </div>
          </div>

          {/* Module Details (Expanded) */}
          {expandedModule === index && (
            <div className="px-6 pb-6 pt-0 border-t border-gray-100 bg-gray-50">
              <div className="mt-4 space-y-4">
                {/* Path */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">📂 Ruta Principal</h4>
                  <code className="block bg-white p-3 rounded border border-gray-200 text-sm text-gray-800">
                    {module.path}
                  </code>
                </div>

                {/* Metrics */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">📊 Métricas</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-blue-600">{module.files}</div>
                      <div className="text-xs text-gray-600">Archivos</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-purple-600">{module.lines.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Líneas</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(module.lines / module.files)}
                      </div>
                      <div className="text-xs text-gray-600">Promedio/archivo</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">⚡ Acciones Rápidas</h4>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-semibold">
                      Ver Código
                    </button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-semibold">
                      Docs
                    </button>
                    <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm font-semibold">
                      Tests
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mt-6">
        <h4 className="text-xl font-bold text-indigo-900 mb-4">📈 Resumen Total</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-3xl font-bold text-indigo-600 mb-1">
              {modules.reduce((sum, m) => sum + m.files, 0)}
            </div>
            <div className="text-sm text-gray-600">Archivos Totales</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {modules.reduce((sum, m) => sum + m.lines, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Líneas Totales</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-3xl font-bold text-pink-600 mb-1">
              {modules.length}
            </div>
            <div className="text-sm text-gray-600">Módulos Activos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleReferenceList;
