import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { FiltrosCotacaoPainel } from '@/components/cotacoes/FiltrosCotacao'
import type { FiltrosCotacao } from '@/types/mudafacil'

// Wrapper interativo
function FiltrosInterativo({ filtrosAvancados }: { filtrosAvancados: boolean }) {
  const [filtros, setFiltros] = useState<FiltrosCotacao>({ ordenarPor: 'preco' })
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-xs">
        <FiltrosCotacaoPainel
          filtros={filtros}
          onChange={setFiltros}
          filtrosAvancados={filtrosAvancados}
        />
        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200 text-xs font-mono text-gray-500 break-all">
          {JSON.stringify(filtros, null, 2)}
        </div>
      </div>
    </div>
  )
}

const meta: Meta = {
  title: 'Components/FiltrosCotacao',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'mudafacil' },
  },
}

export default meta

// ─── Plano FREE — sem filtros avançados ──────────────────────────────────────

export const PlanFree: StoryObj = {
  name: 'Plano FREE — Filtros básicos',
  render: () => <FiltrosInterativo filtrosAvancados={false} />,
}

// ─── Trial / PRO — com filtros avançados ──────────────────────────────────────

export const PlanPro: StoryObj = {
  name: 'TRIAL / PRO — Filtros avançados',
  render: () => <FiltrosInterativo filtrosAvancados={true} />,
}
