'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { MiniMapaPlaceholder } from './MiniMapa'
import { IconTruck, IconMap, IconCurrencyDollar, IconCheck, IconCalendar, IconPackage } from '@tabler/icons-react'
import { BotaoDeletarMudanca } from './BotaoDeletarMudanca'

// Leaflet só roda no cliente — carregado dinamicamente
const MiniMapa = dynamic(
  () => import('./MiniMapa').then((m) => m.MiniMapa),
  { ssr: false, loading: () => <MapSkeleton /> }
)

function MapSkeleton() {
  return (
    <div className="w-full rounded-t-xl bg-gray-100 animate-pulse" style={{ height: 128 }} />
  )
}

// ─── Tipos de caminhão ────────────────────────────────────────────────────────

// Truck sizes vary by vehicle type (all use IconTruck, size varies)
const CAMINHAO_SIZES: Record<string, number> = {
  FIORINO: 16,
  HR: 16,
  TRES_QUARTOS: 18,
  BAU: 18,
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
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(percentual, 100)}%` }}
        />
      </div>
    </div>
  )
}

// ─── Área do mapa com re-geocoding ────────────────────────────────────────────

function MapArea({
  mudancaId,
  latOrigem,
  lngOrigem,
  latDestino,
  lngDestino,
}: {
  mudancaId: string
  latOrigem: number | null
  lngOrigem: number | null
  latDestino: number | null
  lngDestino: number | null
}) {
  const [coords, setCoords] = useState({
    latOrigem, lngOrigem, latDestino, lngDestino,
  })
  const [loading, setLoading] = useState(false)

  // Sincroniza quando os endereços são editados e o servidor devolve novas coordenadas
  useEffect(() => {
    setCoords({ latOrigem, lngOrigem, latDestino, lngDestino })
  }, [latOrigem, lngOrigem, latDestino, lngDestino])

  const temMapa =
    coords.latOrigem != null &&
    coords.lngOrigem != null &&
    coords.latDestino != null &&
    coords.lngDestino != null

  async function handleGeocodeClick(e: React.MouseEvent) {
    e.preventDefault() // evita navegar para o canvas
    setLoading(true)
    try {
      const res = await fetch(`/api/mudancas/${mudancaId}/geocode`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setCoords({
          latOrigem: data.latOrigem,
          lngOrigem: data.lngOrigem,
          latDestino: data.latDestino,
          lngDestino: data.lngDestino,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (temMapa) {
    return (
      <MiniMapa
        latOrigem={coords.latOrigem!}
        lngOrigem={coords.lngOrigem!}
        latDestino={coords.latDestino!}
        lngDestino={coords.lngDestino!}
      />
    )
  }

  return (
    <div className="relative">
      <MiniMapaPlaceholder />
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-t-xl">
        <button
          onClick={handleGeocodeClick}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-white text-xs font-semibold text-blue-700 shadow-md hover:bg-blue-50 transition-colors disabled:opacity-60 flex items-center gap-1.5"
        >
          {loading ? (
            <>
              <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Buscando...
            </>
          ) : (
            <><IconMap size={14} stroke={1.5} className="text-blue-700" /> Carregar mapa</>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Edição inline do valor estimado ─────────────────────────────────────────

function PrecoInline({ valorCentavos, melhorCotacaoCentavos, nomeTransportadora }: {
  valorCentavos: number | null
  melhorCotacaoCentavos: number | null
  nomeTransportadora: string | null
}) {
  const fmt = (centavos: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(centavos / 100)

  if (valorCentavos != null) {
    return (
      <div className="flex items-center gap-1.5 min-w-0">
        <IconCurrencyDollar size={16} stroke={1.5} className="text-gray-500 flex-shrink-0" />
        <span className="text-xs font-semibold text-gray-800 truncate">{fmt(valorCentavos)}</span>
      </div>
    )
  }

  if (melhorCotacaoCentavos != null) {
    return (
      <div className="flex items-center gap-1.5 min-w-0 col-span-2">
        <IconCurrencyDollar size={16} stroke={1.5} className="text-gray-500 flex-shrink-0" />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-green-700">{fmt(melhorCotacaoCentavos)}</span>
          <span className="text-[10px] text-gray-500 truncate flex items-center gap-0.5">
            <IconCheck size={10} stroke={2} className="text-green-600" />
            {nomeTransportadora ?? 'Cotação contratada'}
          </span>
        </div>
      </div>
    )
  }

  return null
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
  melhorCotacaoCentavos: number | null
  nomeTransportadoraContratada: string | null
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
  melhorCotacaoCentavos,
  nomeTransportadoraContratada,
  progressoPercentual,
  latOrigem,
  lngOrigem,
  latDestino,
  lngDestino,
}: MudancaCardProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.RASCUNHO
  const caminhaoIconeSize = caminhaoTipo ? (CAMINHAO_SIZES[caminhaoTipo] ?? 16) : 16

  const dataFormatada = dataDesejada
    ? new Date(dataDesejada).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : null

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Área do mapa (com botão de geocoding se necessário) */}
      <div className="relative">
        <MapArea
          mudancaId={id}
          latOrigem={latOrigem}
          lngOrigem={lngOrigem}
          latDestino={latDestino}
          lngDestino={lngDestino}
        />
        {/* Badge de status sobreposto no mapa */}
        <div className="absolute top-2 left-2 z-10">
          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>
        {/* Botão deletar sobreposto no mapa (canto direito) — z-index alto para ficar acima dos layers do Leaflet */}
        <div className="absolute top-2 right-2" style={{ zIndex: 1000 }}>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
            <BotaoDeletarMudanca mudancaId={id} variant="icon" />
          </div>
        </div>
      </div>

      {/* Corpo do cartão — clicável para o canvas */}
      <Link
        href={`/app/mudanca/${id}`}
        className="flex flex-col gap-3 p-4"
      >
        {/* Rota A → B */}
        <div className="flex gap-2 min-w-0">
          <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
            <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">A</div>
            <div className="flex-1 flex flex-col justify-center gap-0.5 my-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-px h-1.5 bg-gray-300 mx-auto" />
              ))}
            </div>
            <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">B</div>
          </div>
          <div className="flex flex-col justify-between min-w-0 flex-1 gap-2">
            <p className="text-sm font-medium text-gray-900 truncate leading-tight">{enderecoOrigem}</p>
            <p className="text-sm font-medium text-gray-900 truncate leading-tight">{enderecoDestino}</p>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Metadados */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-3">
          {dataFormatada && (
            <div className="flex items-center gap-1.5 min-w-0">
              <IconCalendar size={16} stroke={1.5} className="text-gray-500 flex-shrink-0" />
              <span className="text-xs text-gray-600 truncate">{dataFormatada}</span>
            </div>
          )}

          {/* Preço — sempre visível, com edição inline */}
          <PrecoInline
            valorCentavos={valorEstimadoCentavos}
            melhorCotacaoCentavos={melhorCotacaoCentavos}
            nomeTransportadora={nomeTransportadoraContratada}
          />

          {caminhaoNome && (
            <div className="flex items-center gap-1.5 min-w-0">
              <IconTruck size={caminhaoIconeSize} stroke={1.5} className="text-gray-500 flex-shrink-0" />
              <span className="text-xs text-gray-600 truncate">{caminhaoNome}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <IconPackage size={16} stroke={1.5} className="text-gray-500 flex-shrink-0" />
            <span className="text-xs text-gray-600">{totalItens} iten{totalItens !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Barra de progresso */}
        <ProgressBar percentual={progressoPercentual} status={status} />
      </Link>
    </div>
  )
}
