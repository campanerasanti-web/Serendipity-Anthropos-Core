import React from 'react'

function Card({icon, label, value}){
  return (
    <div className="bg-white/3 p-4 rounded-lg border border-white/5 flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <div className="text-xs text-slate-300">{label}</div>
        <div className="text-lg font-semibold">{value ?? '—'}</div>
      </div>
    </div>
  )
}

export default function DailyCards({data}){
  const orders = data?.newOrders ?? 0
  const billed = data?.billed ?? 0
  const wip = data?.wip ?? 0
  const total = data?.total ?? 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card icon={<span>📦</span>} label={"Órdenes nuevas"} value={orders} />
      <Card icon={<span>✅</span>} label={"sf facturados"} value={billed} />
      <Card icon={<span>⚙️</span>} label={"sf en WIP"} value={wip} />
      <Card icon={<span>🏔️</span>} label={"Total acumulado"} value={`$${total}`} />
    </div>
  )
}
