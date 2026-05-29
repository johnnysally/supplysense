import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'

export function useAuth() {
  const { token, user, organization, setAuth, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (token && !user) {
      authService.getProfile()
        .then((res) => setAuth(token, res.user, res.organization || organization))
        .catch(() => clearAuth())
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password)
    setAuth(res.token, res.user, res.organization)
    navigate('/dashboard')
  }

  const register = async (data: Record<string, any>) => {
    const res = await authService.register(data)
    setAuth(res.token, res.user, res.organization)
    navigate('/dashboard')
  }

  const logout = () => {
    clearAuth()
    navigate('/')
  }

  return { token, user, organization, login, register, logout, isAuthenticated: !!token }
}