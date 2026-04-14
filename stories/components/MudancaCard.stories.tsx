import type { Meta, StoryObj } from '@storybook/nextjs'
import { IconTruck, IconTruckDelivery, IconPackage, IconCurrencyDollar, IconCheck } from '@tabler/icons-react'

// MudancaCard usa Leaflet (dynamic import) e API calls — criamos versão visual

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  RASCUNHO:           { label: 'Rascunho',           dot: 'bg-gray-400',   badge: 'bg-gray-100 text-gray-600' },
  AGUARDANDO_COTACAO: { label: 'Aguardando cotação',  dot: 'bg-amber-400',  badge: 'bg-amber-100 text-amber-700' },
  COTADO:             { label: 'Cotado',              dot: 'bg-purple-400', badge: 'bg-purple-100 text-purple-700' },
  CONFIRMADO:         { label: 'Confirmado',          dot: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700' },
  EM_ANDAMENTO:       { label: 'Em andamento',        dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700' },
  CONCLUIDO:          { label: 'Concluído',           dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700' },
  CANCELADO:          { label: 'Cancelado',           dot: 'bg-red-400',    badge: 'bg-red-100 text-red-600' },
}

function CaminhaoIcon({ tipo, size = 18 }: { tipo: string; size?: number }) {
  if (tipo === 'FIORINO' || tipo === 'HR') return <IconTruckDelivery size={size} stroke={1.5} className="text-gray-600" />
  return <IconTruckDelivery size={size} stroke={1.5} className="text-gray-600" />
}

interface CardProps {
  enderecoOrigem: string
  enderecoDestino: string
  status: string
  totalItens: number
  caminhaoNome: string | null
  caminhaoTipo: string | null
  dataDesejada: string | null
  valorEstimadoCentavos: number | null
  melhorCotacaoCentavos: number | null
  nomeTransportadoraContratada: string | null
  progressoPercentual: number
  temMapa?: boolean
}

function ProgressBar({ percentual, status }: { percentual: number; status: string }) {
  const barColor =
    status === 'CONCLUIDO'    ? 'bg-green-500'  :
    status === 'EM_ANDAMENTO' ? 'bg-orange-500' :
    status === 'CONFIRMADO'   ? 'bg-blue-500'   :
    status === 'CANCELADO'    ? 'bg-red-400'    :
    'bg-blue-400'
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">Progresso</span>
        <span className="text-xs font-semibold text-gray-700">{Math.round(percentual)}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(percentual, 100)}%` }} />
      </div>
    </div>
  )
}

function MudancaCardVisual({ enderecoOrigem, enderecoDestino, status, totalItens, caminhaoNome, caminhaoTipo, dataDesejada, valorEstimadoCentavos, melhorCotacaoCentavos, nomeTransportadoraContratada, progressoPercentual, temMapa = false }: CardProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.RASCUNHO
  const fmt = (c: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c / 100)
  const dataFmt = dataDesejada ? new Date(dataDesejada).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : null

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Mapa / placeholder */}
      <div className="relative">
        {temMapa ? (
          <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center">
            <IconTruck size={32} stroke={1.5} className="text-blue-400" />
          </div>
        ) : (
          <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
            <div className="px-3 py-1.5 rounded-lg bg-white text-xs font-semibold text-blue-700 shadow-md flex items-center gap-1.5">
              <IconTruck size={14} stroke={1.5} /> Carregar mapa
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2 z-10">
          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Corpo */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">A</div>
            <p className="text-sm font-medium text-gray-900 truncate leading-tight">{enderecoOrigem}</p>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">B</div>
            <p className="text-sm font-medium text-gray-900 truncate leading-tight">{enderecoDestino}</p>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="grid grid-cols-2 gap-y-2 gap-x-3">
          {dataFmt && (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-gray-400 flex-shrink-0 text-xs">{dataFmt.split(' ')[1]}</span>
              <span className="text-xs text-gray-600 truncate">{dataFmt}</span>
            </div>
          )}
          {melhorCotacaoCentavos != null ? (
            <div className="flex items-center gap-1.5 min-w-0 col-span-2">
              <IconCurrencyDollar size={16} stroke={1.5} className="text-gray-500 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-green-700">{fmt(melhorCotacaoCentavos)}</span>
                <span className="text-[10px] text-gray-500 truncate flex items-center gap-0.5"><IconCheck size={10} stroke={2} className="text-[#E83500]" /> {nomeTransportadoraContratada ?? 'Cotação contratada'}</span>
              </div>
            </div>
          ) : valorEstimadoCentavos != null ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <IconCurrencyDollar size={16} stroke={1.5} className="text-gray-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-gray-800 truncate">{fmt(valorEstimadoCentavos)}</span>
            </div>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <IconCurrencyDollar size={16} stroke={1.5} /><span className="underline underline-offset-2">Adicionar valor</span>
            </span>
          )}
          {(caminhaoNome || caminhaoTipo) && (
            <div className="flex items-center gap-1.5 min-w-0">
              {caminhaoTipo ? <CaminhaoIcon tipo={caminhaoTipo} size={16} /> : <IconTruck size={16} stroke={1.5} className="text-gray-600" />}
              <span className="text-xs text-gray-600 truncate">{caminhaoNome ?? 'Sem caminhão'}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <IconPackage size={16} stroke={1.5} className="text-gray-500 flex-shrink-0" />
            <span className="text-xs text-gray-600">{totalItens} iten{totalItens !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <ProgressBar percentual={progressoPercentual} status={status} />
      </div>
    </div>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Components/MudancaCard',
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'mudafacil' },
  },
}

export default meta

// ─── Rascunho ─────────────────────────────────────────────────────────────────

export const Rascunho: StoryObj = {
  name: 'Rascunho — sem valor, sem caminhão',
  render: () => (
    <div className="max-w-sm">
      <MudancaCardVisual
        enderecoOrigem="Rua das Flores, 123 - São Paulo, SP"
        enderecoDestino="Av. Paulista, 1000 - São Paulo, SP"
        status="RASCUNHO"
        totalItens={0}
        caminhaoNome={null}
        caminhaoTipo={null}
        dataDesejada={null}
        valorEstimadoCentavos={null}
        melhorCotacaoCentavos={null}
        nomeTransportadoraContratada={null}
        progressoPercentual={10}
      />
    </div>
  ),
}

// ─── Com mapa ─────────────────────────────────────────────────────────────────

export const ComMapa: StoryObj = {
  name: 'Com mapa + itens + caminhão',
  render: () => (
    <div className="max-w-sm">
      <MudancaCardVisual
        enderecoOrigem="Rua das Flores, 123 - São Paulo, SP"
        enderecoDestino="Av. Atlântica, 500 - Rio de Janeiro, RJ"
        status="AGUARDANDO_COTACAO"
        totalItens={14}
        caminhaoNome="HR / Sprinter"
        caminhaoTipo="HR"
        dataDesejada={new Date(Date.now() + 7 * 86400000).toISOString()}
        valorEstimadoCentavos={120000}
        melhorCotacaoCentavos={null}
        nomeTransportadoraContratada={null}
        progressoPercentual={45}
        temMapa={true}
      />
    </div>
  ),
}

// ─── Cotação contratada ───────────────────────────────────────────────────────

export const Contratado: StoryObj = {
  name: 'Confirmado — cotação contratada',
  render: () => (
    <div className="max-w-sm">
      <MudancaCardVisual
        enderecoOrigem="Rua Augusta, 200 - São Paulo, SP"
        enderecoDestino="Rua XV de Novembro, 1 - Curitiba, PR"
        status="CONFIRMADO"
        totalItens={22}
        caminhaoNome="Caminhão Baú"
        caminhaoTipo="BAU"
        dataDesejada={new Date(Date.now() + 3 * 86400000).toISOString()}
        valorEstimadoCentavos={null}
        melhorCotacaoCentavos={89000}
        nomeTransportadoraContratada="MudaBR Express"
        progressoPercentual={75}
        temMapa={true}
      />
    </div>
  ),
}

// ─── Todos os status ──────────────────────────────────────────────────────────

export const TodosStatus: StoryObj = {
  name: 'Todos os status',
  render: () => (
    <div className="p-6 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
        {Object.keys(STATUS_CONFIG).map((status) => (
          <MudancaCardVisual
            key={status}
            enderecoOrigem="Rua das Flores, 123 - SP"
            enderecoDestino="Av. Paulista, 1000 - SP"
            status={status}
            totalItens={8}
            caminhaoNome="HR / Sprinter"
            caminhaoTipo="HR"
            dataDesejada={new Date(Date.now() + 5 * 86400000).toISOString()}
            valorEstimadoCentavos={95000}
            melhorCotacaoCentavos={null}
            nomeTransportadoraContratada={null}
            progressoPercentual={
              status === 'CONCLUIDO' ? 100 :
              status === 'EM_ANDAMENTO' ? 65 :
              status === 'CONFIRMADO' ? 75 :
              status === 'COTADO' ? 50 :
              status === 'AGUARDANDO_COTACAO' ? 30 :
              status === 'CANCELADO' ? 20 : 10
            }
          />
        ))}
      </div>
    </div>
  ),
}

// ─── Grid dashboard ───────────────────────────────────────────────────────────

export const GridDashboard: StoryObj = {
  name: 'Grid — como no dashboard',
  render: () => (
    <div className="p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Mudanças</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie e planeje suas mudanças</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <MudancaCardVisual enderecoOrigem="Rua das Flores, 123 - SP" enderecoDestino="Av. Atlântica, 500 - RJ" status="AGUARDANDO_COTACAO" totalItens={14} caminhaoNome="HR / Sprinter" caminhaoTipo="HR" dataDesejada={new Date(Date.now() + 7 * 86400000).toISOString()} valorEstimadoCentavos={120000} melhorCotacaoCentavos={null} nomeTransportadoraContratada={null} progressoPercentual={45} temMapa={true} />
        <MudancaCardVisual enderecoOrigem="Rua Augusta, 200 - SP" enderecoDestino="Rua XV de Novembro, 1 - PR" status="CONFIRMADO" totalItens={22} caminhaoNome="Caminhão Baú" caminhaoTipo="BAU" dataDesejada={new Date(Date.now() + 3 * 86400000).toISOString()} valorEstimadoCentavos={null} melhorCotacaoCentavos={89000} nomeTransportadoraContratada="MudaBR Express" progressoPercentual={75} temMapa={true} />
        <MudancaCardVisual enderecoOrigem="Av. Brasil, 50 - RJ" enderecoDestino="Rua das Palmeiras, 10 - MG" status="RASCUNHO" totalItens={3} caminhaoNome={null} caminhaoTipo={null} dataDesejada={null} valorEstimadoCentavos={null} melhorCotacaoCentavos={null} nomeTransportadoraContratada={null} progressoPercentual={10} />
      </div>
    </div>
  ),
}
