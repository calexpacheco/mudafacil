import type { Meta, StoryObj } from '@storybook/nextjs'
import { CardCotacao } from '@/components/cotacoes/CardCotacao'
import { CAMINHOES } from '@/lib/caminhoes'
import type { CotacaoCard } from '@/types/mudafacil'
import { IconCurrencyDollar } from '@tabler/icons-react'

const d = (days: number) => new Date(Date.now() + days * 86400000).toISOString()

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
  dataDisponivel: d(2),
  seguroIncluso: true,
  validade: d(7),
}

const meta: Meta<typeof CardCotacao> = {
  title: 'Components/CardCotacao',
  component: CardCotacao,
  args: {
    cotacao: mockBase,
    onContratar: (c) => alert(`Contratando ${c.transportadora.nome}...`),
    contratada: false,
    contratarStatus: 'idle',
  },
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'mudafacil' },
  },
}

export default meta
type Story = StoryObj<typeof CardCotacao>

// ─── Padrão ───────────────────────────────────────────────────────────────────

export const Padrao: Story = {
  name: 'Padrão — Com seguro incluso',
}

// ─── Sem seguro ───────────────────────────────────────────────────────────────

export const SemSeguro: Story = {
  name: 'Sem seguro',
  args: {
    cotacao: {
      ...mockBase,
      id: '2',
      transportadora: { ...mockBase.transportadora, nome: 'Rápido Mudanças', notaMedia: 4.2, totalAvaliacoes: 87 },
      precoCentavos: 74000,
      seguroIncluso: false,
      dataDisponivel: d(5),
    },
  },
}

// ─── Nota baixa ──────────────────────────────────────────────────────────────

export const NotaBaixa: Story = {
  name: 'Nota baixa — 2.3★',
  args: {
    cotacao: {
      ...mockBase,
      id: '3',
      transportadora: { ...mockBase.transportadora, nome: 'Transportes Genéricos Ltda', notaMedia: 2.3, totalAvaliacoes: 14 },
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
      transportadora: { ...mockBase.transportadora, nome: 'Mudança Segura', notaMedia: 4.6, totalAvaliacoes: 204 },
      caminhao: CAMINHOES[3],
      precoCentavos: 135000,
      dataDisponivel: d(1),
      validade: d(5),
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
      transportadora: { ...mockBase.transportadora, nome: 'Frete Rápido SP', notaMedia: 4.4, totalAvaliacoes: 56 },
      caminhao: CAMINHOES[0],
      precoCentavos: 34000,
      seguroIncluso: false,
    },
  },
}

// ─── Estado: Carregando ───────────────────────────────────────────────────────

export const Carregando: Story = {
  name: 'Estado — Contratando (loading)',
  args: {
    contratarStatus: 'loading',
  },
}

// ─── Estado: Contratada ───────────────────────────────────────────────────────

export const Contratada: Story = {
  name: 'Estado — Cotação contratada ✅',
  args: {
    contratada: true,
    contratarStatus: 'success',
  },
}

// ─── Estado: Erro ─────────────────────────────────────────────────────────────

export const Erro: Story = {
  name: 'Estado — Erro ao contratar ⚠️',
  args: {
    contratarStatus: 'error',
  },
}

// ─── Grid 2 colunas (layout real do app) ─────────────────────────────────────

export const Grid: StoryObj = {
  name: 'Grid 2 colunas — como no app',
  render: () => {
    const cotacoes: CotacaoCard[] = [
      mockBase,
      { ...mockBase, id: '2', transportadora: { ...mockBase.transportadora, nome: 'Rápido Mudanças', notaMedia: 4.2, totalAvaliacoes: 87 }, precoCentavos: 74000, seguroIncluso: false, caminhao: CAMINHOES[1] },
      { ...mockBase, id: '3', transportadora: { ...mockBase.transportadora, nome: 'Mudança Segura', notaMedia: 4.6, totalAvaliacoes: 204 }, caminhao: CAMINHOES[2], precoCentavos: 135000, dataDisponivel: d(1) },
      { ...mockBase, id: '4', transportadora: { ...mockBase.transportadora, nome: 'TransLog BH', notaMedia: 3.9, totalAvaliacoes: 42 }, caminhao: CAMINHOES[3], precoCentavos: 158000, seguroIncluso: false, dataDisponivel: d(3) },
    ]
    return (
      <div className="p-6 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-1.5"><IconCurrencyDollar size={16} stroke={1.5} className="text-gray-700" /> Cotações disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          {cotacoes.map((c, i) => (
            <CardCotacao
              key={c.id}
              cotacao={c}
              contratada={i === 1}
              onContratar={(cot) => alert(`Contratando ${cot.transportadora.nome}`)}
            />
          ))}
        </div>
      </div>
    )
  },
}
