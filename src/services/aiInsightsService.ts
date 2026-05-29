import api from './api'

export const aiInsightsService = {
  getGeneral: async () => {
    const { data } = await api.get('/client/ai-insights')
    return data
  },

  search: async (query: string, category?: string) => {
    const { data } = await api.get('/client/ai-insights/search', { params: { query, category } })
    return data
  },

  getPrediction: async (type: string, referenceId?: string) => {
    const { data } = await api.get('/client/ai-insights/prediction', { params: { type, referenceId } })
    return data
  }
}