import React from 'react'
import useInboxStore from './useInboxStore'

const ChannelIcon = ({channel}) => {
  if(channel === 'email') return <span>📧</span>
  if(channel === 'whatsapp') return <span>💬</span>
  if(channel === 'zalo') return <span>🟦</span>
  return <span>💬</span>
}

export default function MessageList(){
  const filtered = useInboxStore(state => state.filtered)
  const loadThread = useInboxStore(state => state.loadThread)

  return (
    <div className="p-2 h-[80vh] overflow-auto">
      {filtered.length === 0 && <div className="text-slate-400">No messages</div>}
      <ul className="space-y-2">
        {filtered.map(m => (
          <li key={m.id} className={`p-3 rounded-lg cursor-pointer hover:bg-white/3 flex justify-between items-start`} onClick={()=>loadThread(m.id)}>
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">{m.from ? m.from[0] : 'U'}</div>
              <div>
                <div className="flex items-center gap-2">
                  <ChannelIcon channel={m.channel} />
                  <div className="font-medium">{m.subject || m.preview || m.body?.slice?.(0,50)}</div>
                </div>
                <div className="text-xs text-slate-400">{m.excerpt || m.preview || ''}</div>
              </div>
            </div>
            <div className="text-xs text-slate-400">{m.read ? '' : <span className="text-amber-400">●</span>}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
