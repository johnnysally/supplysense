import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useFetch<T>(url: string | null): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trigger, setTrigger] = useState(0)

  const fetchData = useCallback(async () => {
    if (!url) return
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(url)
      setData(response.data)
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }, [url, trigger])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = () => setTrigger((p) => p + 1)

  return { data, loading, error, refetch }
}