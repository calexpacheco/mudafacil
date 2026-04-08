'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useState, useRef } from 'react'
import { MiniMapaPlaceholder } from './MiniMapa'

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
            <>🗺️ Carregar mapa</>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Edição inline do valor estimado ─────────────────────────────────────────

function PrecoInline({ mudancaId, valorCentavos, melhorCotacaoCentavos, nomeTransportadora }: {
  mudancaId: string
  valorCentavos: number | null
  melhorCotacaoCentavos: number | null
  nomeTransportadora: string | null
}) {
  const [valor, setValor] = useState<number | null>(valorCentavos)
  const [editando, setEditando] = useState(false)
  const [input, setInput] = useState('')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const fmt = (centavos: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(centavos / 100)

  function abrirEdicao(e: React.MouseEvent) {
    e.preventDefault()
    setInput(valor != null ? (valor / 100).toFixed(2).replace('.', ',') : '')
    setEditando(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    const numero = parseFloat(input.replace(',', '.'))
    if (isNaN(numero) || numero < 0) { setEditando(false); return }
    const centavos = Math.round(numero * 100)
    setSaving(true)
    await fetch(`/api/mudancas/${mudancaId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valorEstimadoCentavos: centavos }),
    })
    setValor(centavos)
    setEditando(false)
    setSaving(false)
  }

  function cancelar(e: React.MouseEvent | React.KeyboardEvent) {
    e.preventDefault()
    setEditando(false)
  }

  if (editando) {
    return (
      <form onSubmit={salvar} onClick={(e) => e.preventDefault()} className="flex items-center gap-1 col-span-2">
        <span className="text-sm flex-shrink-0">💰</span>
        <span className="text-xs text-gray-400 flex-shrink-0">R$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && cancelar(e)}
          placeholder="0,00"
          className="w-24 text-xs border border-blue-400 rounded px-1.5 py-0.5 outline-none ring-1 ring-blue-200"
        />
        <button type="submit" disabled={saving}
          className="text-[10px] font-semibold text-white bg-blue-600 rounded px-1.5 py-0.5 hover:bg-blue-700 disabled:opacity-50">
          {saving ? '…' : 'OK'}
        </button>
        <button type="button" onClick={cancelar}
          className="text-[10px] text-gray-400 hover:text-gray-600">✕</button>
      </form>
    )
  }

  // Mostra valor estimado (prioridade) ou melhor cotação (fallback) ou botão de adicionar
  if (valor != null) {
    return (
      <div className="flex items-center gap-1.5 min-w-0 group">
        <span className="text-sm flex-shrink-0">💰</span>
        <span className="text-xs font-semibold text-gray-800 truncate">{fmt(valor)}</span>
        <button onClick={abrirEdicao}
          className="opacity-0 group-hover:opacity-100 text-[10px] text-gray-400 hover:text-blue-600 transition-opacity flex-shrink-0">
          ✏️
        </button>
      </div>
    )
  }

  if (melhorCotacaoCentavos != null) {
    return (
      <div className="flex items-center gap-1.5 min-w-0 col-span-2">
        <span className="text-sm flex-shrink-0">💰</span>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-green-700">{fmt(melhorCotacaoCentavos)}</span>
          <span className="text-[10px] text-gray-500 truncate">
            ✅ {nomeTransportadora ?? 'Cotação contratada'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <button onClick={abrirEdicao}
      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors">
      <span className="text-sm">💰</span>
      <span className="underline underline-offset-2">Adicionar valor</span>
    </button>
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
  const icone = caminhaoTipo ? CAMINHAO_ICONES[caminhaoTipo] ?? '🚛' : null

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
      </div>

      {/* Corpo do cartão — clicável para o canvas */}
      <Link
        href={`/app/mudanca/${id}`}
        className="flex flex-col gap-3 p-4"
      >
        {/* Rota A → B */}
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

        {/* Metadados */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-3">
          {dataFormatada && (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm flex-shrink-0">📅</span>
              <span className="text-xs text-gray-600 truncate">{dataFormatada}</span>
            </div>
          )}

          {/* Preço — sempre visível, com edição inline */}
          <PrecoInline
            mudancaId={id}
            valorCentavos={valorEstimadoCentavos}
            melhorCotacaoCentavos={melhorCotacaoCentavos}
            nomeTransportadora={nomeTransportadoraContratada}
          />

          {(caminhaoNome || icone) && (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm flex-shrink-0">{icone ?? '🚛'}</span>
              <span className="text-xs text-gray-600 truncate">{caminhaoNome ?? 'Sem caminhão'}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-sm flex-shrink-0">📦</span>
            <span className="text-xs text-gray-600">{totalItens} iten{totalItens !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Barra de progresso */}
        <ProgressBar percentual={progressoPercentual} status={status} />
      </Link>
    </div>
  )
}
