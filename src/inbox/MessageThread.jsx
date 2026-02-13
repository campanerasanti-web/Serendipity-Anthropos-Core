import React from 'react'
import useInboxStore from './useInboxStore'
import MessageItem from './MessageItem'

export default function MessageThread(){
  const thread = useInboxStore(state => state.thread)
  const selectedId = useInboxStore(state => state.selectedMessageId)

  if(!selectedId) return <div className="p-4 text-slate-400">Selecciona un mensaje para ver el hilo</div>

  return (
    <div className="p-4 space-y-4 h-[70vh] overflow-auto">
      {thread.length === 0 && <div className="text-slate-400">No hay mensajes en este hilo</div>}
      {thread.map((m, idx) => (
        <MessageItem key={m.id || idx} msg={m} incoming={m.direction !== 'outbound'} />
      ))}

      <div className="mt-4">
        <button className="px-3 py-2 bg-indigo-600 rounded" onClick={()=>alert('Vincular a entidad (stub)')}>Vincular a entidad</button>
      </div>
    </div>
  )
}
