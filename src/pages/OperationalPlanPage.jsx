import React, { useState, useEffect } from 'react';
import OperationalTimeline from '../components/OperationalTimeline';
import OperationalChecklist from '../components/OperationalChecklist';

const OperationalPlanPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('morning');
  const [reportGenerated, setReportGenerated] = useState(false);

  const operationalPlan = {
    morning: {
      title: '🌅 Plan Matutino (8:00 - 12:00)',
      tasks: [
        { id: 1, time: '08:00', task: 'Revisión de órdenes urgentes (rojas)', completed: false },
        { id: 2, time: '08:30', task: 'Sync con equipo Vietnam - Daily Standup', completed: false },
        { id: 3, time: '09:00', task: 'Actualización Panel Personal', completed: false },
        { id: 4, time: '09:30', task: 'Procesamiento de nuevas órdenes', completed: false },
        { id: 5, time: '10:00', task: 'Revisión de Readiness Score', completed: false },
        { id: 6, time: '11:00', task: 'Testing de interfaz vietnamita', completed: false },
        { id: 7, time: '11:30', task: 'Checkpoint: Paz Interior + Presencia', completed: false },
      ]
    },
    afternoon: {
      title: '🌞 Plan Vespertino (14:00 - 18:00)',
      tasks: [
        { id: 8, time: '14:00', task: 'Review de órdenes completadas', completed: false },
        { id: 9, time: '14:30', task: 'Asignación de nuevas órdenes', completed: false },
        { id: 10, time: '15:00', task: 'Análisis de KPIs del día', completed: false },
        { id: 11, time: '15:30', task: 'Ajustes en sistema según feedback', completed: false },
        { id: 12, time: '16:00', task: 'Preparación de órdenes para mañana', completed: false },
        { id: 13, time: '17:00', task: 'Documentación de insights del día', completed: false },
        { id: 14, time: '17:30', task: 'Cierre: Meditación + Retrospectiva', completed: false },
      ]
    },
    saturday: {
      title: '🎯 Plan Sábado Intensivo (9:00 - 16:00)',
      tasks: [
        { id: 15, time: '09:00', task: 'Revisión semanal de métricas', completed: false },
        { id: 16, time: '09:30', task: 'Optimización de procesos', completed: false },
        { id: 17, time: '10:30', task: 'Entrenamiento de modelos IA', completed: false },
        { id: 18, time: '12:00', task: 'Testing exhaustivo de sistema', completed: false },
        { id: 19, time: '13:00', task: 'Almuerzo consciente', completed: false },
        { id: 20, time: '14:00', task: 'Preparación Executive Report', completed: false },
        { id: 21, time: '15:00', task: 'Planning de próxima semana', completed: false },
        { id: 22, time: '15:45', task: 'Cierre semanal + Gratitud', completed: false },
      ]
    }
  };

  const handleTaskComplete = (periodKey, taskId) => {
    const storageKey = `operational_plan_${currentDate.toISOString().split('T')[0]}`;
    const savedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    if (!savedData[periodKey]) {
      savedData[periodKey] = [];
    }
    
    if (savedData[periodKey].includes(taskId)) {
      savedData[periodKey] = savedData[periodKey].filter(id => id !== taskId);
    } else {
      savedData[periodKey].push(taskId);
    }
    
    localStorage.setItem(storageKey, JSON.stringify(savedData));
  };

  const isTaskCompleted = (periodKey, taskId) => {
    const storageKey = `operational_plan_${currentDate.toISOString().split('T')[0]}`;
    const savedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return savedData[periodKey]?.includes(taskId) || false;
  };

  const handleGenerateReport = () => {
    const report = {
      date: currentDate.toISOString(),
      completionRate: calculateCompletionRate(),
      timestamp: new Date().toISOString()
    };
    
    console.log('📄 Reporte generado:', report);
    setReportGenerated(true);
    
    setTimeout(() => {
      setReportGenerated(false);
    }, 3000);
  };

  const handleDownloadDailyReport = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
      const dateParam = currentDate.toISOString().split('T')[0];
      const response = await fetch(`${baseUrl}/api/orders/daily-report?date=${dateParam}`);

      if (!response.ok) {
        throw new Error('Error al generar el PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Cierre_Jornada_${dateParam}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando PDF:', error);
      alert('No se pudo descargar el PDF de cierre de jornada.');
    }
  };

  const calculateCompletionRate = () => {
    const storageKey = `operational_plan_${currentDate.toISOString().split('T')[0]}`;
    const savedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    const totalTasks = Object.values(operationalPlan).reduce((sum, period) => sum + period.tasks.length, 0);
    const completedTasks = Object.values(savedData).reduce((sum, tasks) => sum + tasks.length, 0);
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  return (
    <div className="operational-plan-page min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🗓️ Plan Operativo Diario
              </h1>
              <p className="text-gray-600">
                {currentDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600">
                {calculateCompletionRate()}%
              </div>
              <div className="text-sm text-gray-500">Completado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedPeriod('morning')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              selectedPeriod === 'morning'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-blue-50'
            }`}
          >
            🌅 Mañana
          </button>
          <button
            onClick={() => setSelectedPeriod('afternoon')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              selectedPeriod === 'afternoon'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-orange-50'
            }`}
          >
            🌞 Tarde
          </button>
          <button
            onClick={() => setSelectedPeriod('saturday')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              selectedPeriod === 'saturday'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-purple-50'
            }`}
          >
            🎯 Sábado
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-7xl mx-auto mb-8">
        <OperationalTimeline 
          tasks={operationalPlan[selectedPeriod].tasks}
          isTaskCompleted={(taskId) => isTaskCompleted(selectedPeriod, taskId)}
          onTaskComplete={(taskId) => handleTaskComplete(selectedPeriod, taskId)}
          title={operationalPlan[selectedPeriod].title}
        />
      </div>

      {/* Checklist */}
      <div className="max-w-7xl mx-auto mb-8">
        <OperationalChecklist 
          tasks={operationalPlan[selectedPeriod].tasks}
          isTaskCompleted={(taskId) => isTaskCompleted(selectedPeriod, taskId)}
          onTaskComplete={(taskId) => handleTaskComplete(selectedPeriod, taskId)}
        />
      </div>

      {/* Action Buttons */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={handleGenerateReport}
              disabled={reportGenerated}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                reportGenerated
                  ? 'bg-green-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              }`}
            >
              {reportGenerated ? '✅ Reporte Generado' : '📄 Generar Reporte del Día'}
            </button>
            <button
              onClick={handleDownloadDailyReport}
              className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              📄 Cierre de Jornada (PDF)
            </button>
          </div>
          
          {reportGenerated && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
              ✨ Reporte generado exitosamente. Tasa de completitud: {calculateCompletionRate()}%
            </div>
          )}
        </div>
      </div>

      {/* Mindfulness Note */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <p className="text-center text-gray-700 italic">
            "Cada tarea completada es un acto de presencia. Cada checkbox marcado, una confirmación de tu compromiso con la paz operativa." 
            <span className="block mt-2 text-purple-600 font-semibold">— El Guardián del Templo Digital</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OperationalPlanPage;
