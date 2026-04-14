export default function MudancaLoading() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
      {/* Endereço */}
      <div className="mb-4 space-y-2">
        <div className="h-5 w-80 bg-gray-200 rounded-lg" />
        <div className="h-4 w-40 bg-gray-100 rounded-lg" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <div className="h-9 w-32 bg-gray-200 rounded-xl" />
        <div className="h-9 w-28 bg-gray-100 rounded-xl" />
      </div>

      {/* Conteúdo principal */}
      <div className="flex gap-6 items-start w-full">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 space-y-3">
          <div className="h-10 bg-gray-200 rounded-xl" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl" />
          ))}
        </div>
        {/* Main area */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="h-10 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
