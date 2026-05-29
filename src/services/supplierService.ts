import api from './api'

export const supplierService = {
  getAll: async (params?: Record<string, any>) => {
    const { data } = await api.get('/client/suppliers', { params })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/client/suppliers/${id}`)
    return data
  },

  create: async (payload: Record<string, any>) => {
    const { data } = await api.post('/client/suppliers', payload)
    return data
  },

  update: async (id: string, payload: Record<string, any>) => {
    const { data } = await api.put(`/client/suppliers/${id}`, payload)
    return data
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/client/suppliers/${id}`)
    return data
  },

  getPerformance: async () => {
    const { data } = await api.get('/client/suppliers/performance')
    return data
  }
}