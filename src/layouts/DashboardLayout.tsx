import { Outlet } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import Header from '../components/dashboard/Header'
import { useDashboardStore } from '../store/dashboardStore'
import { classNames } from '../utils/helpers'

export default function DashboardLayout() {
  const sidebarCollapsed = useDashboardStore((state) => state.sidebarCollapsed)

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className={classNames('flex-1 flex flex-col transition-all duration-300', sidebarCollapsed ? 'ml-20' : 'ml-64')}>
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}