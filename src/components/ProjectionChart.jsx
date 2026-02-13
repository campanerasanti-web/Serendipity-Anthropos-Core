import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function ProjectionChart({data}){
  const chartData = data?.series ?? []

  return (
    <div className="bg-white/3 p-4 rounded-lg border border-white/5">
      <h3 className="text-sm font-medium mb-2">Proyección Mensual</h3>
      <div style={{width: '100%', height: 300}}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="date" hide={true} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="income" stroke="#34d399" strokeWidth={2} />
            <Line type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={2} />
            <Line type="monotone" dataKey="balance" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
