import { useState } from 'react'
import api from '../api/api'
import toast from 'react-hot-toast'
import URLCard from '../components/URLCard'
import Gauge from '../components/Gauge'
import RecentRiskGauge from '../components/RecentRiskGauge'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState([])
  const statusFor = (s) => (s < 40 ? 'Safe' : s < 70 ? 'Suspicious' : 'Unsafe')

  const onCheck = async (e) => {
    e.preventDefault()
    if (!url) return
    setLoading(true)
    try {
      const res = await api.post('/check-url', { url })
      setResult(res.data)
      setRecent((r) => [
        { score: res.data.risk_score, status: statusFor(res.data.risk_score), name: new Date().toLocaleTimeString() },
        ...r
      ].slice(0, 10))
    } catch (e) {
      toast.error(e.response?.data?.error || 'Check failed')
    } finally {
      setLoading(false)
    }
  }

  // Compose items for the gauge: prefer current result, then recent
  const displayRecent = result
    ? [{ score: result.risk_score, status: statusFor(result.risk_score), name: 'Now' }, ...recent].slice(0, 10)
    : recent

  return (
    <div>
      <section className="min-h-[30vh] flex items-center">
        <motion.div
          className="card w-full"
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <form className="flex flex-col sm:flex-row gap-1" onSubmit={onCheck}>
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
        <h2 className="font-semibold">Recent Risk Scores</h2>
        <RecentRiskGauge items={displayRecent} />
      </div>
    </div>
  )
}
