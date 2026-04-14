export default function CatalogoLoading() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-6 animate-pulse">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <div className="h-7 w-44 bg-gray-200 rounded-lg" />
        <div className="h-4 w-64 bg-gray-100 rounded-lg" />
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-6">
        <div className="h-9 w-48 bg-gray-200 rounded-xl" />
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-100 rounded-full" />
          ))}
        </div>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-5 w-16 bg-gray-100 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-8 bg-gray-100 rounded-lg" />
              ))}
            </div>
            <div className="h-3 w-32 bg-gray-100 rounded" />
            <div className="h-8 bg-gray-200 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}
