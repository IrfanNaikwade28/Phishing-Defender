import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import ScoreBar from './ScoreBar'

export default function URLCard({ result }) {
  if (!result) return null

  const toneMap = {
    Safe: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      Icon: CheckCircle2
    },
    Suspicious: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      Icon: AlertTriangle
    },
    Unsafe: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      Icon: XCircle
    }
  }

  const tone = toneMap[result.status] ?? toneMap.Unsafe
  const Icon = tone.Icon

  return (
    <motion.div
      className={`card mt-4 ${tone.bg} ${tone.border}`}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-gray-500">URL</p>
          <p className="font-medium break-all">{result.url}</p>
        </div>
        <div className={`inline-flex items-center gap-2 ${tone.text} font-semibold whitespace-nowrap`}>
          <Icon className="h-5 w-5" />
          {result.status}
        </div>
      </div>

      <div className="mt-3">
        <ScoreBar score={result.risk_score} />
        <p className="mt-1 text-sm">Risk Score: {result.risk_score}/100</p>
      </div>

      {result.reasons?.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
          {result.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}
