import { useEffect, useState } from 'react'
import api from '../api/api'
import toast from 'react-hot-toast'

export default function History() {
  const [items, setItems] = useState([])

  useEffect(() => {
    api.get('/history')
      .then((res) => setItems(res.data.history))
      .catch((e) => toast.error(e.response?.data?.error || 'Failed to load history'))
  }, [])

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
            {items.map((it) => (
              <tr key={it.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 break-all">{it.url}</td>
                <td className="py-2 pr-4">{it.risk_score}</td>
                <td className="py-2 pr-4">{it.status}</td>
                <td className="py-2 pr-4">{new Date(it.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
