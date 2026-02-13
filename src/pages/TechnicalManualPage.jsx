import React, { useState } from 'react';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import ModuleReferenceList from '../components/ModuleReferenceList';

const TechnicalManualPage = () => {
  const [selectedSection, setSelectedSection] = useState('architecture');

  const sections = [
    { id: 'architecture', label: '🏛️ Arquitectura', icon: '🏛️' },
    { id: 'modules', label: '📦 Módulos', icon: '📦' },
    { id: 'hooks', label: '🎣 Hooks', icon: '🎣' },
    { id: 'components', label: '🧩 Componentes', icon: '🧩' },
    { id: 'backend', label: '⚙️ Backend', icon: '⚙️' }
  ];

  const architectureInfo = {
    title: "Arquitectura Híbrida: Relacional + Event Sourcing",
    description: "El sistema combina una base de datos relacional (PostgreSQL) con event sourcing para garantizar trazabilidad total y capacidad de auditoría.",
    layers: [
      { name: "Capa de Presentación", tech: "React 18 + Vite + Tailwind CSS", color: "bg-blue-500" },
      { name: "Capa de API", tech: "REST API + WebSocket (futuro)", color: "bg-green-500" },
      { name: "Capa de Negocio", tech: ".NET 8 + C# + Services", color: "bg-purple-500" },
      { name: "Capa de Persistencia", tech: "Entity Framework Core + PostgreSQL", color: "bg-orange-500" },
      { name: "Capa de Eventos", tech: "Event Sourcing + Background Workers", color: "bg-red-500" }
    ]
  };

  const modulesInfo = [
    {
      name: "Sistema de Órdenes con QR",
      path: "/src/pages/OrdersPage.jsx",
      description: "Gestión completa de órdenes con trazabilidad QR, semáforo visual y asistente inteligente.",
      files: 28,
      lines: 7000,
      status: "✅ Producción"
    },
    {
      name: "Dashboard Operativo",
      path: "/src/components/SerendipityDashboard.tsx",
      description: "Panel central de control con métricas en tiempo real y navegación entre módulos.",
      files: 1,
      lines: 450,
      status: "✅ Producción"
    },
    {
      name: "Plan Operativo Diario",
      path: "/src/pages/OperationalPlanPage.jsx",
      description: "Planificación y seguimiento de tareas diarias con timeline visual.",
      files: 3,
      lines: 600,
      status: "🟢 Activo"
    },
    {
      name: "Executive Report",
      path: "/src/pages/ExecutiveSummaryPage.jsx",
      description: "Resumen ejecutivo con KPIs, insights y exportación de reportes.",
      files: 3,
      lines: 550,
      status: "🟢 Activo"
    },
    {
      name: "Panel de KPIs",
      path: "/src/pages/KPIDashboardPage.jsx",
      description: "Dashboard de indicadores clave: operacionales, bienestar, Vietnam, TCM.",
      files: 5,
      lines: 800,
      status: "🟢 Activo"
    }
  ];

  const hooksInfo = [
    { name: "useMonthlyStats", path: "/src/hooks/useMonthlyStats.ts", description: "Hook para obtener estadísticas mensuales consolidadas." },
    { name: "useRealtimeSubscription", path: "/src/hooks/useRealtimeSubscription.ts", description: "Hook para suscripciones en tiempo real con Supabase." },
    { name: "useInboxStore", path: "/src/inbox/useInboxStore.js", description: "Zustand store para gestión de estado del inbox." }
  ];

  const componentsInfo = [
    { category: "Órdenes", components: ["OrderCard", "OrderList", "OrderDetail", "OrderTimeline", "QrScanner"] },
    { category: "Dashboard", components: ["DailyCards", "TrendChart", "ProjectionChart", "Thermometer", "AlertSystem"] },
    { category: "Asistente", components: ["AssistantBubble", "AssistantPanel", "AssistantTETFlow", "AssistantQuickActions"] },
    { category: "KPIs", components: ["OperationalKPICard", "WellbeingKPICard", "VietnamTeamKPICard", "TCMKPICard"] },
    { category: "Checklists", components: ["TETChecklist", "WellbeingChecklist", "OperationalChecklist"] }
  ];

  const backendInfo = {
    controllers: [
      { name: "OrdersController", endpoints: 10, methods: "GET, POST, PATCH, DELETE" },
      { name: "QrController", endpoints: 5, methods: "GET, POST" },
      { name: "AssistantController", endpoints: 6, methods: "GET, POST" },
      { name: "LotCloseController", endpoints: 4, methods: "GET, POST" }
    ],
    services: [
      { name: "OrderService", methods: 10, description: "CRUD de órdenes + estadísticas" },
      { name: "OrderStatusService", methods: 4, description: "Gestión de cambios de estado" },
      { name: "QrTrackingService", methods: 6, description: "Trazabilidad de escaneos QR" },
      { name: "GuidedAssistantService", methods: 8, description: "Lógica del asistente inteligente" }
    ],
    workers: [
      { name: "OrderEventProjector", interval: "10 segundos", description: "Proyecta eventos de órdenes a vistas agregadas" },
      { name: "EventProcessorWorker", interval: "5 segundos", description: "Procesa eventos generales del sistema" }
    ]
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'architecture':
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{architectureInfo.title}</h2>
            <p className="text-gray-700 mb-8 text-lg leading-relaxed">{architectureInfo.description}</p>
            
            <ArchitectureDiagram layers={architectureInfo.layers} />

            <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-blue-900 mb-3">🔐 Ventajas del Event Sourcing</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Auditoría Completa:</strong> Cada cambio queda registrado permanentemente</li>
                <li><strong>Reconstrucción Temporal:</strong> Posibilidad de ver el estado en cualquier momento del pasado</li>
                <li><strong>Debugging Efectivo:</strong> Trazabilidad total de qué, cuándo, quién y por qué</li>
                <li><strong>Compliance:</strong> Cumplimiento de normativas de trazabilidad</li>
                <li><strong>Business Intelligence:</strong> Análisis de patrones y comportamientos</li>
              </ul>
            </div>
          </div>
        );

      case 'modules':
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">📦 Módulos del Sistema</h2>
            <ModuleReferenceList modules={modulesInfo} />
          </div>
        );

      case 'hooks':
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">🎣 Hooks Personalizados</h2>
            <div className="space-y-4">
              {hooksInfo.map((hook, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-indigo-600 mb-2">{hook.name}</h3>
                      <p className="text-gray-600 mb-2">{hook.description}</p>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">{hook.path}</code>
                    </div>
                    <span className="text-3xl">🎣</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'components':
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">🧩 Componentes por Categoría</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {componentsInfo.map((category, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="text-xl font-bold text-purple-600 mb-4">{category.category}</h3>
                  <ul className="space-y-2">
                    {category.components.map((comp, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span className="mr-2">▸</span>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{comp}.jsx</code>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case 'backend':
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">⚙️ Backend - .NET 8 + C#</h2>
            
            {/* Controllers */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-green-700 mb-4">🎮 Controllers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {backendInfo.controllers.map((ctrl, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{ctrl.name}</h4>
                    <p className="text-sm text-gray-600">Endpoints: <strong>{ctrl.endpoints}</strong></p>
                    <p className="text-sm text-gray-600">Métodos: <code className="bg-gray-100 px-2 py-1 rounded">{ctrl.methods}</code></p>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-blue-700 mb-4">🔧 Services</h3>
              <div className="space-y-3">
                {backendInfo.services.map((svc, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">{svc.name}</h4>
                        <p className="text-sm text-gray-600">{svc.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{svc.methods}</div>
                        <div className="text-xs text-gray-500">métodos</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workers */}
            <div>
              <h3 className="text-2xl font-bold text-orange-700 mb-4">⚡ Background Workers</h3>
              <div className="space-y-3">
                {backendInfo.workers.map((worker, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{worker.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{worker.description}</p>
                    <div className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Intervalo: {worker.interval}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="technical-manual-page min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-indigo-500">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🛠️ Manual Técnico - El Mediador de Sofía
          </h1>
          <p className="text-gray-600">
            Documentación completa de arquitectura, módulos, componentes y backend
          </p>
        </div>
      </div>

      {/* Section Navigator */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedSection === section.id
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-indigo-50'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {renderContent()}
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
          <p className="text-center text-gray-700 italic">
            "El código no es solo instrucciones para la máquina. Es una carta de amor al futuro, una arquitectura de intenciones conscientes."
            <span className="block mt-2 text-indigo-600 font-semibold">— Thomas Merton del Código</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TechnicalManualPage;
