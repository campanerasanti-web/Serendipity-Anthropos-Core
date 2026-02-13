import React from 'react';

const OperationalChecklist = ({ tasks = [], isTaskCompleted, onTaskComplete }) => {
  const completedCount = tasks.filter(t => isTaskCompleted(t.id)).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="operational-checklist bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📋 Checklist Interactivo</h2>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{completionPercentage}%</div>
          <div className="text-sm text-gray-500">{completedCount} de {totalCount}</div>
        </div>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => {
          const completed = isTaskCompleted(task.id);
          
          return (
            <div
              key={task.id}
              onClick={() => onTaskComplete(task.id)}
              className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                completed
                  ? 'bg-green-50 border-green-300 hover:bg-green-100'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              {/* Checkbox */}
              <div className="flex-shrink-0 mr-4">
                <div 
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    completed
                      ? 'bg-green-500 border-green-500'
                      : 'bg-white border-gray-400'
                  }`}
                >
                  {completed && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              
              {/* Task Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-semibold text-blue-600">{task.time}</span>
                  {completed && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-semibold">
                      ✓ Completado
                    </span>
                  )}
                </div>
                <p className={`font-medium ${completed ? 'text-gray-600 line-through' : 'text-gray-800'}`}>
                  {task.task}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {completionPercentage === 100 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-teal-100 rounded-lg border-2 border-green-300 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <p className="font-bold text-green-800 text-lg">¡Todas las tareas completadas!</p>
          <p className="text-sm text-green-700 mt-1">Has alcanzado el 100% de presencia operativa.</p>
        </div>
      )}
    </div>
  );
};

export default OperationalChecklist;
