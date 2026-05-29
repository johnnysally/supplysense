import api from './api'

export const transactionService = {
  getAll: async (params?: Record<string, any>) => {
    const { data } = await api.get('/client/transactions', { params })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/client/transactions/${id}`)
    return data
  },

  create: async (payload: Record<string, any>) => {
    const { data } = await api.post('/client/transactions', payload)
    return data
  },

  update: async (id: string, payload: Record<string, any>) => {
    const { data } = await api.put(`/client/transactions/${id}`, payload)
    return data
  },

  getSummary: async (period?: string) => {
    const { data } = await api.get('/client/transactions/summary', { params: { period } })
    return data
  }
}