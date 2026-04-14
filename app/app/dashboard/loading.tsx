export default function DashboardLoading() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 mt-2">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-gray-200 rounded-lg" />
          <div className="h-4 w-36 bg-gray-100 rounded-lg" />
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            {/* Map area */}
            <div className="h-36 bg-gray-100" />
            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-5 w-20 bg-gray-100 rounded-full" />
              </div>
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-3/4 bg-gray-100 rounded" />
              <div className="flex gap-2 pt-1">
                <div className="h-8 flex-1 bg-gray-100 rounded-lg" />
                <div className="h-8 w-8 bg-gray-100 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
