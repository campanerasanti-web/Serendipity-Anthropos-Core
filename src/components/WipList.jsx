import React, {useEffect, useState} from 'react'
import { getWipList } from '../api/productionApi'

export default function WipList(){
  const [items, setItems] = useState([])

  useEffect(()=>{
    let mounted = true
    getWipList()
      .then(r => {
        if(!mounted) return
        // Normalize response: accept arrays or wrapped payloads
        if (Array.isArray(r)) return setItems(r)
        if (r == null) return setItems([])
        if (Array.isArray(r.items)) return setItems(r.items)
        if (Array.isArray(r.data)) return setItems(r.data)
        // fallback: if it's an object with enumerable values, try to use that, otherwise empty
        try {
          const vals = Object.values(r).find(v => Array.isArray(v))
          if (Array.isArray(vals) && vals.length > 0) return setItems(vals)
        } catch {}
        return setItems([])
      })
      .catch(err => console.error('Error fetching WIP list:', err))
    return ()=> mounted = false
  },[])

  return (
    <div className="bg-white/3 p-4 rounded-lg border border-white/5 mt-4">
      <h4 className="text-sm font-medium mb-2">Órdenes en WIP</h4>
      <ul className="space-y-2">
        {(!Array.isArray(items) || items.length === 0) && <li className="text-slate-400">No hay órdenes en WIP</li>}
        {Array.isArray(items) && items.map(it=> (
          <li key={it.id} className="flex justify-between">
            <span>{it.name}</span>
            <span className="text-slate-400 text-sm">{it.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
