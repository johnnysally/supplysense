import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  _id: string
  organizationId: string
  fullName: string
  email: string
  role: string
  department: string
  phone: string
  isActive: boolean
  isVerified: boolean
}

interface Organization {
  name: string
  plan: string
  billingCycle: string
  planEndDate: string | null
  trialEndDate: string | null
  licenseKey?: string
  enabledModules?: Record<string, boolean>
  mode?: string
}

interface AuthState {
  token: string | null
  user: User | null
  organization: Organization | null
  isHydrated: boolean
  setAuth: (token: string, user: User, organization?: Organization) => void
  clearAuth: () => void
  setHydrated: () => void
  updateOrganization: (org: Partial<Organization>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      organization: null,
      isHydrated: false,
      setAuth: (token, user, organization) => set({ token, user, organization: organization || null, isHydrated: true }),
      clearAuth: () => set({ token: null, user: null, organization: null, isHydrated: true }),
      setHydrated: () => set({ isHydrated: true }),
      updateOrganization: (org) => set((state) => ({ organization: { ...state.organization, ...org } as Organization }))
    }),
    {
      name: 'supplysense-client-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      }
    }
  )
)