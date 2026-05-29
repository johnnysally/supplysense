import { useState, useEffect } from 'react'
import { dashboardService } from '../../services/dashboardService'
import { transactionService } from '../../services/transactionService'
import { inventoryService } from '../../services/inventoryService'
import Chart from '../../components/common/Chart'
import Widget from '../../components/dashboard/Widget'
import { formatCurrency } from '../../utils/helpers'
import { useAuthStore } from '../../store/authStore'
import { FileText, TrendingUp, Package, AlertTriangle } from 'lucide-react'

export default function ReportsPage() {
  const organization = useAuthStore((state) => state.organization)
  const currency = (organization as any)?.settings?.currency || 'KSh'
  const [activeTab, setActiveTab] = useState('sales')
  const [loading, setLoading] = useState(true)
  const [salesData, setSalesData] = useState<any>(null)
  const [inventoryData, setInventoryData] = useState<any>(null)
  const [charts, setCharts] = useState<any>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [txSummary, inv, dashCharts] = await Promise.all([
          transactionService.getSummary('monthly'),
          inventoryService.getAll({ limit: '100' }),
          dashboardService.getCharts()
        ])
        setSalesData(txSummary)
        setInventoryData(inv)
        setCharts(dashCharts)
      } catch (err) { console.error('Reports error:', err) }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>

  const tabs = [
    { key: 'sales', label: 'Sales', icon: TrendingUp },
    { key: 'inventory', label: 'Inventory', icon: Package },
    { key: 'financial', label: 'Financial', icon: FileText },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Reports</h1>

      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Widget title="Total Revenue"><p className="text-2xl font-bold">{formatCurrency(salesData?.reduce((a: number, b: any) => a + (b.total || 0), 0) || 0, currency)}</p></Widget>
            <Widget title="Total Transactions"><p className="text-2xl font-bold">{salesData?.reduce((a: number, b: any) => a + (b.count || 0), 0) || 0}</p></Widget>
            <Widget title="Avg Transaction"><p className="text-2xl font-bold">{formatCurrency(salesData?.length ? (salesData.reduce((a: number, b: any) => a + b.total, 0) / salesData.reduce((a: number, b: any) => a + b.count, 0)) : 0, currency)}</p></Widget>
            <Widget title="Revenue Trend"><p className="text-sm text-green-600">Monthly breakdown below</p></Widget>
          </div>
          <Widget title="Monthly Revenue">
            <Chart type="bar" data={salesData?.map((s: any) => ({ name: s._id?.period || s._id, amount: s.total })) || []} dataKeys={['amount']} height={300} />
          </Widget>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Widget title="Total Products"><p className="text-2xl font-bold">{inventoryData?.products?.length || 0}</p></Widget>
            <Widget title="Low Stock"><p className="text-2xl font-bold text-red-600">{inventoryData?.products?.filter((p: any) => p.stockLevel <= p.reorderThreshold).length || 0}</p></Widget>
            <Widget title="Total Stock Value"><p className="text-2xl font-bold">{formatCurrency(inventoryData?.products?.reduce((a: number, p: any) => a + (p.stockLevel * p.unitCost), 0) || 0, currency)}</p></Widget>
            <Widget title="Avg Stock Level"><p className="text-2xl font-bold">{Math.round(inventoryData?.products?.reduce((a: number, p: any) => a + p.stockLevel, 0) / (inventoryData?.products?.length || 1)) || 0}</p></Widget>
          </div>
          <Widget title="Stock Levels">
            <Chart type="bar" data={inventoryData?.products?.map((p: any) => ({ name: p.name, stock: p.stockLevel })) || []} dataKeys={['stock']} height={300} />
          </Widget>
        </div>
      )}

      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Widget title="Total Revenue"><p className="text-2xl font-bold">{formatCurrency(charts?.monthlyRevenue?.reduce((a: number, r: any) => a + (r.revenue || 0), 0) || 0, currency)}</p></Widget>
            <Widget title="Avg Monthly Revenue"><p className="text-2xl font-bold">{formatCurrency(charts?.monthlyRevenue?.length ? charts.monthlyRevenue.reduce((a: number, r: any) => a + r.revenue, 0) / charts.monthlyRevenue.length : 0, currency)}</p></Widget>
            <Widget title="Months Tracked"><p className="text-2xl font-bold">{charts?.monthlyRevenue?.length || 0}</p></Widget>
          </div>
          <Widget title="Revenue Trend">
            <Chart type="line" data={charts?.monthlyRevenue || []} dataKeys={['revenue']} xKey="_id" height={300} />
          </Widget>
        </div>
      )}
    </div>
  )
}