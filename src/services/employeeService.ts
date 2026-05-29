import api from './api'

export const employeeService = {
  getAll: async (params?: Record<string, any>) => {
    const { data } = await api.get('/client/employees', { params })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/client/employees/${id}`)
    return data
  },

  create: async (payload: Record<string, any>) => {
    const { data } = await api.post('/client/employees', payload)
    return data
  },

  update: async (id: string, payload: Record<string, any>) => {
    const { data } = await api.put(`/client/employees/${id}`, payload)
    return data
  },

  recordPerformance: async (id: string, payload: Record<string, any>) => {
    const { data } = await api.put(`/client/employees/${id}/performance`, payload)
    return data
  },

  deactivate: async (id: string) => {
    const { data } = await api.delete(`/client/employees/${id}`)
    return data
  },

  getDepartmentPerformance: async () => {
    const { data } = await api.get('/client/employees/departments')
    return data
  }
}