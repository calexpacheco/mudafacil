import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { SeletorCaminhao } from '@/components/canvas/SeletorCaminhao'
import { CAMINHOES } from '@/lib/caminhoes'
import { CATALOGO_ITENS } from '@/lib/catalogo-itens'
import type { CaminhaoInfo, ItemPositionado } from '@/types/mudafacil'

function makeItem(id: string, uid: string): ItemPositionado {
  const item = CATALOGO_ITENS.find((i) => i.id === id) ?? CATALOGO_ITENS[0]
  return { itemId: item.id, item, x: 0, y: 0, rotacao: 0, uid, quantidade: 1 }
}

function SeletorInterativo({ itens }: { itens: ItemPositionado[] }) {
  const [selecionado, setSelecionado] = useState<CaminhaoInfo>(CAMINHOES[1])
  return (
    <div className="p-6 bg-gray-50">
      <SeletorCaminhao
        selecionado={selecionado}
        onSelecionar={setSelecionado}
        itens={itens}
      />
      <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200 text-xs font-mono text-gray-500">
        Selecionado: <strong>{selecionado.nome}</strong> — {selecionado.capacidadeM3} m³ / {selecionado.capacidadeKg} kg
      </div>
    </div>
  )
}

const meta: Meta = {
  title: 'Components/SeletorCaminhao',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'mudafacil' },
  },
}

export default meta

// ─── Sem itens ────────────────────────────────────────────────────────────────

export const SemItens: StoryObj = {
  name: 'Sem itens no canvas',
  render: () => <SeletorInterativo itens={[]} />,
}

// ─── Com itens — baixa ocupação ───────────────────────────────────────────────

export const ComItensLeve: StoryObj = {
  name: 'Com itens — baixa ocupação',
  render: () => (
    <SeletorInterativo
      itens={[makeItem('cama-solteiro', 'a1'), makeItem('criado-mudo', 'a2')]}
    />
  ),
}

// ─── Com itens — alta ocupação ────────────────────────────────────────────────

export const ComItensHR: StoryObj = {
  name: 'HR — alta ocupação (~90%)',
  render: () => (
    <SeletorInterativo
      itens={[
        makeItem('cama-casal', 'b1'),
        makeItem('guarda-roupa-4', 'b2'),
        makeItem('sofa-3l', 'b3'),
        makeItem('mesa-sala', 'b4'),
      ]}
    />
  ),
}

// ─── Acima da capacidade ──────────────────────────────────────────────────────

export const AcimaDaCapacidade: StoryObj = {
  name: 'Fiorino — Acima da capacidade',
  render: () => {
    const [selecionado, setSelecionado] = useState<CaminhaoInfo>(CAMINHOES[0]) // Fiorino
    const itens = [
      makeItem('cama-casal', 'c1'),
      makeItem('sofa-3l', 'c2'),
      makeItem('guarda-roupa-4', 'c3'),
    ]
    return (
      <div className="p-6 bg-gray-50">
        <SeletorCaminhao
          selecionado={selecionado}
          onSelecionar={setSelecionado}
          itens={itens}
        />
      </div>
    )
  },
}
