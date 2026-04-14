import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { CATALOGO_ITENS, CATEGORIAS, CATEGORIA_LABELS } from '@/lib/catalogo-itens'
import { cn } from '@/design-system/utils'
import type { ItemCatalogo } from '@/types/mudafacil'
import { IconSearch, IconCheck, IconPlus } from '@tabler/icons-react'

// ─── Versão visual do card de item ───────────────────────────────────────────

const CATEGORIA_COR: Record<string, { bg: string; text: string; badge: string }> = {
  quarto:     { bg: 'bg-violet-500', text: 'text-white', badge: 'bg-violet-50 text-violet-700 border-violet-200' },
  cozinha:    { bg: 'bg-orange-500', text: 'text-white', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  sala:       { bg: 'bg-emerald-500', text: 'text-white', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  escritorio: { bg: 'bg-blue-500',   text: 'text-white', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  caixa:      { bg: 'bg-amber-400',  text: 'text-white', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
}

function ItemCard({ item, adicionado = false }: { item: ItemCatalogo; adicionado?: boolean }) {
  const [estado, setEstado] = useState<'idle' | 'loading' | 'done'>(adicionado ? 'done' : 'idle')
  const cor = CATEGORIA_COR[item.categoria] ?? { bg: 'bg-gray-400', text: 'text-white', badge: 'bg-gray-50 text-gray-600 border-gray-200' }
  const catLabel = CATEGORIA_LABELS[item.categoria] ?? item.categoria
  const inicial = item.nome.charAt(0).toUpperCase()

  function handleClick() {
    if (estado !== 'idle') return
    setEstado('loading')
    setTimeout(() => setEstado('done'), 900)
  }

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all hover:border-gray-300">
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

      <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-600">
        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1.5">
          <span className="text-gray-400">↔</span><span>{item.larguraCm} cm</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1.5">
          <span className="text-gray-400">↕</span><span>{item.alturaCm} cm</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1.5">
          <span className="text-gray-400">⟂</span><span>{item.profundidadeCm} cm</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1.5">
          <span className="text-gray-400">⚖</span><span>{item.pesoKg} kg</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <span className="text-gray-400">▫</span>
        <span>Volume: <span className="font-semibold text-gray-700">{item.volumeM3.toFixed(3)} m³</span></span>
      </div>

      <button
        onClick={handleClick}
        disabled={estado === 'loading' || estado === 'done'}
        className={cn(
          'w-full py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer',
          estado === 'done'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : estado === 'loading'
              ? 'bg-blue-400 text-white opacity-70 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
        )}
      >
        {estado === 'done' ? <span className="flex items-center justify-center gap-1"><IconCheck size={14} stroke={2} /> Adicionado!</span> : estado === 'loading' ? 'Adicionando...' : <span className="flex items-center justify-center gap-1"><IconPlus size={14} stroke={2} /> Adicionar à mudança</span>}
      </button>
    </div>
  )
}

// ─── Grid com filtros ─────────────────────────────────────────────────────────

function CatalogoInterativo({ categoriaInicial }: { categoriaInicial?: string }) {
  const [busca, setBusca] = useState('')
  const [cat, setCat] = useState<string | null>(categoriaInicial ?? null)

  const filtrados = CATALOGO_ITENS.filter((item) => {
    const matchBusca = !busca || item.nome.toLowerCase().includes(busca.toLowerCase())
    const matchCat = !cat || item.categoria === cat
    return matchBusca && matchCat
  })

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-screen-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Catálogo de Itens</h1>
          <p className="text-gray-500 text-sm mt-1">Explore os itens disponíveis e adicione à sua mudança</p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IconSearch size={16} stroke={1.5} /></span>
            <input
              type="search"
              placeholder="Buscar item..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCat(null)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full font-medium transition-colors border',
                cat === null ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}
            >
              Todos
            </button>
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c === cat ? null : c)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full font-medium transition-colors border',
                  cat === c ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                )}
              >
                {CATEGORIA_LABELS[c]}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          {filtrados.length} iten{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
        </p>

        {filtrados.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-3"><IconSearch size={48} stroke={1.5} className="text-gray-400" /></div>
            <p className="text-gray-500 text-sm">Nenhum item encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtrados.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Components/CatalogoItens',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'mudafacil' },
  },
}

export default meta

// ─── Card individual ──────────────────────────────────────────────────────────

export const CardIndividual: StoryObj = {
  name: 'Card — Cama Casal (Quarto)',
  render: () => (
    <div className="p-6 max-w-xs">
      <ItemCard item={CATALOGO_ITENS.find((i) => i.id === 'cama-casal')!} />
    </div>
  ),
}

export const CardAdicionado: StoryObj = {
  name: 'Card — Já adicionado',
  render: () => (
    <div className="p-6 max-w-xs">
      <ItemCard item={CATALOGO_ITENS.find((i) => i.id === 'sofa-3l')!} adicionado />
    </div>
  ),
}

// ─── Grid por categoria ───────────────────────────────────────────────────────

export const TodosItens: StoryObj = {
  name: 'Página completa — todos os itens',
  render: () => <CatalogoInterativo />,
}

export const FiltradoQuarto: StoryObj = {
  name: 'Filtrado — Quarto',
  render: () => <CatalogoInterativo categoriaInicial="quarto" />,
}

export const FiltradoCozinha: StoryObj = {
  name: 'Filtrado — Cozinha',
  render: () => <CatalogoInterativo categoriaInicial="cozinha" />,
}

export const FiltradoCaixas: StoryObj = {
  name: 'Filtrado — Caixas',
  render: () => <CatalogoInterativo categoriaInicial="caixa" />,
}
