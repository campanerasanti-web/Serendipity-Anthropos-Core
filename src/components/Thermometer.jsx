import React from 'react'

export default function Thermometer({data}){
  const income = data?.summary?.income ?? 0
  const fixed = data?.summary?.fixed ?? 0
  const variable = data?.summary?.variable ?? 0
  const balance = income - fixed - variable

  const pct = income > 0 ? Math.max(0, Math.min(1, balance / income)) : 0
  const color = pct > 0.5 ? 'bg-emerald-500' : pct > 0.25 ? 'bg-yellow-400' : 'bg-red-500'

  return (
    <div className="bg-white/3 p-4 rounded-lg border border-white/5">
      <h3 className="text-sm font-medium mb-2">Termómetro</h3>
      <div className="flex gap-4 items-center">
        <div className="w-12 h-48 bg-white/5 rounded relative overflow-hidden">
          <div className={`absolute bottom-0 left-0 right-0 ${color}`} style={{height: `${pct*100}%`}} />
        </div>
        <div>
          <div className="text-xs text-slate-300">Ingresos: ${income}</div>
          <div className="text-xs text-slate-300">Gastos fijos: ${fixed}</div>
          <div className="text-xs text-slate-300">Gastos variables: ${variable}</div>
          <div className="text-lg font-semibold mt-2">Saldo: ${balance}</div>
        </div>
      </div>
    </div>
  )
}
