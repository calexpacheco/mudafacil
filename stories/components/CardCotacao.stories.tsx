import type { Meta, StoryObj } from '@storybook/nextjs'
import { CardCotacao } from '@/components/cotacoes/CardCotacao'
import { CAMINHOES } from '@/lib/caminhoes'
import type { CotacaoCard } from '@/types/mudafacil'

const mockBase: CotacaoCard = {
  id: '1',
  transportadora: {
    id: 't1',
    nome: 'MudaBR Express',
    notaMedia: 4.8,
    totalAvaliacoes: 312,
    cidade: 'São Paulo',
    logoUrl: undefined,
    tiposCaminhao: ['HR', 'TRES_QUARTOS'],
  },
  caminhao: CAMINHOES[1], // HR
  precoCentavos: 89000,
  dataDisponivel: new Date(Date.now() + 2 * 86400000).toISOString(),
  seguroIncluso: true,
  validade: new Date(Date.now() + 7 * 86400000).toISOString(),
}

const meta: Meta<typeof CardCotacao> = {
  title: 'Components/CardCotacao',
  component: CardCotacao,
  args: {
    cotacao: mockBase,
    onContratar: (c) => alert(`Contratando ${c.transportadora.nome}...`),
  },
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'mudafacil' },
  },
}

export default meta
type Story = StoryObj<typeof CardCotacao>

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Padrão — Com seguro',
}

// ─── Sem seguro ───────────────────────────────────────────────────────────────

export const SemSeguro: Story = {
  name: 'Sem seguro',
  args: {
    cotacao: {
      ...mockBase,
      id: '2',
      transportadora: {
        ...mockBase.transportadora,
        nome: 'Rápido Mudanças',
        notaMedia: 4.2,
        totalAvaliacoes: 87,
      },
      precoCentavos: 74000,
      seguroIncluso: false,
      dataDisponivel: new Date(Date.now() + 5 * 86400000).toISOString(),
    },
  },
}

// ─── Nota baixa ──────────────────────────────────────────────────────────────

export const BaixaNota: Story = {
  name: 'Nota baixa',
  args: {
    cotacao: {
      ...mockBase,
      id: '3',
      transportadora: {
        ...mockBase.transportadora,
        nome: 'Transportes Genéricos Ltda',
        notaMedia: 2.3,
        totalAvaliacoes: 14,
      },
      precoCentavos: 52000,
      seguroIncluso: false,
    },
  },
}

// ─── Caminhão Baú ─────────────────────────────────────────────────────────────

export const ComBau: Story = {
  name: 'Baú — Apartamento inteiro',
  args: {
    cotacao: {
      ...mockBase,
      id: '4',
      transportadora: {
        ...mockBase.transportadora,
        nome: 'Mudança Segura',
        notaMedia: 4.6,
        totalAvaliacoes: 204,
      },
      caminhao: CAMINHOES[3], // Baú
      precoCentavos: 135000,
      dataDisponivel: new Date(Date.now() + 1 * 86400000).toISOString(),
      validade: new Date(Date.now() + 5 * 86400000).toISOString(),
    },
  },
}

// ─── Fiorino ─────────────────────────────────────────────────────────────────

export const ComFiorino: Story = {
  name: 'Fiorino — Mudança pequena',
  args: {
    cotacao: {
      ...mockBase,
      id: '5',
      transportadora: {
        ...mockBase.transportadora,
        nome: 'Frete Rápido SP',
        notaMedia: 4.4,
        totalAvaliacoes: 56,
        tiposCaminhao: ['FIORINO'],
      },
      caminhao: CAMINHOES[0], // Fiorino
      precoCentavos: 34000,
      seguroIncluso: false,
    },
  },
}

// ─── Grid de cotações ─────────────────────────────────────────────────────────

export const Grid: StoryObj = {
  name: 'Grid — Lista de cotações',
  render: () => {
    const cotacoes: CotacaoCard[] = [
      mockBase,
      {
        ...mockBase,
        id: '2',
        transportadora: { ...mockBase.transportadora, nome: 'Rápido Mudanças', notaMedia: 4.2, totalAvaliacoes: 87 },
        precoCentavos: 74000,
        seguroIncluso: false,
        caminhao: CAMINHOES[1],
      },
      {
        ...mockBase,
        id: '3',
        transportadora: { ...mockBase.transportadora, nome: 'Mudança Segura', notaMedia: 4.6, totalAvaliacoes: 204 },
        caminhao: CAMINHOES[2],
        precoCentavos: 135000,
        dataDisponivel: new Date(Date.now() + 1 * 86400000).toISOString(),
      },
    ]
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-base font-semibold text-gray-900 mb-4">💰 Cotações disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          {cotacoes.map((c) => (
            <CardCotacao
              key={c.id}
              cotacao={c}
              onContratar={(cot) => alert(`Contratando ${cot.transportadora.nome}`)}
            />
          ))}
        </div>
      </div>
    )
  },
}
