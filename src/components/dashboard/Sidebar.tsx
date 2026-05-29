import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeftRight, Package, ShoppingCart,
  Users, Truck, UserRound, BarChart3, Bell, Settings, ChevronLeft, ChevronRight, FileText
} from 'lucide-react'
import { useDashboardStore } from '../../store/dashboardStore'
import { useAuthStore } from '../../store/authStore'
import { classNames } from '../../utils/helpers'
import toast from 'react-hot-toast'

const allNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true, blocked: false, moduleKey: 'dashboard' },
  { to: '/dashboard/transactions', icon: ArrowLeftRight, label: 'Transactions', blocked: true, moduleKey: 'transactions' },
  { to: '/dashboard/orders', icon: ShoppingCart, label: 'Orders', blocked: false, moduleKey: 'orders' },
  { to: '/dashboard/inventory', icon: Package, label: 'Inventory', blocked: false, moduleKey: 'inventory' },
  { to: '/dashboard/suppliers', icon: Truck, label: 'Suppliers', blocked: false, moduleKey: 'suppliers' },
  { to: '/dashboard/customers', icon: Users, label: 'Customers', blocked: false, moduleKey: 'customers' },
  { to: '/dashboard/employees', icon: UserRound, label: 'Employees', blocked: true, moduleKey: 'employees' },
  { to: '/dashboard/ai-insights', icon: BarChart3, label: 'AI Insights', blocked: true, moduleKey: 'aiInsights' },
  { to: '/dashboard/reports', icon: FileText, label: 'Reports', blocked: false, moduleKey: 'reports' },
  { to: '/dashboard/alerts', icon: Bell, label: 'Alerts', blocked: false, moduleKey: 'alerts' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings', blocked: false, moduleKey: 'settings' },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useDashboardStore()
  const organization = useAuthStore((state) => state.organization)
  const isTrial = organization?.plan === 'trial'
  const enabledModules = organization?.enabledModules || {}
  const navigate = useNavigate()

  const navItems = allNavItems.filter(item => {
    if (item.moduleKey === 'reports') return enabledModules[item.moduleKey] !== false
    return enabledModules[item.moduleKey] !== false
  })

  const handleClick = (e: React.MouseEvent, item: typeof allNavItems[0]) => {
    if (isTrial && item.blocked) {
      e.preventDefault()
      toast('Upgrade to Standard or Pro+ to access this feature', { icon: '🔒' })
    }
  }

  return (
    <aside className={classNames('fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 transition-all duration-300 flex flex-col', sidebarCollapsed ? 'w-20' : 'w-64')}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        {!sidebarCollapsed && <span className="text-lg font-bold text-primary-600">SupplySense</span>}
        <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={(e) => handleClick(e, item)}
            className={({ isActive }) =>
              classNames(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : isTrial && item.blocked
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                sidebarCollapsed && 'justify-center px-2'
              )
            }
          >
            <item.icon size={20} />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}