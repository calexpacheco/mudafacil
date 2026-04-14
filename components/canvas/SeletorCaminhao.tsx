'use client'

import { useEffect, useRef } from 'react'
import { CAMINHOES, CAMINHAO_CORES } from '@/lib/caminhoes'
import type { CaminhaoInfo, ItemPositionado } from '@/types/mudafacil'
import { cn } from '@/design-system/utils'
import { IconTruck, IconCheck, IconAlertTriangle } from '@tabler/icons-react'

interface SeletorCaminhaoProps {
  selecionado: CaminhaoInfo
  onSelecionar: (caminhao: CaminhaoInfo) => void
  itens: ItemPositionado[]
  quantidadeCaminhoes?: number
  onQuantidadeCaminhoesChange?: (qty: number) => void
  layout?: 'list' | 'grid'
}

export function SeletorCaminhao({
  selecionado,
  onSelecionar,
  itens,
  quantidadeCaminhoes = 1,
  onQuantidadeCaminhoesChange,
  layout = 'list',
}: SeletorCaminhaoProps) {
  const volumeTotal = itens.reduce((acc, i) => acc + i.item.volumeM3 * (i.quantidade ?? 1), 0)
  const pesoTotal   = itens.reduce((acc, i) => acc + i.item.pesoKg   * (i.quantidade ?? 1), 0)

  // ── Carrossel mobile ────────────────────────────────────────────────────────
  const scrollRef = useRef<HTMLDivElement>(null)

  // Rola para o card selecionado sempre que muda
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const el = container.querySelector<HTMLElement>(`[data-id="${selecionado.id}"]`)
    if (!el) return
    // Centraliza o card no container
    const offset = el.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2
    container.scrollTo({ left: offset, behavior: 'smooth' })
  }, [selecionado.id])

  // ── Render ─────────────────────────────────────────────────────────────────

  if (layout === 'grid') {
    return (
      <div className="flex flex-col gap-3">
        {/* ── Carrossel mobile ──────────────────────────────────────────── */}
        <div
          ref={scrollRef}
          className="lg:hidden flex gap-3 overflow-x-auto"
          style={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            paddingLeft: '10%',
            paddingRight: '10%',
            paddingTop: '6px',
            paddingBottom: '6px',
          }}
        >
          {CAMINHOES.map((caminhao) => (
            <CarouselCard
              key={caminhao.id}
              caminhao={caminhao}
              isSelected={selecionado.id === caminhao.id}
              volumeTotal={volumeTotal}
              pesoTotal={pesoTotal}
              quantidadeCaminhoes={quantidadeCaminhoes}
              onSelecionar={onSelecionar}
              onQuantidadeCaminhoesChange={onQuantidadeCaminhoesChange}
            />
          ))}
        </div>

        {/* Indicador de dots */}
        <div className="lg:hidden flex justify-center gap-1.5">
          {CAMINHOES.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelecionar(c)}
              className={cn(
                'rounded-full transition-all duration-200 cursor-pointer',
                selecionado.id === c.id
                  ? 'w-5 h-2 bg-[#E83500]'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              )}
            />
          ))}
        </div>

        {/* ── Grid desktop ────────────────────────────────────────────────── */}
        <div className="hidden lg:grid grid-cols-4 gap-3">
          {CAMINHOES.map((caminhao) => {
            const qtd = selecionado.id === caminhao.id ? quantidadeCaminhoes : 1
            const capVol  = caminhao.capacidadeM3 * qtd
            const capKg   = caminhao.capacidadeKg  * qtd
            const ocupVol = Math.min((volumeTotal / capVol)  * 100, 100)
            const ocupPeso = Math.min((pesoTotal  / capKg)   * 100, 100)
            const ocupacao = Math.max(ocupVol, ocupPeso)
            const acima    = volumeTotal > capVol || pesoTotal > capKg
            const isSelected = selecionado.id === caminhao.id
            const cor = CAMINHAO_CORES[caminhao.tipo]

            return (
              <div
                key={caminhao.id}
                className={cn(
                  'flex flex-col items-start gap-1.5 p-3 rounded-xl border-2 transition-all',
                  isSelected
                    ? 'border-[#FA9370] bg-[#FFF8F6] shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={() => onSelecionar(caminhao)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                    style={{ backgroundColor: `${cor}20` }}
                  >
                    <TruckIcon tipo={caminhao.tipo} cor={cor} />
                  </button>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-[#E83500] flex items-center gap-0.5">
                      <IconCheck size={12} stroke={2} /> Selecionado
                    </span>
                  )}
                </div>

                <button onClick={() => onSelecionar(caminhao)} className="text-left w-full cursor-pointer">
                  <p className="font-semibold text-sm text-gray-900 leading-snug">{caminhao.nome}</p>
                  <p className="text-xs text-gray-400">
                    {isSelected && quantidadeCaminhoes > 1
                      ? `${(caminhao.capacidadeM3 * quantidadeCaminhoes).toFixed(0)}m³ · ${(caminhao.capacidadeKg * quantidadeCaminhoes / 1000).toFixed(1)}t`
                      : `${caminhao.capacidadeM3}m³ · ${caminhao.capacidadeKg}kg`}
                  </p>
                </button>

                <OcupacaoBar ocupacao={ocupacao} acima={acima} />

                {isSelected && onQuantidadeCaminhoesChange && (
                  <QuantidadeControl
                    quantidade={quantidadeCaminhoes}
                    onChange={onQuantidadeCaminhoesChange}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Layout lista (sidebar) ─────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-2">
      {CAMINHOES.map((caminhao) => {
        const ocupVol  = Math.min((volumeTotal / caminhao.capacidadeM3) * 100, 100)
        const ocupPeso = Math.min((pesoTotal   / caminhao.capacidadeKg) * 100, 100)
        const ocupacao = Math.max(ocupVol, ocupPeso)
        const acima    = volumeTotal > caminhao.capacidadeM3 || pesoTotal > caminhao.capacidadeKg
        const isSelected = selecionado.id === caminhao.id
        const cor = CAMINHAO_CORES[caminhao.tipo]

        return (
          <button
            key={caminhao.id}
            onClick={() => onSelecionar(caminhao)}
            className={cn(
              'flex items-center gap-3 p-2.5 rounded-xl border-2 text-left transition-all w-full cursor-pointer',
              isSelected
                ? 'border-[#FA9370] bg-[#FFF8F6] shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            )}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${cor}20` }}
            >
              <TruckIcon tipo={caminhao.tipo} cor={cor} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-gray-900 truncate">{caminhao.nome}</span>
                {isSelected && <IconCheck size={14} stroke={2} className="text-[#E83500] flex-shrink-0 ml-1" />}
              </div>
              <span className="text-xs text-gray-400">
                {caminhao.capacidadeM3}m³ · {caminhao.capacidadeKg}kg
              </span>
              <div className="mt-1.5">
                <OcupacaoBar ocupacao={ocupacao} acima={acima} />
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ── Card do carrossel mobile ────────────────────────────────────────────────

function CarouselCard({
  caminhao,
  isSelected,
  volumeTotal,
  pesoTotal,
  quantidadeCaminhoes,
  onSelecionar,
  onQuantidadeCaminhoesChange,
}: {
  caminhao: CaminhaoInfo
  isSelected: boolean
  volumeTotal: number
  pesoTotal: number
  quantidadeCaminhoes: number
  onSelecionar: (c: CaminhaoInfo) => void
  onQuantidadeCaminhoesChange?: (qty: number) => void
}) {
  const qtd     = isSelected ? quantidadeCaminhoes : 1
  const capVol  = caminhao.capacidadeM3 * qtd
  const capKg   = caminhao.capacidadeKg  * qtd
  const ocupVol  = Math.min((volumeTotal / capVol)  * 100, 100)
  const ocupPeso = Math.min((pesoTotal  / capKg)   * 100, 100)
  const ocupacao = Math.max(ocupVol, ocupPeso)
  const acima    = volumeTotal > capVol || pesoTotal > capKg
  const cor      = CAMINHAO_CORES[caminhao.tipo]

  return (
    <div
      data-id={caminhao.id}
      onClick={() => onSelecionar(caminhao)}
      style={{ scrollSnapAlign: 'center', minWidth: '75%' }}
      className={cn(
        'flex flex-col gap-3 p-4 rounded-2xl border-2 transition-all flex-shrink-0 cursor-pointer select-none',
        isSelected
          ? 'border-[#FA9370] bg-[#FFF8F6] shadow-md scale-[1.02]'
          : 'border-gray-200 bg-white opacity-70'
      )}
    >
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${cor}20` }}
        >
          <TruckIcon tipo={caminhao.tipo} cor={cor} large />
        </div>
        {isSelected && (
          <span className="text-xs font-bold text-[#E83500] flex items-center gap-1 bg-[#FFE8E0] px-2 py-1 rounded-full">
            <IconCheck size={12} stroke={2.5} /> Selecionado
          </span>
        )}
      </div>

      {/* Nome e capacidade */}
      <div>
        <p className="font-bold text-base text-gray-900">{caminhao.nome}</p>
        <p className="text-sm text-gray-500 mt-0.5">
          {isSelected && quantidadeCaminhoes > 1
            ? `${(caminhao.capacidadeM3 * quantidadeCaminhoes).toFixed(0)} m³ · ${(caminhao.capacidadeKg * quantidadeCaminhoes / 1000).toFixed(1)} t`
            : `${caminhao.capacidadeM3} m³ · ${(caminhao.capacidadeKg / 1000).toFixed(1)} t`}
        </p>
      </div>

      {/* Barra de ocupação */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Ocupação</span>
          <span className={acima ? 'text-red-500 font-bold' : 'font-semibold text-gray-600'}>
            {ocupacao.toFixed(0)}%
            {acima && <IconAlertTriangle size={12} stroke={2} className="inline ml-0.5 text-red-500" />}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500',
              acima ? 'bg-red-500' : ocupacao > 70 ? 'bg-amber-500' : 'bg-green-500'
            )}
            style={{ width: `${Math.min(ocupacao, 100)}%` }}
          />
        </div>
      </div>

      {/* Controle de quantidade — só no selecionado */}
      {isSelected && onQuantidadeCaminhoesChange && (
        <div
          className="flex items-center justify-between pt-3 border-t border-[#FA9370]/30"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-sm text-gray-600 font-medium">Quantidade</span>
          <QuantidadeControl quantidade={quantidadeCaminhoes} onChange={onQuantidadeCaminhoesChange} />
        </div>
      )}
    </div>
  )
}

// ── Sub-componentes reutilizáveis ──────────────────────────────────────────

function OcupacaoBar({ ocupacao, acima }: { ocupacao: number; acima: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
        <span>Ocupação</span>
        <span className={cn('flex items-center gap-0.5', acima ? 'text-red-500 font-bold' : '')}>
          {ocupacao.toFixed(0)}%
          {acima && <IconAlertTriangle size={10} stroke={2} />}
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all',
            acima ? 'bg-red-500' : ocupacao > 70 ? 'bg-amber-500' : 'bg-green-500'
          )}
          style={{ width: `${Math.min(ocupacao, 100)}%` }}
        />
      </div>
    </div>
  )
}

function QuantidadeControl({ quantidade, onChange }: { quantidade: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-2 py-1">
      <button
        onClick={(e) => { e.stopPropagation(); onChange(Math.max(1, quantidade - 1)) }}
        className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
      >−</button>
      <span className="min-w-[1.4rem] text-center text-sm font-bold text-gray-800 tabular-nums">
        {quantidade}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onChange(quantidade + 1) }}
        className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
      >+</button>
    </div>
  )
}

function TruckIcon({ tipo, cor, large }: { tipo: string; cor: string; large?: boolean }) {
  const sizes: Record<string, number> = { FIORINO: 18, HR: 20, TRES_QUARTOS: 22, BAU: 24 }
  const largeSizes: Record<string, number> = { FIORINO: 24, HR: 26, TRES_QUARTOS: 28, BAU: 30 }
  const size = (large ? largeSizes : sizes)[tipo] ?? 20
  return <IconTruck size={size} stroke={1.5} style={{ color: cor }} />
}
