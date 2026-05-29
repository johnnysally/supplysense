import { useState, useEffect } from 'react'
import { Package, ShoppingCart, Truck, TrendingUp } from 'lucide-react'
import StatsCard from '../../components/dashboard/StatsCard'
import Widget from '../../components/dashboard/Widget'
import AlertFeed from '../../components/dashboard/AlertFeed'
import Chart from '../../components/common/Chart'
import { dashboardService } from '../../services/dashboardService'

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [stats, charts] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getCharts()
      ])
      setData({ ...stats, ...charts })
      setRefreshKey(prev => prev + 1)
    } catch (err) {
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    const handleFocus = () => fetchData()
    window.addEventListener('focus', handleFocus)
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  if (loading && !data) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
  }

  const stats = data?.stats || data

  return (
    <div key={refreshKey}>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Products" value={stats?.totalProducts || 0} icon={Package} color="blue" />
        <StatsCard title="Active Orders" value={stats?.activeOrders || 0} icon={ShoppingCart} color="green" />
        <StatsCard title="Suppliers" value={stats?.totalSuppliers || 0} icon={Truck} color="yellow" />
        <StatsCard title="Stock Health" value={`${stats?.stockHealth || 100}%`} icon={TrendingUp} color={stats?.stockHealth < 50 ? 'red' : 'purple'} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Widget title="Monthly Revenue">
            <Chart type="line" data={data?.monthlyRevenue || []} dataKeys={['revenue']} xKey="_id" height={260} />
          </Widget>
        </div>
        <div>
          <AlertFeed alerts={data?.recentAlerts || []} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Widget title="Order Status">
          <Chart type="pie" data={data?.orderStatusData?.map((i: any) => ({ name: i._id, value: i.count })) || []} dataKeys={['value']} height={260} />
        </Widget>
        <Widget title="Supplier Performance">
          <Chart type="bar" data={data?.supplierPerformance?.slice(0, 5) || []} dataKeys={['reliabilityScore']} xKey="name" height={260} />
        </Widget>
      </div>
    </div>
  )
}