import type { Meta, StoryObj } from '@storybook/nextjs'
import { ListaItensCanvas } from '@/components/canvas/ListaItensCanvas'
import { CATALOGO_ITENS } from '@/lib/catalogo-itens'
import type { ItemPositionado } from '@/types/mudafacil'

function makeItem(id: string, uid: string): ItemPositionado {
  const item = CATALOGO_ITENS.find((i) => i.id === id) ?? CATALOGO_ITENS[0]
  return { itemId: item.id, item, x: 0, y: 0, rotacao: 0, uid, quantidade: 1 }
}

const meta: Meta = {
  title: 'Components/ListaItensCanvas',
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'mudafacil' },
  },
}

export default meta

// ─── Vazio ────────────────────────────────────────────────────────────────────

export const Vazio: StoryObj = {
  name: 'Estado vazio — drop zone',
  render: () => (
    <div className="max-w-2xl">
      <ListaItensCanvas itens={[]} onRemoveItem={() => {}} onQuantidadeChange={() => {}} />
    </div>
  ),
}

// ─── 1 item ───────────────────────────────────────────────────────────────────

export const UmItem: StoryObj = {
  name: '1 item — grid 1 coluna',
  render: () => (
    <div className="max-w-2xl">
      <ListaItensCanvas
        itens={[makeItem('cama-casal', 'a1')]}
        onRemoveItem={() => {}}
        onQuantidadeChange={() => {}}
      />
    </div>
  ),
}

// ─── 2 itens ──────────────────────────────────────────────────────────────────

export const DoisItens: StoryObj = {
  name: '2 itens — linha completa',
  render: () => (
    <div className="max-w-2xl">
      <ListaItensCanvas
        itens={[
          makeItem('cama-casal', 'a1'),
          makeItem('guarda-roupa-4', 'a2'),
        ]}
        onRemoveItem={() => {}}
        onQuantidadeChange={() => {}}
      />
    </div>
  ),
}

// ─── Múltiplos itens ─────────────────────────────────────────────────────────

export const Multiplos: StoryObj = {
  name: 'Múltiplos itens — grid 2 colunas',
  render: () => (
    <div className="max-w-2xl">
      <ListaItensCanvas
        itens={[
          makeItem('cama-casal',     'b1'),
          makeItem('guarda-roupa-4', 'b2'),
          makeItem('sofa-3l',        'b3'),
          makeItem('mesa-sala',      'b4'),
          makeItem('geladeira',      'b5'),
          makeItem('computador',     'b6'),
        ]}
        onRemoveItem={() => {}}
        onQuantidadeChange={() => {}}
      />
    </div>
  ),
}

// ─── Todas as categorias ──────────────────────────────────────────────────────

export const TodasCategorias: StoryObj = {
  name: 'Todas as categorias — cores diferentes',
  render: () => (
    <div className="max-w-2xl">
      <ListaItensCanvas
        itens={[
          makeItem('cama-casal',        'c1'), // quarto — violet
          makeItem('sofa-3l',           'c2'), // sala — emerald
          makeItem('geladeira',         'c3'), // cozinha — orange
          makeItem('mesa-escritorio',   'c4'), // escritório — blue
          makeItem('caixa-g',           'c5'), // caixa — amber
        ]}
        onRemoveItem={() => {}}
        onQuantidadeChange={() => {}}
      />
    </div>
  ),
}

// ─── Limite atingido ──────────────────────────────────────────────────────────

export const LimiteAtingido: StoryObj = {
  name: 'Limite Free atingido — banner upgrade',
  render: () => (
    <div className="max-w-2xl">
      <ListaItensCanvas
        itens={[
          makeItem('cama-casal',     'd1'),
          makeItem('sofa-2l',        'd2'),
          makeItem('geladeira',      'd3'),
          makeItem('mesa-escritorio','d4'),
        ]}
        onRemoveItem={() => {}}
        limiteAtingido={true}
      />
    </div>
  ),
}

// ─── Lado a lado: Canvas + Cotações ──────────────────────────────────────────

export const ComparativoLargura: StoryObj = {
  name: 'Comparativo — mesma largura que cotações',
  render: () => {
    const itens = [
      makeItem('cama-casal',     'e1'),
      makeItem('guarda-roupa-4', 'e2'),
      makeItem('sofa-3l',        'e3'),
      makeItem('mesa-sala',      'e4'),
    ]
    return (
      <div className="p-6 bg-gray-50 space-y-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Canvas de Carga (ListaItensCanvas)
          </p>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <ListaItensCanvas itens={itens} onRemoveItem={() => {}} />
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Cotações (grade referência — mesma largura)
          </p>
          <div className="bg-white rounded-xl p-4 border border-dashed border-blue-300">
            <div className="grid grid-cols-2 gap-4">
              {itens.map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <span className="text-xs text-blue-400">Card Cotação {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
}
