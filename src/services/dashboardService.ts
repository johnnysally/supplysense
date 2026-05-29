import api from './api'

export const dashboardService = {
  getStats: async () => {
    const { data } = await api.get('/client/dashboard/stats')
    return data
  },

  getCharts: async () => {
    const { data } = await api.get('/client/dashboard/charts')
    return data
  }
}