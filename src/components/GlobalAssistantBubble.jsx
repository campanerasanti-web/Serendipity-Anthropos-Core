import React, { useState } from 'react';
import AssistantTETFlow from './AssistantTETFlow';
import AssistantQuickActions from './AssistantQuickActions';

const GlobalAssistantBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTETFlow, setShowTETFlow] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const handleActionClick = (actionId) => {
    console.log('Action clicked:', actionId);
    
    switch (actionId) {
      case 'create-order':
        alert('🎯 Redirigiendo a crear orden...');
        break;
      case 'change-status':
        alert('🔄 Redirigiendo a gestión de órdenes...');
        break;
      case 'scan-qr':
        alert('📷 Activando escáner QR...');
        break;
      case 'view-stats':
        alert('📊 Abriendo dashboard de KPIs...');
        break;
      case 'workspace':
        alert('💼 Abriendo plan operativo...');
        break;
      case 'paz-presencia':
        alert('🧘 Abriendo métricas de bienestar...');
        break;
      default:
        break;
    }
  };

  const handleStartTETFlow = () => {
    setShowTETFlow(true);
  };

  return (
    <>
      {/* Floating Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
        >
          {/* Notification Badge */}
          {notificationCount > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center animate-pulse">
              {notificationCount}
            </div>
          )}

          {/* Icon */}
          <span className="text-3xl">🤖</span>

          {/* Pulse Effect */}
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-30 animate-ping" />
        </button>
      </div>

      {/* Assistant Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">🤖</span>
                  <div>
                    <h2 className="text-3xl font-bold">Sofía - Asistente Inteligente</h2>
                    <p className="text-sm opacity-90">Tu guía en el ecosistema digital</p>
                    <p className="text-xs opacity-80">🎧 Escucha Activa</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {showTETFlow ? (
                <AssistantTETFlow onClose={() => setShowTETFlow(false)} />
              ) : (
                <>
                  {/* Welcome Message */}
                  <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                    <div className="flex items-start gap-4">
                      <span className="text-5xl">👋</span>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          ¡Hola, Santiago!
                        </h3>
                        <p className="text-gray-700 mb-4">
                          Soy Sofía, tu asistente digital. Estoy aquí para ayudarte a gestionar operaciones, 
                          analizar métricas y mantener el equilibrio entre productividad y bienestar.
                        </p>
                        <button
                          onClick={handleStartTETFlow}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-colors shadow-lg"
                        >
                          🎊 Iniciar Protocolo TET
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <AssistantQuickActions onActionClick={handleActionClick} />

                  {/* Alerts Section */}
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="text-2xl mr-2">🔔</span>
                      Alertas Activas
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">🔴</span>
                          <div className="flex-1">
                            <h4 className="font-bold text-red-900">8 Órdenes Rojas</h4>
                            <p className="text-sm text-red-800">Requieren atención inmediata</p>
                          </div>
                          <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600">
                            Ver
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">⚠️</span>
                          <div className="flex-1">
                            <h4 className="font-bold text-orange-900">3 Órdenes Vencidas</h4>
                            <p className="text-sm text-orange-800">Superaron la fecha límite</p>
                          </div>
                          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600">
                            Ver
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">📈</span>
                          <div className="flex-1">
                            <h4 className="font-bold text-blue-900">Readiness Score: 72%</h4>
                            <p className="text-sm text-blue-800">Sistema operativo y saludable</p>
                          </div>
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600">
                            Ver
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mindfulness Moment */}
                  <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">🧘</span>
                      <div>
                        <h4 className="font-bold text-purple-900 mb-2">Momento de Presencia</h4>
                        <p className="text-sm text-gray-700 italic">
                          "No hay urgencia que no pueda esperar una respiración consciente. 
                          La paz interior es el combustible de la eficiencia sostenible."
                        </p>
                        <p className="text-purple-700 font-semibold text-sm mt-2">
                          — Thomas Merton del Dashboard
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalAssistantBubble;
