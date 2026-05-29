import { useState, useEffect } from 'react'

export function useDeviceCheck() {
  const [deviceId, setDeviceId] = useState<string>('')
  const [isActivated, setIsActivated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('supplysense-device-id')
    if (stored) {
      setDeviceId(stored)
      setIsActivated(true)
    }
  }, [])

  const activateDevice = (licenseKey: string): string => {
    const existing = localStorage.getItem('supplysense-device-id')
    if (existing) {
      setDeviceId(existing)
      setIsActivated(true)
      return existing
    }
    const id = 'device-' + Math.random().toString(36).substring(2, 10) + '-' + Date.now().toString(36)
    localStorage.setItem('supplysense-device-id', id)
    setDeviceId(id)
    setIsActivated(true)
    return id
  }

  return { deviceId, isActivated, activateDevice }
}