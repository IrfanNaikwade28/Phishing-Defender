import { useEffect, useState } from 'react'
import api from '../api/api'
import toast from 'react-hot-toast'
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react'

export default function History() {
  const [items, setItems] = useState([])

  useEffect(() => {
    api.get('/history')
      .then((res) => setItems(res.data.history))
      .catch((e) => toast.error(e.response?.data?.error || 'Failed to load history'))
  }, [])

  const badgeFor = (status) => {
    if (status === 'Safe') return { cls: 'badge badge-green', Icon: CheckCircle2 }
    if (status === 'Suspicious') return { cls: 'badge badge-yellow', Icon: AlertTriangle }
    return { cls: 'badge badge-red', Icon: XCircle }
  }

  return (
    <div className="card">
      <h2 className="font-semibold mb-3">Your Scans</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-200 dark:border-gray-700">
              <th className="py-2 pr-4">URL</th>
              <th className="py-2 pr-4">Score</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">When</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const { cls, Icon } = badgeFor(it.status)
              return (
                <tr key={it.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="py-3 pr-4 break-all">{it.url}</td>
                  <td className="py-3 pr-4 font-medium">{it.risk_score}</td>
                  <td className="py-3 pr-4"><span className={cls}><Icon className="h-3.5 w-3.5"/> {it.status}</span></td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-300 inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5"/> {new Date(it.created_at).toLocaleString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
