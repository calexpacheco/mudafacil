import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { IconBed, IconToolsKitchen2, IconSofa, IconDeviceLaptop, IconPackage } from '@tabler/icons-react'

// CatalogoPainel usa @dnd-kit/core (useDraggable) — criamos versão visual estática

type CatIconKey = 'quarto' | 'cozinha' | 'sala' | 'escritorio' | 'caixa'

function CategoryIcon({ cat, size = 20, className = 'text-gray-600' }: { cat: string; size?: number; className?: string }) {
  const iconProps = { size, stroke: 1.5 as const, className }
  if (cat === 'quarto') return <IconBed {...iconProps} />
  if (cat === 'cozinha') return <IconToolsKitchen2 {...iconProps} />
  if (cat === 'sala') return <IconSofa {...iconProps} />
  if (cat === 'escritorio') return <IconDeviceLaptop {...iconProps} />
  return <IconPackage {...iconProps} />
}

const CATEGORIA_LABELS: Record<string, string> = {
  quarto: 'Quarto',
  cozinha: 'Cozinha',
  sala: 'Sala',
  escritorio: 'Escritório',
  caixa: 'Caixas',
}

const CATEGORIAS = ['quarto', 'cozinha', 'sala', 'escritorio', 'caixa']

interface ItemMock {
  id: string
  nome: string
  categoria: string
  volumeM3: number
}

const ITENS_MOCK: ItemMock[] = [
  { id: '1', nome: 'Cama de Casal', categoria: 'quarto', volumeM3: 1.2 },
  { id: '2', nome: 'Guarda-roupa 4 Portas', categoria: 'quarto', volumeM3: 1.8 },
  { id: '3', nome: 'Criado-mudo', categoria: 'quarto', volumeM3: 0.15 },
  { id: '4', nome: 'Cômoda 6 Gavetas', categoria: 'quarto', volumeM3: 0.45 },
  { id: '5', nome: 'Colchão Casal', categoria: 'quarto', volumeM3: 0.6 },
  { id: '6', nome: 'Sofá 3 Lugares', categoria: 'sala', volumeM3: 1.0 },
  { id: '7', nome: 'Mesa de Centro', categoria: 'sala', volumeM3: 0.2 },
  { id: '8', nome: 'Rack / Painel TV', categoria: 'sala', volumeM3: 0.35 },
  { id: '9', nome: 'Estante', categoria: 'sala', volumeM3: 0.5 },
  { id: '10', nome: 'Geladeira Frost Free', categoria: 'cozinha', volumeM3: 0.7 },
  { id: '11', nome: 'Fogão 4 Bocas', categoria: 'cozinha', volumeM3: 0.3 },
  { id: '12', nome: 'Micro-ondas', categoria: 'cozinha', volumeM3: 0.05 },
  { id: '13', nome: 'Mesa 4 Lugares', categoria: 'cozinha', volumeM3: 0.6 },
  { id: '14', nome: 'Cadeiras (x4)', categoria: 'cozinha', volumeM3: 0.32 },
  { id: '15', nome: 'Mesa Escritório', categoria: 'escritorio', volumeM3: 0.5 },
  { id: '16', nome: 'Cadeira de Escritório', categoria: 'escritorio', volumeM3: 0.25 },
  { id: '17', nome: 'Computador Desktop', categoria: 'escritorio', volumeM3: 0.08 },
  { id: '18', nome: 'Estante de Livros', categoria: 'escritorio', volumeM3: 0.45 },
  { id: '19', nome: 'Caixa P (30x30x30)', categoria: 'caixa', volumeM3: 0.027 },
  { id: '20', nome: 'Caixa M (40x40x40)', categoria: 'caixa', volumeM3: 0.064 },
  { id: '21', nome: 'Caixa G (50x50x50)', categoria: 'caixa', volumeM3: 0.125 },
]

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

