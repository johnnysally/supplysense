import { ReactNode } from 'react'

interface WidgetProps {
  title: string
  children: ReactNode
  className?: string
  actions?: ReactNode
}

export default function Widget({ title, children, className, actions }: WidgetProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">{title}</h3>
        {actions}
      </div>
      {children}
    </div>
  )
}