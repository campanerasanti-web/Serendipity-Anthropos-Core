import React from 'react';

const OperationalTimeline = ({ tasks = [], isTaskCompleted, onTaskComplete, title }) => {
  return (
    <div className="operational-timeline bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200"></div>
        
        {/* Timeline Items */}
        <div className="space-y-6">
          {tasks.map((task, index) => {
            const completed = isTaskCompleted(task.id);
            
            return (
              <div key={task.id} className="relative flex items-start">
                {/* Time Marker */}
                <div className="flex-shrink-0 w-16 text-right pr-4">
                  <span className="text-sm font-semibold text-gray-600">{task.time}</span>
                </div>
                
                {/* Dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div 
                    className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all cursor-pointer ${
                      completed 
                        ? 'bg-green-500 border-green-300 shadow-lg' 
                        : 'bg-white border-gray-300 hover:border-blue-400'
                    }`}
                    onClick={() => onTaskComplete(task.id)}
                  >
                    {completed && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* Task Content */}
                <div className="flex-1 ml-4">
                  <div 
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:shadow'
                    }`}
                    onClick={() => onTaskComplete(task.id)}
                  >
                    <p className={`font-medium ${completed ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                      {task.task}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-600">Progreso</span>
          <span className="text-sm font-bold text-blue-600">
            {tasks.filter(t => isTaskCompleted(t.id)).length} / {tasks.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
            style={{ 
              width: `${(tasks.filter(t => isTaskCompleted(t.id)).length / tasks.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OperationalTimeline;
