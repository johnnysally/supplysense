import { DivideIcon as LucideIcon } from 'lucide-react'
import { classNames } from '../../utils/helpers'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

export default function StatsCard({ title, value, icon: Icon, trend, trendUp, color = 'blue' }: StatsCardProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
          {trend && (
            <p className={classNames('text-xs mt-1', trendUp ? 'text-green-600' : 'text-red-600')}>{trend}</p>
          )}
        </div>
        <div className={classNames('p-3 rounded-xl', colors[color])}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  )
}