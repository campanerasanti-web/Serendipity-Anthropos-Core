import apiClient from '../api/apiClient'

const inboxApi = {
  getMessages: (channel) => {
    return apiClient.get(`/inbox?channel=${channel}`)
  },
  getThread: (id) => {
    return apiClient.get(`/inbox/thread/${id}`)
  },
  sendMessage: (payload) => {
    return apiClient.post('/messages/send', payload).then(r=>r).catch(e=>{throw e})
  }
}

export default inboxApi
