import React from 'react'

export default function MessageItem({msg, incoming}){
  const time = new Date(msg.createdAt || msg.created_at || Date.now()).toLocaleString()
  return (
    <div className={`flex gap-3 ${incoming ? 'items-start' : 'justify-end'}`}>
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">{msg.from ? msg.from[0] : 'U'}</div>
      <div className="max-w-[70%]">
        <div className={`p-3 rounded-lg ${incoming ? 'bg-white/5 text-left' : 'bg-indigo-600 text-white'}`}>
          <div className="text-sm mb-1">{msg.subject && <span className="font-semibold">{msg.subject}</span>}</div>
          <div className="text-sm">{msg.body}</div>
        </div>
        <div className="text-xs text-slate-400 mt-1">{time} • {msg.channel}</div>
      </div>
    </div>
  )
}