function ItemCard({ item }: { item: ItemMock }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-200 bg-white cursor-grab',
        'hover:border-blue-400 hover:shadow-sm transition-all text-center select-none'
      )}
      title={`${item.nome} — ${item.volumeM3.toFixed(3)} m³`}
    >
      <CategoryIcon cat={item.categoria} size={20} />
      <span className="text-[10px] font-medium text-gray-700 leading-tight line-clamp-2">{item.nome}</span>
      <span className="text-[9px] text-gray-400">{item.volumeM3.toFixed(2)}m³</span>
    </div>
  )
}

function CatalogoPainelVisual({ buscaInicial = '', categoriaInicial = 'todos' }: { buscaInicial?: string; categoriaInicial?: string }) {
  const [busca, setBusca] = useState(buscaInicial)
  const [categoria, setCategoria] = useState(categoriaInicial)

  const itensFiltrados = ITENS_MOCK.filter((item) => {
    const matchCat = categoria === 'todos' || item.categoria === categoria
    const matchBusca = !busca || item.nome.toLowerCase().includes(busca.toLowerCase())
    return matchCat && matchBusca
  })

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Busca */}
      <input
        type="search"
        placeholder="Buscar item..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Filtro por categoria */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setCategoria('todos')}
          className={cn(
            'text-xs px-2.5 py-1 rounded-full font-medium transition-colors',
            categoria === 'todos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Todos
        </button>
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoria(cat)}
            className={cn(
              'text-xs px-2.5 py-1 rounded-full font-medium transition-colors flex items-center gap-1',
              categoria === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <CategoryIcon cat={cat} size={12} />
            {CATEGORIA_LABELS[cat]}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        {itensFiltrados.length} itens · arraste para a lista
      </p>

      {/* Grid de itens */}
      <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[500px] pr-1">
        {itensFiltrados.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Components/CatalogoPainel',
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'light' },
  },
}

export default meta

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: StoryObj = {
  name: 'Padrão — todos os itens',
  render: () => (
    <div className="w-72 bg-white p-4 rounded-xl border border-gray-200 h-[600px]">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Catálogo de itens</p>
      <CatalogoPainelVisual />
    </div>
  ),
}

// ─── Filtrando por categoria ───────────────────────────────────────────────────

export const FiltroCozinha: StoryObj = {
  name: 'Filtro por categoria — Cozinha',
  render: () => (
    <div className="w-72 bg-white p-4 rounded-xl border border-gray-200 h-[600px]">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Catálogo de itens</p>
      <CatalogoPainelVisual categoriaInicial="cozinha" />
    </div>
  ),
}

// ─── Com busca ────────────────────────────────────────────────────────────────

export const ComBusca: StoryObj = {
  name: 'Com busca ativa — "sofá"',
  render: () => (
    <div className="w-72 bg-white p-4 rounded-xl border border-gray-200 h-[600px]">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Catálogo de itens</p>
      <CatalogoPainelVisual buscaInicial="sofá" />
    </div>
  ),
}

// ─── Sem resultados ───────────────────────────────────────────────────────────

export const SemResultados: StoryObj = {
  name: 'Busca sem resultados',
  render: () => (
    <div className="w-72 bg-white p-4 rounded-xl border border-gray-200 h-[600px]">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Catálogo de itens</p>
      <CatalogoPainelVisual buscaInicial="xyzabc" />
    </div>
  ),
}

// ─── No contexto do Canvas Editor ─────────────────────────────────────────────

export const NoCanvasEditor: StoryObj = {
  name: 'No contexto — Canvas Editor (aside)',
  render: () => (
    <div className="flex h-[600px] border border-gray-200 rounded-xl overflow-hidden">
      {/* Aside — catalogo */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white p-3 flex flex-col">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Catálogo</p>
        <CatalogoPainelVisual />
      </aside>

      {/* Canvas simulado */}
      <main className="flex-1 bg-gray-50 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-white">
          <p className="text-sm font-semibold text-gray-700">Lista de itens</p>
          <p className="text-xs text-gray-400 mt-0.5">Arraste itens do catálogo para cá</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-3"><IconPackage size={48} stroke={1.5} className="text-gray-300" /></div>
            <p className="text-sm text-gray-400">Arraste itens do catálogo</p>
            <p className="text-xs text-gray-300 mt-1">para começar a montar sua mudança</p>
          </div>
        </div>
      </main>
    </div>
  ),
}
