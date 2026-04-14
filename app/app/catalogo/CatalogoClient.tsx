'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { CATALOGO_ITENS, CATEGORIAS, CATEGORIA_LABELS } from '@/lib/catalogo-itens'
import { cn } from '@/design-system/utils'
import type { ItemCatalogo } from '@/types/mudafacil'
import { IconPackage, IconSearch, IconX, IconRuler } from '@tabler/icons-react'

interface MudancaSimples {
  id: string
  enderecoOrigem: string
  enderecoDestino: string
}

interface CatalogoClientProps {
  mudancas: MudancaSimples[]
}

const CATEGORIA_COR: Record<string, { bg: string; text: string; badge: string }> = {
  quarto:     { bg: 'bg-violet-500', text: 'text-white', badge: 'bg-violet-50 text-violet-700 border-violet-200' },
  cozinha:    { bg: 'bg-orange-500', text: 'text-white', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  sala:       { bg: 'bg-emerald-500', text: 'text-white', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  escritorio: { bg: 'bg-blue-500',   text: 'text-white', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  caixa:      { bg: 'bg-amber-400',  text: 'text-white', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
}

function fmtVol(v: number) {
  return v.toFixed(3) + ' m³'
}

// ─── Picker de mudança ────────────────────────────────────────────────────────

interface MudancaPickerProps {
  mudancas: MudancaSimples[]
  onSelect: (id: string) => void
  onClose: () => void
}

function MudancaPicker({ mudancas, onSelect, onClose }: MudancaPickerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Adicionar a qual mudança?</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <IconX size={16} stroke={2} />
          </button>
        </div>
        <div className="p-3 flex flex-col gap-2">
          {mudancas.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className="flex items-start gap-3 w-full px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <IconPackage size={20} stroke={1.5} className="text-gray-700 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{m.enderecoOrigem}</p>
                <p className="text-xs text-gray-400 truncate">→ {m.enderecoDestino}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Card de item ─────────────────────────────────────────────────────────────

function ItemCard({
  item,
  onAdicionar,
  loading,
}: {
  item: ItemCatalogo
  onAdicionar: (item: ItemCatalogo) => void
  loading: boolean
}) {
  const cor = CATEGORIA_COR[item.categoria] ?? { bg: 'bg-gray-400', text: 'text-white', badge: 'bg-gray-50 text-gray-600 border-gray-200' }
  const catLabel = CATEGORIA_LABELS[item.categoria] ?? item.categoria
  const inicial = item.nome.charAt(0).toUpperCase()

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all hover:border-gray-300">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0', cor.bg, cor.text)}>
          {inicial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-snug">{item.nome}</p>
          <span className={cn('inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full border', cor.badge)}>
            {catLabel}
          </span>
        </div>
      </div>

      {/* Dimensões */}
      <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-600">
        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1.5">
          <IconRuler size={12} stroke={1.5} className="text-gray-400" />
          <span>{item.larguraCm} cm</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1.5">
          <IconRuler size={12} stroke={1.5} className="text-gray-400" />
          <span>{item.alturaCm} cm</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1.5">
          <IconRuler size={12} stroke={1.5} className="text-gray-400" />
          <span>{item.profundidadeCm} cm</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1.5">
          <IconRuler size={12} stroke={1.5} className="text-gray-400" />
          <span>{item.pesoKg} kg</span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <IconRuler size={14} stroke={1.5} className="text-gray-400" />
        <span>Volume: <span className="font-semibold text-gray-700">{fmtVol(item.volumeM3)}</span></span>
      </div>

      {/* CTA */}
      <button
        onClick={() => onAdicionar(item)}
        disabled={loading}
        className="w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer"
      >
        {loading ? 'Adicionando...' : '+ Adicionar à mudança'}
      </button>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function CatalogoClient({ mudancas }: CatalogoClientProps) {
  const [busca, setBusca] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(null)
  const [loadingItem, setLoadingItem] = useState<string | null>(null)
  const [pickerItem, setPickerItem] = useState<ItemCatalogo | null>(null)

  // Filtra itens
  const itensFiltrados = CATALOGO_ITENS.filter((item) => {
    const matchBusca = !busca || item.nome.toLowerCase().includes(busca.toLowerCase())
    const matchCategoria = !categoriaFiltro || item.categoria === categoriaFiltro
    return matchBusca && matchCategoria
  })

  async function addToMudanca(itemId: string, mudancaId: string) {
    setLoadingItem(itemId)
    try {
      const res = await fetch(`/api/mudancas/${mudancaId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })
      if (!res.ok) throw new Error('Falha ao adicionar')
      toast.success('Item adicionado!', {
        description: 'Abra a mudança para visualizar no canvas.',
        action: {
          label: 'Ver mudança',
          onClick: () => { window.location.href = `/app/mudanca/${mudancaId}` },
        },
      })
    } catch {
      toast.error('Erro ao adicionar item. Tente novamente.')
    } finally {
      setLoadingItem(null)
      setPickerItem(null)
    }
  }

  function handleAdicionar(item: ItemCatalogo) {
    if (mudancas.length === 0) {
      toast.error('Nenhuma mudança encontrada.', {
        description: 'Crie uma mudança primeiro.',
        action: {
          label: 'Criar mudança',
          onClick: () => { window.location.href = '/app/nova-mudanca' },
        },
      })
      return
    }
    if (mudancas.length === 1) {
      addToMudanca(item.id, mudancas[0].id)
      return
    }
    // Multiple: show picker
    setPickerItem(item)
  }

  return (
    <>
      {/* ─── Picker modal ──────────────────────────────────────────────── */}
      {pickerItem && (
        <MudancaPicker
          mudancas={mudancas}
          onSelect={(mudancaId) => addToMudanca(pickerItem.id, mudancaId)}
          onClose={() => setPickerItem(null)}
        />
      )}

      {/* ─── Filtros ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Busca */}
        <div className="relative flex-1 max-w-sm">
          <IconSearch size={16} stroke={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Buscar item..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          />
        </div>

        {/* Categoria pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoriaFiltro(null)}
            className={cn(
              'text-xs px-3 py-1.5 rounded-full font-medium transition-colors border',
              categoriaFiltro === null
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            )}
          >
            Todos
          </button>
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaFiltro(cat === categoriaFiltro ? null : cat)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full font-medium transition-colors border',
                categoriaFiltro === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}
            >
              {CATEGORIA_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Contador ──────────────────────────────────────────────────── */}
      <p className="text-xs text-gray-500 mb-4">
        {itensFiltrados.length} iten{itensFiltrados.length !== 1 ? 's' : ''} encontrado{itensFiltrados.length !== 1 ? 's' : ''}
      </p>

      {/* ─── Grid ──────────────────────────────────────────────────────── */}
      {itensFiltrados.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex justify-center mb-3">
            <IconSearch size={48} stroke={1} className="text-gray-300" />
          </div>
          <p className="text-gray-500 text-sm">Nenhum item encontrado para &quot;{busca}&quot;</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {itensFiltrados.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onAdicionar={handleAdicionar}
              loading={loadingItem === item.id}
            />
          ))}
        </div>
      )}
    </>
  )
}
