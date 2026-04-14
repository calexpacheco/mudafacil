'use client'

import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { useTranslations } from 'next-intl'
import { CATALOGO_ITENS, CATEGORIAS, CATEGORIA_LABELS } from '@/lib/catalogo-itens'
import type { ItemCatalogo } from '@/types/mudafacil'
import { cn } from '@/design-system/utils'
import { IconBed, IconToolsKitchen2, IconSofa, IconDeviceLaptop, IconPackage, IconPlus } from '@tabler/icons-react'

function CategoryIcon({ categoria, className }: { categoria: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    quarto:     <IconBed size={18} stroke={1.5} className={className} />,
    cozinha:    <IconToolsKitchen2 size={18} stroke={1.5} className={className} />,
    sala:       <IconSofa size={18} stroke={1.5} className={className} />,
    escritorio: <IconDeviceLaptop size={18} stroke={1.5} className={className} />,
    caixa:      <IconPackage size={18} stroke={1.5} className={className} />,
  }
  return <>{icons[categoria] ?? <IconPackage size={18} stroke={1.5} className={className} />}</>
}

function ItemCatalogoCard({
  item,
  onAdd,
}: {
  item: ItemCatalogo
  onAdd?: (item: ItemCatalogo) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `catalog-${item.id}`,
    data: { type: 'catalog-item', item },
  })

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    if (!onAdd) return
    onAdd(item)
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        'relative flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-200 bg-white',
        'hover:border-[#FA9370] hover:shadow-sm transition-all text-center select-none',
        'cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-30 scale-95'
      )}
      title={`${item.nome} — ${item.volumeM3.toFixed(3)} m³ · ${item.pesoKg}kg`}
    >
      <CategoryIcon categoria={item.categoria} className="text-gray-700" />
      <span className="text-[10px] font-medium text-gray-700 leading-tight line-clamp-2">{item.nome}</span>
      <span className="text-[9px] text-gray-400">{item.volumeM3.toFixed(2)}m³</span>

      {/* Botão + — canto inferior direito dentro do card */}
      {onAdd && (
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleAdd}
          className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-gray-700 hover:bg-gray-900 active:scale-90 flex items-center justify-center cursor-pointer transition-all"
          aria-label={`Adicionar ${item.nome}`}
        >
          <IconPlus size={9} stroke={2.5} className="text-white" />
        </button>
      )}
    </div>
  )
}

interface CatalogoPainelProps {
  busca?: string
  onAdd?: (item: ItemCatalogo) => void
}

export function CatalogoPainel({ busca = '', onAdd }: CatalogoPainelProps) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('todos')
  const [buscaLocal, setBuscaLocal] = useState(busca)
  const t = useTranslations('catalog')
  const tCat = useTranslations('app.categories')

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
        placeholder={t('searchPlaceholder')}
        value={buscaLocal}
        onChange={(e) => setBuscaLocal(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E83500] focus:border-[#E83500]"
      />

      {/* Filtro por categoria */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setCategoriaSelecionada('todos')}
          className={cn(
            'text-xs px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer',
            categoriaSelecionada === 'todos'
              ? 'bg-[#E83500] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          {t('all')}
        </button>
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaSelecionada(cat)}
            className={cn(
              'text-xs px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer',
              categoriaSelecionada === cat
                ? 'bg-[#E83500] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {tCat(cat as Parameters<typeof tCat>[0])}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        {itensFiltrados.length} {onAdd ? t('tapToAdd') : t('dragToAdd')}
      </p>

      {/* Grid de itens */}
      <div className="grid gap-2 overflow-y-auto max-h-[500px] pr-1 pt-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}>
        {itensFiltrados.map((item) => (
          <ItemCatalogoCard key={item.id} item={item} onAdd={onAdd} />
        ))}
      </div>
    </div>
  )
}
