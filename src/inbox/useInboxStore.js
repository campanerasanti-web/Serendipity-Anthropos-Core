import create from 'zustand'
import inboxApi from './inboxApi'

const useInboxStore = create((set, get) => ({
  messages: [],
  filtered: [],
  selectedMessageId: null,
  thread: [],
  channelFilter: 'all',
  entityFilter: 'all',

  loadMessages: async (channel = 'all') => {
    try{
      const res = await inboxApi.getMessages(channel === 'all' ? '' : channel)
      set({ messages: res || [], filtered: res || [] })
    }catch(e){
      console.error('loadMessages', e)
      set({ messages: [], filtered: [] })
    }
  },

  loadThread: async (id) => {
    try{
      set({ selectedMessageId: id })
      const res = await inboxApi.getThread(id)
      set({ thread: res || [] })
    }catch(e){
      console.error('loadThread', e)
      set({ thread: [] })
    }
  },

  sendMessage: async (payload) => {
    const res = await inboxApi.sendMessage(payload)
    // optimistic: reload messages
    await get().loadMessages(get().channelFilter)
    return res
  },

  filterByChannel: (channel) => {
    const { messages } = get()
    set({ channelFilter: channel })
    if(channel === 'all') set({ filtered: messages })
    else set({ filtered: messages.filter(m => m.channel === channel) })
  },

  filterByEntity: (entity) => {
    const { filtered: current } = get()
    set({ entityFilter: entity })
    if(entity === 'all') set({ filtered: get().messages })
    else set({ filtered: get().messages.filter(m => (m.linkedEntities || []).some(le => le.type === entity)) })
  }
}))

export default useInboxStore
