import React, {useState} from 'react'
import inboxApi from './inboxApi'

export default function MessageComposer({onClose, onSent}){
  const [channel, setChannel] = useState('email')
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [file, setFile] = useState(null)
  const [sending, setSending] = useState(false)

  const send = async () => {
    setSending(true)
    try{
      const payload = { channel, to, subject, body }
      if(file) payload.attachment = { name: file.name, type: file.type }
      await inboxApi.sendMessage(payload)
      onSent && onSent()
      onClose()
    }catch(e){
      console.error(e)
      alert('Error sending message')
    }finally{ setSending(false) }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="bg-white/5 p-6 rounded-lg z-10 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Redactar mensaje</h3>
        <div className="space-y-2">
          <div>
            <label className="text-xs">Canal</label>
            <select value={channel} onChange={e=>setChannel(e.target.value)} className="w-full p-2 bg-black/20 rounded">
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="zalo">Zalo</option>
            </select>
          </div>

          <div>
            <label className="text-xs">Para</label>
            <input value={to} onChange={e=>setTo(e.target.value)} className="w-full p-2 bg-black/20 rounded" />
          </div>

          {channel === 'email' && (
            <div>
              <label className="text-xs">Asunto</label>
              <input value={subject} onChange={e=>setSubject(e.target.value)} className="w-full p-2 bg-black/20 rounded" />
            </div>
          )}

          <div>
            <label className="text-xs">Cuerpo</label>
            <textarea value={body} onChange={e=>setBody(e.target.value)} className="w-full p-2 bg-black/20 rounded h-28" />
          </div>

          <div>
            <label className="text-xs">Adjuntar (stub)</label>
            <input type="file" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
            {file && <div className="text-xs text-slate-300">{file.name}</div>}
          </div>

          <div className="flex justify-end gap-2">
            <button className="px-3 py-2 bg-transparent border rounded" onClick={onClose}>Cancelar</button>
            <button className="px-3 py-2 bg-indigo-600 rounded text-white" onClick={send} disabled={sending}>{sending ? 'Enviando...' : 'Enviar'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
