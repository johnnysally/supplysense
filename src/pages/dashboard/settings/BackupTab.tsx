import { useState, useEffect } from 'react'
import { settingsService } from '../../../services/settingsService'
import api from '../../../services/api'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/common/Input'
import { formatDate } from '../../../utils/helpers'
import { Download, Trash2, Share2, RefreshCw, Upload, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BackupTab() {
  const [backups, setBackups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [shareFilename, setShareFilename] = useState('')
  const [shareEmail, setShareEmail] = useState('')
  const [importFile, setImportFile] = useState<File | null>(null)
  const [schedule, setSchedule] = useState({ enabled: false, frequency: 'daily', time: '02:00', email: '', sendOnBackup: false })

  const fetch = async () => {
    setLoading(true)
    try {
      const [backupRes, prefsRes] = await Promise.all([settingsService.getBackups(), settingsService.getPreferences()])
      setBackups(Array.isArray(backupRes) ? backupRes : [])
      if (prefsRes?.backupSchedule) setSchedule(prefsRes.backupSchedule)
    } catch (err) { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleCreate = async () => {
    setCreating(true)
    try { await settingsService.createBackup(); toast.success('Backup created'); fetch() }
    catch (err) { toast.error('Failed') }
    finally { setCreating(false) }
  }

  const handleDownload = async (filename: string) => {
    try {
      const fullFilename = filename.endsWith('.json') ? filename : `${filename}.json`
      const response = await api.get(`/client/backups/download/${fullFilename}`, { responseType: 'blob' })
      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = fullFilename; document.body.appendChild(a); a.click(); document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('Download started')
    } catch (err) { toast.error('Download failed') }
  }

  const handleDelete = async (filename: string) => {
    try { await settingsService.deleteBackup(filename); toast.success('Deleted'); fetch() }
    catch (err) { toast.error('Failed') }
  }

  const handleShare = async () => {
    if (!shareEmail) { toast.error('Email required'); return }
    try { await settingsService.shareBackup(shareFilename, shareEmail); toast.success('Shared'); setShowShare(false) }
    catch (err) { toast.error('Failed') }
  }

  const handleImport = async () => {
    if (!importFile) { toast.error('Select file'); return }
    try { const fd = new FormData(); fd.append('backup', importFile); await settingsService.importBackup(fd); toast.success('Imported'); setShowImport(false); fetch() }
    catch (err) { toast.error('Failed') }
  }

  const handleScheduleSave = async () => {
    try { await settingsService.updatePreferences({ backupSchedule: schedule }); toast.success('Schedule saved'); setShowSchedule(false); fetch() }
    catch (err) { toast.error('Failed to save') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-semibold">Backups</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setShowSchedule(true)}><Clock size={14} className="mr-1" /> Schedule</Button>
          <Button size="sm" variant="secondary" onClick={() => setShowImport(true)}><Upload size={14} className="mr-1" /> Import</Button>
          <Button size="sm" onClick={handleCreate} loading={creating}><RefreshCw size={14} className="mr-1" /> Backup Now</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : backups.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No backups yet</p>
      ) : (
        <div className="space-y-2">
          {backups.map((b, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-mono">{b.filename}</p>
                <p className="text-xs text-gray-500">{b.size} · {formatDate(b.createdAt)}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleDownload(b.filename)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><Download size={14} /></button>
                <button onClick={() => { setShareFilename(b.filename); setShowShare(true) }} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><Share2 size={14} /></button>
                <button onClick={() => handleDelete(b.filename)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showImport} onClose={() => setShowImport(false)} title="Import Backup">
        <div className="space-y-4">
          <input type="file" accept=".json" onChange={(e) => setImportFile(e.target.files?.[0] || null)} className="w-full text-sm" />
          <Button onClick={handleImport} disabled={!importFile} className="w-full">Import</Button>
        </div>
      </Modal>

      <Modal isOpen={showShare} onClose={() => setShowShare(false)} title="Share Backup">
        <div className="space-y-3">
          <p className="text-xs text-gray-500">{shareFilename}</p>
          <Input label="Email" type="email" value={shareEmail} onChange={(e) => setShareEmail(e.target.value)} />
          <Button onClick={handleShare} className="w-full">Send</Button>
        </div>
      </Modal>

      <Modal isOpen={showSchedule} onClose={() => setShowSchedule(false)} title="Auto Backup Schedule">
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={schedule.enabled} onChange={() => setSchedule({ ...schedule, enabled: !schedule.enabled })} className="w-4 h-4 rounded text-primary-600" />
            <span className="text-sm font-medium">Enable automatic backups</span>
          </label>
          <div>
            <label className="block text-sm font-medium mb-1">Frequency</label>
            <select value={schedule.frequency} onChange={(e) => setSchedule({ ...schedule, frequency: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800" disabled={!schedule.enabled}>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <Input label="Time (24h format)" type="time" value={schedule.time} onChange={(e) => setSchedule({ ...schedule, time: e.target.value })} disabled={!schedule.enabled} />
          <Input label="Email backup to" type="email" placeholder="admin@example.com" value={schedule.email} onChange={(e) => setSchedule({ ...schedule, email: e.target.value })} disabled={!schedule.enabled} />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={schedule.sendOnBackup} onChange={() => setSchedule({ ...schedule, sendOnBackup: !schedule.sendOnBackup })} className="w-4 h-4 rounded text-primary-600" disabled={!schedule.enabled} />
            <span className="text-sm">Automatically send backup to email when created</span>
          </label>
          <Button onClick={handleScheduleSave} className="w-full">Save Schedule</Button>
        </div>
      </Modal>
    </div>
  )
}