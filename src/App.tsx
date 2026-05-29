import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import LandingPage from './pages/landing/LandingPage'
import LoginPage from './pages/landing/LoginPage'
import RegisterPage from './pages/landing/RegisterPage'
import LicenseKeyPage from './pages/landing/LicenseKeyPage'
import PricingPage from './pages/landing/PricingPage'
import CheckoutPage from './pages/landing/CheckoutPage'
import FAQPage from './pages/landing/FAQPage'
import HelpPage from './pages/landing/HelpPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import TransactionsPage from './pages/dashboard/TransactionsPage'
import OrdersPage from './pages/dashboard/OrdersPage'
import InventoryPage from './pages/dashboard/InventoryPage'
import SuppliersPage from './pages/dashboard/SuppliersPage'
import CustomersPage from './pages/dashboard/CustomersPage'
import EmployeesPage from './pages/dashboard/EmployeesPage'
import AIInsightsPage from './pages/dashboard/AIInsightsPage'
import ReportsPage from './pages/dashboard/ReportsPage'
import AlertSystemPage from './pages/dashboard/AlertSystemPage'
import SettingsPage from './pages/dashboard/settings/SettingsPage'
import { useAuthStore } from './store/authStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token)
  const isHydrated = useAuthStore((state) => state.isHydrated)
  if (!isHydrated) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="activate" element={<LicenseKeyPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="help" element={<HelpPage />} />
        </Route>
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="ai-insights" element={<AIInsightsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="alerts" element={<AlertSystemPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}