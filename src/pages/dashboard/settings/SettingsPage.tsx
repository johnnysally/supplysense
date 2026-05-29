import { useState } from 'react'
import CompanyInfoTab from './CompanyInfoTab'
import PreferencesTab from './PreferencesTab'
import ModulesTab from './ModulesTab'
import ERPTab from './ERPTab'
import UsersTab from './UsersTab'
import DevicesTab from './DevicesTab'
import BackupTab from './BackupTab'
import { classNames } from '../../../utils/helpers'

const tabs = [
  { key: 'company', label: 'Company Info', component: CompanyInfoTab },
  { key: 'preferences', label: 'Preferences', component: PreferencesTab },
  { key: 'modules', label: 'Modules', component: ModulesTab },
  { key: 'erp', label: 'ERP Connect', component: ERPTab },
  { key: 'users', label: 'Users', component: UsersTab },
  { key: 'devices', label: 'Devices', component: DevicesTab },
  { key: 'backups', label: 'Backups', component: BackupTab },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company')
  const ActiveComponent = tabs.find(t => t.key === activeTab)?.component || CompanyInfoTab

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Settings</h1>
      <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={classNames(
              'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              activeTab === tab.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ActiveComponent />
    </div>
  )
}