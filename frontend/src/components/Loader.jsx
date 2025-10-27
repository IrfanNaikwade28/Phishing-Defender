export default function Loader() {
  return (
    <div className="flex items-center justify-center py-10">
      <span className="relative inline-flex">
        <span className="h-8 w-8 rounded-full border-4 border-indigo-600/80 border-t-transparent animate-spin" />
        <span className="absolute inset-0 rounded-full animate-ping bg-indigo-500/10" />
      </span>
    </div>
  )
}
