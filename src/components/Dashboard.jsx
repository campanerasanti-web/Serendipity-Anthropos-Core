import React, {useEffect, useState, Suspense} from 'react'
import DailyCards from './DailyCards'
const ProjectionChart = React.lazy(() => import('./ProjectionChart'))
import Thermometer from './Thermometer'
import WipList from './WipList'
import AssistantButton from './AssistantButton'
import { getDailyDashboard, getMonthlyProjection } from '../api/dashboardApi'

export default function Dashboard(){
  const [daily, setDaily] = useState(null)
  const [projection, setProjection] = useState(null)

  useEffect(()=>{
    let mounted = true
    // Fetch daily dashboard
    getDailyDashboard()
      .then(r => { if(mounted) setDaily(r)})
      .catch(err => { console.error('Error fetching daily dashboard:', err) })
    
    // Fetch monthly projection (current month)
    const now = new Date()
    getMonthlyProjection(now.getMonth() + 1, now.getFullYear())
      .then(r => { if(mounted) setProjection(r)})
      .catch(err => { console.error('Error fetching monthly projection:', err) })
    
    return ()=> mounted = false
  },[])

  return (
    <div className="space-y-6">
      <DailyCards data={daily} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="p-6 bg-white/3 rounded">Cargando gráfico...</div>}>
            <ProjectionChart data={projection} />
          </Suspense>
        </div>
        <div>
          <Thermometer data={projection} />
        </div>
      </div>

      <WipList />

      <AssistantButton />
    </div>
  )
}
