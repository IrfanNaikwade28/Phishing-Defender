import { useState } from 'react'
import api from '../api/api'
import toast from 'react-hot-toast'
import URLCard from '../components/URLCard'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { motion } from 'framer-motion'

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
      <section className="min-h-[40vh] flex items-center">
        <motion.div
          className="card w-full"
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <form className="flex flex-col sm:flex-row gap-2" onSubmit={onCheck}>
            <input className="input" placeholder="Paste a URL to scan (e.g., https://example.com)" value={url} onChange={e=>setUrl(e.target.value)} />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Checking…' : 'Scan Now'}
            </button>
          </form>
          <p className="mt-2 text-xs text-gray-500">We’ll analyze the URL for phishing signals. Your data stays private.</p>
        </motion.div>
      </section>

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
