'use client'

import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CATALOGO_ITENS, CATEGORIAS, CATEGORIA_LABELS } from '@/lib/catalogo-itens'
import type { ItemCatalogo } from '@/types/mudafacil'
import { cn } from '@/design-system/utils'

function ItemCatalogoCard({ item }: { item: ItemCatalogo }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `catalog-${item.id}`,
    data: { type: 'catalog-item', item },
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        'flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-200 bg-white cursor-grab',
        'hover:border-blue-400 hover:shadow-sm transition-all text-center select-none',
        isDragging && 'opacity-30 scale-95'
      )}
      title={`${item.nome} — ${item.volumeM3.toFixed(3)} m³ · ${item.pesoKg}kg`}
    >
      <span className="text-xl">{getEmoji(item.categoria)}</span>
      <span className="text-[10px] font-medium text-gray-700 leading-tight line-clamp-2">{item.nome}</span>
      <span className="text-[9px] text-gray-400">{item.volumeM3.toFixed(2)}m³</span>
    </div>
  )
}

function getEmoji(cat: string) {
  const map: Record<string, string> = {
    quarto: '🛏️', cozinha: '🍳', sala: '🛋️', escritorio: '💻', caixa: '📦',
  }
  return map[cat] ?? '📦'
}

interface CatalogoPainelProps {
  busca?: string
}

export function CatalogoPainel({ busca = '' }: CatalogoPainelProps) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('todos')
  const [buscaLocal, setBuscaLocal] = useState(busca)

  const itensFiltrados = CATALOGO_ITENS.filter((item) => {
    const matchCategoria = categoriaSelecionada === 'todos' || item.categoria === categoriaSelecionada
    const matchBusca = !buscaLocal || item.nome.toLowerCase().includes(buscaLocal.toLowerCase())
    return matchCategoria && matchBusca
  })

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Busca */}
      <input
        type="search"
        placeholder="Buscar item..."
        value={buscaLocal}
        onChange={(e) => setBuscaLocal(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Filtro por categoria */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setCategoriaSelecionada('todos')}
          className={cn(
            'text-xs px-2.5 py-1 rounded-full font-medium transition-colors',
            categoriaSelecionada === 'todos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Todos
        </button>
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaSelecionada(cat)}
            className={cn(
              'text-xs px-2.5 py-1 rounded-full font-medium transition-colors',
              categoriaSelecionada === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {CATEGORIA_LABELS[cat]}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        {itensFiltrados.length} itens · arraste para o canvas
      </p>

      {/* Grid de itens */}
      <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[500px] pr-1">
        {itensFiltrados.map((item) => (
          <ItemCatalogoCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
