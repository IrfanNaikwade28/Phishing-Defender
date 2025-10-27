import Gauge from './Gauge'

// Expects items like [{ score, status, name }]
export default function RecentRiskGauge({ items = [] }) {
  const latest = items[0]
  const value = latest?.score ?? 0
  const when = latest?.name
  return (
    <div>
      <Gauge value={value} />
      {when && (
        <p className="mt-2 text-xs text-gray-500 text-center">Latest: {when}</p>
      )}
    </div>
  )
}
