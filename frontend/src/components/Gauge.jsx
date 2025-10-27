import { motion } from 'framer-motion'

// Minimal, premium radial gauge for 0–100 values
// Props: value (0–100)
export default function Gauge({ value = 0 }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0))

  // Geometry helpers
  const polar = (cx, cy, r, deg) => {
    const rad = (Math.PI / 180) * deg
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
  }
  const arc = (cx, cy, r, start, end) => {
    const [sx, sy] = polar(cx, cy, r, start)
    const [ex, ey] = polar(cx, cy, r, end)
    const largeArc = Math.abs(end - start) <= 180 ? 0 : 1
    return `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}`
  }

  const cx = 100, cy = 110, r = 80
  const endAngle = 180 - v * 1.8

  // Full track path (used for track and as a normalized path with pathLength=100)
  const fullArc = arc(cx, cy, r, 180, 0)

  // Status mapping for center label
  const status = v < 40 ? 'Safe' : v < 70 ? 'Suspicious' : 'Dangerous'
  const toneClass = status === 'Safe' ? 'text-green-500' : status === 'Suspicious' ? 'text-yellow-500' : 'text-red-500'
  const dotColor = status === 'Safe' ? '#22c55e' : status === 'Suspicious' ? '#eab308' : '#ef4444'

  // Dot position (glowing indicator)
  const [dx, dy] = polar(cx, cy, r, endAngle)

  const progress = v // 0..100 used with pathLength=100

  return (
    <div className="w-full">
      <div className="relative mx-auto" style={{ maxWidth: 460 }} aria-label={`Risk gauge ${v} out of 100`}>
        <svg viewBox="0 0 200 140" className="w-full overflow-visible">
          <defs>
            {/* Subtle glow filter for the active dot and arc */}
            <filter id="gGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Gradient across the arc: green -> yellow -> red */}
            <linearGradient id="gGradient" x1="20" y1="110" x2="180" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="40%" stopColor="#eab308" />
              <stop offset="70%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Soft background ring */}
          <path d={fullArc} fill="none" stroke="#6b7280" strokeOpacity="0.12" strokeWidth="14" strokeLinecap="round" />
          {/* Ambient glow under progress */}
          <motion.path
            d={fullArc}
            pathLength={100}
            fill="none"
            stroke="url(#gGradient)"
            strokeOpacity="0.15"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${100 - progress}`}
            filter="url(#gGlow)"
            animate={{ strokeDasharray: `${progress} ${100 - progress}` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          {/* Foreground progress arc */}
          <motion.path
            d={fullArc}
            pathLength={100}
            fill="none"
            stroke="url(#gGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${100 - progress}`}
            animate={{ strokeDasharray: `${progress} ${100 - progress}` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          {/* Glowing indicator dot at end */}
          <motion.circle
            cx={dx}
            cy={dy}
            r="4.5"
            fill={dotColor}
            filter="url(#gGlow)"
            initial={false}
            animate={{ cx: dx, cy: dy }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </svg>

        {/* Center labels */}
        <div className="mt-3 text-center">
          <div className="text-3xl font-semibold tracking-tight">
            <span className={toneClass}>{v}</span>
            <span className="text-sm text-gray-500 ml-1">/100</span>
          </div>
          <div className={`text-sm mt-1 ${toneClass}`}>{status}</div>
        </div>
      </div>
    </div>
  )
}
