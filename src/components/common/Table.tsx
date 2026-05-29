import { classNames } from '../../utils/helpers'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (item: T) => void
}

export default function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data found',
  onRowClick
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">{emptyMessage}</div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className={classNames('px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider', col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {data.map((item, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(item)}
              className={classNames('transition-colors', onRowClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800')}
            >
              {columns.map((col) => (
                <td key={col.key} className={classNames('px-4 py-3', col.className)}>
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}