import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DashboardState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
    }),
    {
      name: 'supplysense-client-sidebar',
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed })
    }
  )
)