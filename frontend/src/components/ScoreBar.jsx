import { motion } from 'framer-motion'

export default function ScoreBar({ score }) {
  const tone = score < 40 ? 'green' : score < 70 ? 'yellow' : 'red'
  const gradients = {
    green: 'linear-gradient(90deg, #22c55e, #4ade80)',
    yellow: 'linear-gradient(90deg, #eab308, #facc15)',
    red: 'linear-gradient(90deg, #ef4444, #f87171)'
  }
  return (
    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded">
      <motion.div
        className="h-3 rounded"
        style={{ background: gradients[tone] }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        transition={{ type: 'spring', stiffness: 180, damping: 24 }}
      />
    </div>
  )
}
