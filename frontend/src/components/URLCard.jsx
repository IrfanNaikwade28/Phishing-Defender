export default function URLCard({ result }) {
  if (!result) return null

  const color = result.status === 'Safe' ? 'green' : result.status === 'Suspicious' ? 'yellow' : 'red'

  return (
    <div className="card mt-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">URL</p>
          <p className="font-medium break-all">{result.url}</p>
        </div>
        <div className={`text-${color}-600 font-semibold`}>{result.status}</div>
      </div>
      <div className="mt-3">
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded">
          <div className={`h-3 rounded bg-${color}-500`} style={{ width: `${result.risk_score}%` }} />
        </div>
        <p className="mt-1 text-sm">Risk Score: {result.risk_score}/100</p>
      </div>
      {result.reasons?.length > 0 && (
        <ul className="mt-3 list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
          {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      )}
    </div>
  )
}
