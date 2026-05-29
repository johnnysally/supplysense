import api from './api'

export const customerService = {
  getAll: async (params?: Record<string, any>) => {
    const { data } = await api.get('/client/customers', { params })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/client/customers/${id}`)
    return data
  },

  create: async (payload: Record<string, any>) => {
    const { data } = await api.post('/client/customers', payload)
    return data
  },

  update: async (id: string, payload: Record<string, any>) => {
    const { data } = await api.put(`/client/customers/${id}`, payload)
    return data
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/client/customers/${id}`)
    return data
  },

  getStats: async () => {
    const { data } = await api.get('/client/customers/stats')
    return data
  }
}