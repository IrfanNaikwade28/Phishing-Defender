import { useState } from 'react'
import api from '../api/api'
import toast from 'react-hot-toast'
import URLCard from '../components/URLCard'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function Dashboard() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState([])

  const onCheck = async (e) => {
    e.preventDefault()
    if (!url) return
    setLoading(true)
    try {
      const res = await api.post('/check-url', { url })
      setResult(res.data)
      setRecent((r) => [{ score: res.data.risk_score, name: new Date().toLocaleTimeString() }, ...r].slice(0, 10))
    } catch (e) {
      toast.error(e.response?.data?.error || 'Check failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="card">
        <form className="flex gap-2" onSubmit={onCheck}>
          <input className="input" placeholder="https://example.com" value={url} onChange={e=>setUrl(e.target.value)} />
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Checking...' : 'Check URL'}</button>
        </form>
      </div>

      <URLCard result={result} />

      <div className="card mt-4">
        <h2 className="font-semibold mb-2">Recent Scores</h2>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={recent}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <YAxis domain={[0,100]} />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#6366f1" fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
