import type { Meta, StoryObj } from '@storybook/nextjs'
import { ResumoCanvasPanel } from '@/components/canvas/ResumoCanvas'
import { CAMINHOES } from '@/lib/caminhoes'
import { CATALOGO_ITENS } from '@/lib/catalogo-itens'
import type { ItemPositionado } from '@/types/mudafacil'

function makeItem(id: string, uid: string): ItemPositionado {
  const item = CATALOGO_ITENS.find((i) => i.id === id) ?? CATALOGO_ITENS[0]
  return { itemId: item.id, item, x: 0, y: 0, rotacao: 0, uid }
}

const meta: Meta = {
  title: 'Components/ResumoCanvas',
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'mudafacil' },
  },
}

export default meta

// ─── Vazio ────────────────────────────────────────────────────────────────────

export const Vazio: StoryObj = {
  name: 'Canvas vazio',
  render: () => (
    <div className="max-w-xs">
      <ResumoCanvasPanel caminhao={CAMINHOES[1]} itens={[]} />
    </div>
  ),
}

// ─── Ocupação baixa ───────────────────────────────────────────────────────────

export const OcupacaoBaixa: StoryObj = {
  name: 'Ocupação baixa — subutilizado',
  render: () => (
    <div className="max-w-xs">
      <ResumoCanvasPanel
        caminhao={CAMINHOES[2]} // 3/4 Truck — 18m³
        itens={[makeItem('cama-solteiro', 'a1'), makeItem('criado-mudo', 'a2')]}
      />
    </div>
  ),
}

// ─── Ocupação normal ──────────────────────────────────────────────────────────

export const OcupacaoNormal: StoryObj = {
  name: 'Ocupação normal — ~60%',
  render: () => (
    <div className="max-w-xs">
      <ResumoCanvasPanel
        caminhao={CAMINHOES[1]} // HR — 7.5m³
        itens={[
          makeItem('cama-casal', 'b1'),
          makeItem('guarda-roupa-2', 'b2'),
          makeItem('sofa-2l', 'b3'),
        ]}
      />
    </div>
  ),
}

// ─── Ocupação alta ────────────────────────────────────────────────────────────

export const OcupacaoAlta: StoryObj = {
  name: 'Ocupação alta — >90%',
  render: () => (
    <div className="max-w-xs">
      <ResumoCanvasPanel
        caminhao={CAMINHOES[1]} // HR — 7.5m³
        itens={[
          makeItem('cama-casal', 'c1'),
          makeItem('guarda-roupa-4', 'c2'),
          makeItem('sofa-3l', 'c3'),
          makeItem('mesa-sala', 'c4'),
        ]}
      />
    </div>
  ),
}

// ─── Acima da capacidade ──────────────────────────────────────────────────────

export const AcimaDaCapacidade: StoryObj = {
  name: 'Acima da capacidade — alerta vermelho',
  render: () => (
    <div className="max-w-xs">
      <ResumoCanvasPanel
        caminhao={CAMINHOES[0]} // Fiorino — 2.5m³
        itens={[
          makeItem('cama-casal', 'd1'),
          makeItem('sofa-3l', 'd2'),
          makeItem('guarda-roupa-4', 'd3'),
          makeItem('sofa-canto', 'd4'),
        ]}
      />
    </div>
  ),
}

// ─── Todos os caminhões ───────────────────────────────────────────────────────

export const TodosCaminhoes: StoryObj = {
  name: 'Todos os caminhões',
  render: () => {
    const itens = [
      makeItem('cama-casal', 'e1'),
      makeItem('guarda-roupa-2', 'e2'),
      makeItem('sofa-2l', 'e3'),
    ]
    return (
      <div className="p-6 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Mesmo conjunto de itens em cada caminhão
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {CAMINHOES.map((c) => (
            <div key={c.id}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {c.nome}
              </p>
              <ResumoCanvasPanel caminhao={c} itens={itens} />
            </div>
          ))}
        </div>
      </div>
    )
  },
}
