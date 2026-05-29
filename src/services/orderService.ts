import api from './api'

export const orderService = {
  getAll: async (params?: Record<string, any>) => {
    const { data } = await api.get('/client/orders', { params })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/client/orders/${id}`)
    return data
  },

  create: async (payload: Record<string, any>) => {
    const { data } = await api.post('/client/orders', payload)
    return data
  },

  update: async (id: string, payload: Record<string, any>) => {
    const { data } = await api.put(`/client/orders/${id}`, payload)
    return data
  },

  updateStatus: async (id: string, status: string, notes?: string) => {
    const { data } = await api.put(`/client/orders/${id}/status`, { status, notes })
    return data
  },

  getStats: async () => {
    const { data } = await api.get('/client/orders/stats')
    return data
  }
}