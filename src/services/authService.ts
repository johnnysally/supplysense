import api from './api'

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/client/auth/login', { email, password })
    return data
  },

  register: async (payload: Record<string, any>) => {
    const { data } = await api.post('/client/auth/register', payload)
    return data
  },

  activateLicense: async (licenseKey: string, deviceId: string, deviceName?: string) => {
    const { data } = await api.post('/client/auth/activate-license', {
      licenseKey,
      deviceId,
      deviceName: deviceName || 'Web Browser',
      deviceType: 'desktop'
    })
    return data
  },

  getProfile: async () => {
    const { data } = await api.get('/client/auth/profile')
    return data
  },

  updateProfile: async (profile: Record<string, any>) => {
    const { data } = await api.put('/client/auth/profile', profile)
    return data
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.put('/client/auth/change-password', { currentPassword, newPassword })
    return data
  },

  forgotPassword: async (email: string) => {
    const { data } = await api.post('/client/auth/forgot-password', { email })
    return data
  },

  resetPassword: async (token: string, newPassword: string) => {
    const { data } = await api.post('/client/auth/reset-password', { token, newPassword })
    return data
  },

  verifyDevice: async (deviceId: string, otp: string) => {
    const { data } = await api.post('/client/auth/verify-device', { deviceId, otp })
    return data
  },

  sendDeviceOTP: async (deviceId: string) => {
    const { data } = await api.post('/client/auth/send-device-otp', { deviceId })
    return data
  },

  submitManualPayment: async (payload: Record<string, any>) => {
    const { data } = await api.post('/client/auth/manual-payment', payload)
    return data
  },

  logout: async () => {
    return api.post('/client/auth/logout')
  }
}