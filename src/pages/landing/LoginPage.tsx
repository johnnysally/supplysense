import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const token = useAuthStore((state) => state.token)
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  useEffect(() => {
    const existingDevice = localStorage.getItem('supplysense-device-id')
    if (!existingDevice) {
      navigate('/activate', { replace: true })
    }
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Email and password are required')
      return
    }

    setLoading(true)
    try {
      const res = await authService.login(email, password)
      setAuth(res.token, res.user, res.organization)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed'
      const data = err?.response?.data

      if (data?.requireActivation) {
        toast.error(msg)
        navigate('/activate')
      } else if (data?.pendingApproval) {
        toast(msg, { icon: '⏳', duration: 6000 })
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-600">SupplySense</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="flex items-center justify-between text-sm">
              <Link to="/activate" className="text-primary-600 hover:underline">Activate License</Link>
              <Link to="/login" className="text-primary-600 hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" loading={loading} className="w-full">Sign In</Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account? <Link to="/pricing" className="text-primary-600 hover:underline">Get Started</Link>
        </p>
      </div>
    </div>
  )
}