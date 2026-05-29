import api from './api'

export const alertService = {
  getAll: async (params?: Record<string, any>) => {
    const { data } = await api.get('/client/alerts', { params })
    return data
  },

  getUnreadCount: async () => {
    const { data } = await api.get('/client/alerts/unread-count')
    return data
  },

  markAsRead: async (id: string) => {
    const { data } = await api.put(`/client/alerts/${id}/read`)
    return data
  },

  markAllRead: async () => {
    const { data } = await api.put('/client/alerts/read-all')
    return data
  },

  actionAlert: async (id: string, actionTaken: string) => {
    const { data } = await api.put(`/client/alerts/${id}/action`, { actionTaken })
    return data
  },

  dismissAlert: async (id: string) => {
    const { data } = await api.put(`/client/alerts/${id}/dismiss`)
    return data
  }
}