import api from './api'

export const settingsService = {
  getCompanyInfo: async () => { const { data } = await api.get('/client/company-settings'); return data },
  updateCompanyInfo: async (payload: Record<string, any>) => { const { data } = await api.put('/client/company-settings', payload); return data },
  uploadLogo: async (file: File) => { const fd = new FormData(); fd.append('logo', file); const { data } = await api.post('/client/company-settings/logo', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); return data },
  getPreferences: async () => { const { data } = await api.get('/client/preferences'); return data },
  updatePreferences: async (payload: Record<string, any>) => { const { data } = await api.put('/client/preferences', payload); return data },
  getUsers: async () => { const { data } = await api.get('/client/users'); return data },
  createUser: async (payload: Record<string, any>) => { const { data } = await api.post('/client/users', payload); return data },
  updateUser: async (id: string, payload: Record<string, any>) => { const { data } = await api.put(`/client/users/${id}`, payload); return data },
  deleteUser: async (id: string) => { const { data } = await api.delete(`/client/users/${id}`); return data },
  getDevices: async () => { const { data } = await api.get('/client/devices'); return data },
  getDeviceActivity: async (id: string) => { const { data } = await api.get(`/client/devices/${id}/activity`); return data },
  deactivateDevice: async (id: string, reason?: string) => { const { data } = await api.put(`/client/devices/${id}/deactivate`, { reason }); return data },
  getBackups: async () => { const { data } = await api.get('/client/backups'); return data },
  createBackup: async () => { const { data } = await api.post('/client/backups'); return data },
  deleteBackup: async (filename: string) => { const { data } = await api.delete(`/client/backups/${filename}`); return data },
  emailBackup: async (filename: string) => { const { data } = await api.post(`/client/backups/email/${filename}`); return data },
  shareBackup: async (filename: string, email: string) => { const { data } = await api.post(`/client/backups/share/${filename}`, { email }); return data },
  restoreBackup: async (filename: string) => { const { data } = await api.post(`/client/backups/restore/${filename}`); return data },
  importBackup: async (formData: FormData) => { const { data } = await api.post('/client/backups/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); return data },
  getERPConnections: async () => { const { data } = await api.get('/client/erp'); return data },
  addERPConnection: async (payload: Record<string, any>) => { const { data } = await api.post('/client/erp', payload); return data },
  testERPConnection: async (id: string) => { const { data } = await api.post(`/client/erp/${id}/test`); return data },
  syncERPConnection: async (id: string) => { const { data } = await api.post(`/client/erp/${id}/sync`); return data },
  unsyncERPConnection: async (id: string) => { const { data } = await api.post(`/client/erp/${id}/unsync`); return data },
  deleteERPConnection: async (id: string) => { const { data } = await api.delete(`/client/erp/${id}`); return data }
}