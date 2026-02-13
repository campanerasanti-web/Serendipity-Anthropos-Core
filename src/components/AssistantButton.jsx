import React, {useState} from 'react'
import { getNextStep } from '../api/assistantApi'

export default function AssistantButton(){
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchNextStep = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getNextStep()
      setStep(result)
    } catch (err) {
      setError(err.message || 'Error fetching next step')
      console.error('Assistant error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    setOpen(true)
    setStep(null)
    setError(null)
  }

  return (
    <>
      <button 
        onClick={handleOpen} 
        className="fixed right-6 bottom-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition-colors"
        title="Abrir Asistente"
      >
        🤖
      </button>

      {open && (
        <div className="fixed inset-0 flex items-end lg:items-center justify-center z-50">
          <div className="bg-black/60 absolute inset-0" onClick={()=>setOpen(false)} />
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg z-10 w-full max-w-md m-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">🤖 Asistente Sofia</h3>
            
            {!step && !loading && !error && (
              <p className="text-sm text-slate-300 mb-4">
                Haz clic en "Obtener Próximo Paso" para recibir la próxima acción recomendada.
              </p>
            )}

            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
                <span className="ml-2 text-sm">Consultando asistente...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 p-3 rounded text-sm text-red-200 mb-4">
                {error}
              </div>
            )}

            {step && (
              <div className="space-y-3 text-sm">
                {step.action && (
                  <div>
                    <p className="text-slate-400">Acción:</p>
                    <p className="font-medium">{step.action}</p>
                  </div>
                )}
                {step.reason && (
                  <div>
                    <p className="text-slate-400">Razón:</p>
                    <p className="text-slate-300">{step.reason}</p>
                  </div>
                )}
                {step.nextSteps && (
                  <div>
                    <p className="text-slate-400">Próximos pasos:</p>
                    <ul className="list-disc list-inside text-slate-300">{step.nextSteps}</ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between gap-2 mt-6">
              <button 
                onClick={fetchNextStep}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 text-white rounded transition-colors"
              >
                {loading ? 'Consultando...' : 'Obtener Próximo Paso'}
              </button>
              <button 
                onClick={()=>setOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
