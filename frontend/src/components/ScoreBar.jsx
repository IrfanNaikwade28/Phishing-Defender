export default function ScoreBar({ score }) {
  const color = score < 40 ? 'bg-green-500' : score < 70 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded">
      <div className={`h-3 ${color} rounded`} style={{ width: `${score}%` }} />
    </div>
  )
}
