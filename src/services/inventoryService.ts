import api from './api'

export const inventoryService = {
  getAll: async (params?: Record<string, any>) => {
    const { data } = await api.get('/client/inventory', { params })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/client/inventory/${id}`)
    return data
  },

  create: async (payload: Record<string, any>) => {
    const { data } = await api.post('/client/inventory', payload)
    return data
  },

  update: async (id: string, payload: Record<string, any>) => {
    const { data } = await api.put(`/client/inventory/${id}`, payload)
    return data
  },

  adjustStock: async (id: string, quantity: number, type: string, reason?: string) => {
    const { data } = await api.put(`/client/inventory/${id}/stock`, { quantity, type, reason })
    return data
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/client/inventory/${id}`)
    return data
  },

  getCategories: async () => {
    const { data } = await api.get('/client/inventory/categories')
    return data
  },

  getLowStock: async () => {
    const { data } = await api.get('/client/inventory/low-stock')
    return data
  }
}