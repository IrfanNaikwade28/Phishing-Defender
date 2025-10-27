import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

// items: Array<{ score:number, status:'Safe'|'Suspicious'|'Unsafe' }>
export default function RiskDistribution({ items = [] }) {
  const counts = items.reduce(
    (acc, it) => {
      if (it.status === 'Safe') acc.safe++
      else if (it.status === 'Suspicious') acc.suspicious++
      else acc.unsafe++
      return acc
    },
    { safe: 0, suspicious: 0, unsafe: 0 }
  )

  const data = [
    { name: 'Safe', value: counts.safe, fill: '#22c55e' },
    { name: 'Suspicious', value: counts.suspicious, fill: '#eab308' },
    { name: 'Unsafe', value: counts.unsafe, fill: '#ef4444' },
  ]

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="w-full">
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={2}
              cornerRadius={8}
              stroke="#111827"
              strokeOpacity={0.2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null
                const p = payload[0]
                return (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow text-sm">
                    <div className="font-medium" style={{ color: p.payload.fill }}>{p.name}</div>
                    <div className="mt-1 text-gray-600 dark:text-gray-300">{p.value} scans</div>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-xs text-gray-500">Last</div>
            <div className="text-2xl font-semibold">{total}</div>
            <div className="text-xs text-gray-500">scans</div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background:'#22c55e' }} /> Safe ({counts.safe})</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background:'#eab308' }} /> Suspicious ({counts.suspicious})</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background:'#ef4444' }} /> Unsafe ({counts.unsafe})</span>
      </div>
    </div>
  )
}
