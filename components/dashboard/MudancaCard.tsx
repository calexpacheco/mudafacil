'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { MiniMapaPlaceholder } from './MiniMapa'

// Leaflet só roda no cliente
const MiniMapa = dynamic(
  () => import('./MiniMapa').then((m) => m.MiniMapa),
  { ssr: false, loading: () => <MiniMapaPlaceholder /> }
)

// ─── Tipos de caminhão ────────────────────────────────────────────────────────

const CAMINHAO_ICONES: Record<string, string> = {
  FIORINO: '🚐',
  HR: '🚐',
  TRES_QUARTOS: '🚛',
  BAU: '🚚',
}

// ─── Status ───────────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  RASCUNHO:           { label: 'Rascunho',           dot: 'bg-gray-400',   badge: 'bg-gray-100 text-gray-600' },
  AGUARDANDO_COTACAO: { label: 'Aguardando cotação',  dot: 'bg-amber-400',  badge: 'bg-amber-100 text-amber-700' },
  COTADO:             { label: 'Cotado',              dot: 'bg-purple-400', badge: 'bg-purple-100 text-purple-700' },
  CONFIRMADO:         { label: 'Confirmado',          dot: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700' },
  EM_ANDAMENTO:       { label: 'Em andamento',        dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700' },
  CONCLUIDO:          { label: 'Concluído',           dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700' },
  CANCELADO:          { label: 'Cancelado',           dot: 'bg-red-400',    badge: 'bg-red-100 text-red-600' },
}

// ─── Barra de progresso ───────────────────────────────────────────────────────

function ProgressBar({ percentual, status }: { percentual: number; status: string }) {
  const barColor =
    status === 'CONCLUIDO'   ? 'bg-green-500' :
    status === 'EM_ANDAMENTO'? 'bg-orange-500' :
    status === 'CONFIRMADO'  ? 'bg-blue-500' :
    status === 'CANCELADO'   ? 'bg-red-400' :
    'bg-blue-400'

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">Progresso</span>
        <span className="text-xs font-semibold text-gray-700">{Math.round(percentual)}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(percentual, 100)}%` }}
        />
      </div>
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MudancaCardProps {
  id: string
  enderecoOrigem: string
  enderecoDestino: string
  status: string
  totalItens: number
  caminhaoNome: string | null
  caminhaoTipo: string | null
  dataDesejada: Date | string | null
  valorEstimadoCentavos: number | null
  progressoPercentual: number
  latOrigem: number | null
  lngOrigem: number | null
  latDestino: number | null
  lngDestino: number | null
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function MudancaCard({
  id,
  enderecoOrigem,
  enderecoDestino,
  status,
  totalItens,
  caminhaoNome,
  caminhaoTipo,
  dataDesejada,
  valorEstimadoCentavos,
  progressoPercentual,
  latOrigem,
  lngOrigem,
  latDestino,
  lngDestino,
}: MudancaCardProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.RASCUNHO
  const temMapa = latOrigem != null && lngOrigem != null && latDestino != null && lngDestino != null
  const icone = caminhaoTipo ? CAMINHAO_ICONES[caminhaoTipo] ?? '🚛' : null

  const dataFormatada = dataDesejada
    ? new Date(dataDesejada).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : null

  const valorFormatado = valorEstimadoCentavos != null
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorEstimadoCentavos / 100)
    : null

  return (
    <Link
      href={`/app/mudanca/${id}`}
      className="flex flex-col gap-0 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-200 overflow-hidden group"
    >
      {/* Mini mapa */}
      <div className="relative">
        {temMapa ? (
          <MiniMapa
            latOrigem={latOrigem!}
            lngOrigem={lngOrigem!}
            latDestino={latDestino!}
            lngDestino={lngDestino!}
          />
        ) : (
          <MiniMapaPlaceholder />
        )}

        {/* Badge de status sobrepostos no mapa */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Corpo do cartão */}
      <div className="flex flex-col gap-3 p-4">
        {/* Rota A → B */}
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center gap-0.5 flex-shrink-0 mt-0.5">
            <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold">A</div>
            <div className="w-px h-5 bg-gray-200" />
            <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-[9px] font-bold">B</div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <p className="text-sm font-medium text-gray-900 truncate leading-tight">{enderecoOrigem}</p>
            <p className="text-sm font-medium text-gray-900 truncate leading-tight">{enderecoDestino}</p>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="h-px bg-gray-100" />

        {/* Metadados */}
        <div className="grid grid-cols-2 gap-2">
          {dataFormatada && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm">📅</span>
              <span className="text-xs text-gray-600 truncate">{dataFormatada}</span>
            </div>
          )}

          {valorFormatado && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm">💰</span>
              <span className="text-xs font-semibold text-gray-800 truncate">{valorFormatado}</span>
            </div>
          )}

          {(caminhaoNome || icone) && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{icone ?? '🚛'}</span>
              <span className="text-xs text-gray-600 truncate">{caminhaoNome ?? 'Sem caminhão'}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-sm">📦</span>
            <span className="text-xs text-gray-600">{totalItens} iten{totalItens !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Barra de progresso */}
        <ProgressBar percentual={progressoPercentual} status={status} />
      </div>
    </Link>
  )
}
