import React, {useEffect, useState} from 'react'
import useInboxStore from './useInboxStore'
import MessageList from './MessageList'
import MessageThread from './MessageThread'
import MessageComposer from './MessageComposer'

export default function InboxUnified(){
  const loadMessages = useInboxStore(state => state.loadMessages)
  const filterByChannel = useInboxStore(state => state.filterByChannel)
  const filterByEntity = useInboxStore(state => state.filterByEntity)
  const [showComposer, setShowComposer] = useState(false)

  useEffect(()=>{ loadMessages() }, [loadMessages])

  return (
    <div className="flex gap-6">
      {/* Left: message list */}
      <div className="w-1/4 bg-white/3 rounded p-3">
        <div className="flex gap-2 mb-3">
          <select onChange={e=>filterByChannel(e.target.value)} className="p-2 bg-black/20 rounded w-full">
            <option value="all">Todos los canales</option>
            <option value="email">📧 Email</option>
            <option value="whatsapp">💬 WhatsApp</option>
            <option value="zalo">🟦 Zalo</option>
          </select>
        </div>

        <div className="mb-3">
          <select onChange={e=>filterByEntity(e.target.value)} className="p-2 bg-black/20 rounded w-full">
            <option value="all">Todas las entidades</option>
            <option value="order">Orden</option>
            <option value="lot">Lote</option>
            <option value="invoice">Factura</option>
            <option value="payment">Pago</option>
          </select>
        </div>

        <MessageList />

        <div className="mt-4">
          <button className="w-full px-3 py-2 bg-indigo-600 rounded" onClick={()=>setShowComposer(true)}>Nuevo mensaje</button>
        </div>
      </div>

      {/* Middle: thread */}
      <div className="flex-1 bg-white/3 rounded p-3">
        <MessageThread />
      </div>

      {/* Right: metadata */}
      <div className="w-1/4 bg-white/3 rounded p-3">
        <h4 className="text-sm font-medium mb-2">Metadatos</h4>
        <div className="text-xs text-slate-300">Selecciona un mensaje para ver metadatos</div>
      </div>

      {showComposer && <MessageComposer onClose={()=>setShowComposer(false)} onSent={()=>loadMessages()} />}
    </div>
  )
}
