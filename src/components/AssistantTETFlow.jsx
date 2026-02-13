import React, { useState } from 'react';

const AssistantTETFlow = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    csvLoaded: false,
    qrGenerated: false,
    vnAssigned: false,
    readiness: 0,
    selectedLanguage: 'es',
    notes: ''
  });

  const steps = [
    {
      step: 0,
      title: '🎊 Bienvenido al Protocolo TET',
      message: 'Te guiaré paso a paso en la preparación del sistema para el Año Nuevo Lunar Vietnamita. ¿Listo para comenzar?',
      type: 'welcome'
    },
    {
      step: 1,
      title: '📊 CSV de Products',
      message: '¿Has cargado el archivo CSV con los productos y clientes?',
      type: 'boolean',
      field: 'csvLoaded'
    },
    {
      step: 2,
      title: '📷 Códigos QR',
      message: '¿Los códigos QR únicos han sido generados para cada orden?',
      type: 'boolean',
      field: 'qrGenerated'
    },
    {
      step: 3,
      title: '🇻🇳 Asignación Vietnam',
      message: '¿Las órdenes han sido asignadas al equipo vietnamita?',
      type: 'boolean',
      field: 'vnAssigned'
    },
    {
      step: 4,
      title: '🎯 Readiness Score',
      message: '¿Cuál es el Readiness Score actual del sistema? (0-100%)',
      type: 'number',
      field: 'readiness',
      min: 0,
      max: 100
    },
    {
      step: 5,
      title: '🌐 Idioma Preferido',
      message: 'Selecciona el idioma principal del equipo:',
      type: 'select',
      field: 'selectedLanguage',
      options: [
        { value: 'es', label: '🇪🇸 Español' },
        { value: 'vn', label: '🇻🇳 Tiếng Việt' },
        { value: 'en', label: '🇬🇧 English' }
      ]
    },
    {
      step: 6,
      title: '📝 Notas Adicionales',
      message: '¿Hay algo más que deba saber sobre la preparación?',
      type: 'textarea',
      field: 'notes'
    },
    {
      step: 7,
      title: '✅ Confirmación',
      message: 'Resumen de la configuración TET:',
      type: 'confirmation'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    console.log('TET Configuration Submitted:', formData);
    alert('✅ Configuración TET guardada exitosamente!\n\nChúc mừng năm mới! 🎊');
    if (onClose) onClose();
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.type) {
      case 'welcome':
        return (
          <div className="text-center py-8">
            <div className="text-8xl mb-6">🎊</div>
            <p className="text-gray-700 text-lg mb-6">
              {step.message}
            </p>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-gray-700 italic">
                "Chúc mừng năm mới! Que este protocolo sea el puente entre culturas y el inicio de una operación armoniosa."
              </p>
            </div>
          </div>
        );

      case 'boolean':
        return (
          <div className="py-8">
            <p className="text-gray-700 text-lg mb-6">{step.message}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleFieldChange(step.field, true)}
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                  formData[step.field] === true
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                }`}
              >
                ✅ Sí
              </button>
              <button
                onClick={() => handleFieldChange(step.field, false)}
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                  formData[step.field] === false
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                }`}
              >
                ❌ No
              </button>
            </div>
          </div>
        );

      case 'number':
        return (
          <div className="py-8">
            <p className="text-gray-700 text-lg mb-6">{step.message}</p>
            <div className="max-w-md mx-auto">
              <input
                type="range"
                min={step.min}
                max={step.max}
                value={formData[step.field]}
                onChange={(e) => handleFieldChange(step.field, parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center mt-4">
                <div className="text-6xl font-bold text-blue-600">{formData[step.field]}%</div>
                {formData[step.field] >= 70 && (
                  <div className="mt-2 text-green-600 font-semibold">✓ Objetivo alcanzado (≥70%)</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="py-8">
            <p className="text-gray-700 text-lg mb-6">{step.message}</p>
            <div className="space-y-3 max-w-md mx-auto">
              {step.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFieldChange(step.field, option.value)}
                  className={`w-full p-4 rounded-lg font-semibold text-lg transition-all ${
                    formData[step.field] === option.value
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div className="py-8">
            <p className="text-gray-700 text-lg mb-4">{step.message}</p>
            <textarea
              value={formData[step.field]}
              onChange={(e) => handleFieldChange(step.field, e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              rows="6"
              placeholder="Escribe aquí tus notas adicionales..."
            />
          </div>
        );

      case 'confirmation':
        return (
          <div className="py-8">
            <p className="text-gray-700 text-lg mb-6">{step.message}</p>
            <div className="space-y-3 bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="font-semibold">CSV Cargado:</span>
                <span className={formData.csvLoaded ? 'text-green-600' : 'text-red-600'}>
                  {formData.csvLoaded ? '✅ Sí' : '❌ No'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="font-semibold">QR Generados:</span>
                <span className={formData.qrGenerated ? 'text-green-600' : 'text-red-600'}>
                  {formData.qrGenerated ? '✅ Sí' : '❌ No'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="font-semibold">Asignado a VN:</span>
                <span className={formData.vnAssigned ? 'text-green-600' : 'text-red-600'}>
                  {formData.vnAssigned ? '✅ Sí' : '❌ No'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="font-semibold">Readiness Score:</span>
                <span className={`font-bold ${formData.readiness >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                  {formData.readiness}%
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="font-semibold">Idioma:</span>
                <span className="text-blue-600 font-semibold">
                  {formData.selectedLanguage === 'vn' ? '🇻🇳 Tiếng Việt' : formData.selectedLanguage === 'en' ? '🇬🇧 English' : '🇪🇸 Español'}
                </span>
              </div>
              {formData.notes && (
                <div className="py-2">
                  <span className="font-semibold block mb-2">Notas:</span>
                  <p className="text-gray-700 text-sm italic">{formData.notes}</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="assistant-tet-flow bg-white rounded-xl shadow-2xl max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Paso {currentStep + 1} de {steps.length}</span>
          <span className="text-sm font-semibold text-blue-600">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="px-6 pt-6">
        <h2 className="text-3xl font-bold text-gray-800">{steps[currentStep].title}</h2>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="px-6 pb-6 flex gap-4">
        {currentStep > 0 && (
          <button
            onClick={handleBack}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            ← Atrás
          </button>
        )}
        <button
          onClick={handleNext}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-colors"
        >
          {currentStep === steps.length - 1 ? '✅ Confirmar' : 'Siguiente →'}
        </button>
      </div>
    </div>
  );
};

export default AssistantTETFlow;
