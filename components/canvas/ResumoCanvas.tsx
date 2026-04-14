'use client'

import type { CaminhaoInfo, ItemPositionado, ResumoCanvas } from '@/types/mudafacil'
import { cn } from '@/design-system/utils'
import { useTranslations } from 'next-intl'

interface ResumoCanvasProps {
  caminhao: CaminhaoInfo
  itens: ItemPositionado[]
  quantidadeCaminhoes?: number
  dataDesejada?: string
  onDataChange?: (data: string) => void
}

function calcularResumo(caminhao: CaminhaoInfo, itens: ItemPositionado[], quantidadeCaminhoes = 1): ResumoCanvas {
  const volumeTotal    = itens.reduce((acc, i) => acc + i.item.volumeM3 * (i.quantidade ?? 1), 0)
  const pesoTotal      = itens.reduce((acc, i) => acc + i.item.pesoKg   * (i.quantidade ?? 1), 0)
  const capVol = caminhao.capacidadeM3 * quantidadeCaminhoes
  const capKg  = caminhao.capacidadeKg  * quantidadeCaminhoes
  const ocupacaoPercentual = Math.min((volumeTotal / capVol) * 100, 100)
  const acimaDaCapacidade  = volumeTotal > capVol || pesoTotal > capKg

  return { volumeTotal, pesoTotal, ocupacaoPercentual, acimaDaCapacidade }
}

export function ResumoCanvasPanel({ caminhao, itens, quantidadeCaminhoes = 1 }: ResumoCanvasProps) {
  const t = useTranslations('canvas')
  const resumo = calcularResumo(caminhao, itens, quantidadeCaminhoes)

  const barColor =
    resumo.ocupacaoPercentual > 90
      ? 'bg-red-500'
      : resumo.ocupacaoPercentual > 70
        ? 'bg-amber-500'
        : 'bg-blue-600'

  return (
    <aside className="flex flex-col gap-4 p-4 rounded-xl border border-gray-200 bg-white min-w-[200px]">
      <h3 className="font-semibold text-gray-900 text-sm">{t('resumeTitle')}</h3>

      <div className="flex flex-col gap-3">
        <StatRow label={t('totalVolume')} value={`${resumo.volumeTotal.toFixed(2)} m³`} />
        <StatRow label={t('estimatedWeight')} value={`${resumo.pesoTotal.toFixed(0)} kg`} />
        <StatRow label={t('truckCapacity')} value={`${caminhao.capacidadeM3} m³`} />
        <StatRow label={t('itemsOnCanvas')} value={itens.length.toString()} />
      </div>

      {/* Barra de ocupação */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{t('occupation')}</span>
          <span className="font-semibold text-gray-800">
            {resumo.ocupacaoPercentual.toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', barColor)}
            style={{ width: `${resumo.ocupacaoPercentual}%` }}
          />
        </div>
      </div>

      {resumo.acimaDaCapacidade && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
          {t('overCapacity')}
        </div>
      )}

      {resumo.ocupacaoPercentual < 40 && itens.length > 0 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
          {t('underutilized')}
        </div>
      )}
    </aside>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  )
}

// ─── Versão horizontal compacta (para usar acima da lista) ───────────────────
export function ResumoBar({ caminhao, itens, quantidadeCaminhoes = 1, dataDesejada, onDataChange }: ResumoCanvasProps) {
  const t = useTranslations('canvas')
  const resumo = calcularResumo(caminhao, itens, quantidadeCaminhoes)

  const barColor =
    resumo.ocupacaoPercentual > 90
      ? 'bg-red-500'
      : resumo.ocupacaoPercentual > 70
        ? 'bg-amber-500'
        : 'bg-blue-500'

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">

      {/* ── Mobile: grid 2×2 ── Desktop: linha única com data inline ──────── */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:items-center sm:gap-5">

        {/* Volume */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">{t('volume')}</span>
          <span className="text-sm font-bold text-gray-900">{resumo.volumeTotal.toFixed(2)} m³</span>
        </div>

        {/* Peso */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">{t('peso')}</span>
          <span className="text-sm font-bold text-gray-900">{resumo.pesoTotal.toFixed(0)} kg</span>
        </div>

        {/* Itens */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">{t('items')}</span>
          <span className="text-sm font-bold text-gray-900">
            {itens.reduce((acc, i) => acc + (i.quantidade ?? 1), 0)}
          </span>
        </div>

        {/* Ocupação */}
        <div className="flex flex-col gap-1 sm:flex-1 sm:min-w-[120px]">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">{t('occupation')}</span>
            <span className={cn('text-xs font-bold', resumo.acimaDaCapacidade ? 'text-red-600' : 'text-gray-700')}>
              {resumo.ocupacaoPercentual.toFixed(0)}%{resumo.acimaDaCapacidade && ' ⚠️'}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', barColor)}
              style={{ width: `${resumo.ocupacaoPercentual}%` }}
            />
          </div>
        </div>

        {/* Data — inline no desktop (dentro do flex), oculta aqui no mobile */}
        {onDataChange !== undefined && (
          <div className="hidden sm:flex flex-col gap-0.5 border-l border-gray-100 pl-5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">{t('moveDate')}</span>
            <input
              type="date"
              value={dataDesejada ?? ''}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => onDataChange(e.target.value)}
              className="text-sm font-bold text-gray-900 border-none outline-none bg-transparent cursor-pointer p-0 leading-tight"
            />
          </div>
        )}

      </div>

      {/* Data — só no mobile, abaixo do grid com divisor */}
      {onDataChange !== undefined && (
        <div className="sm:hidden mt-3 pt-3 border-t border-gray-100 flex flex-col gap-0.5">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">{t('moveDate')}</span>
          <input
            type="date"
            value={dataDesejada ?? ''}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => onDataChange(e.target.value)}
            className="text-sm font-bold text-gray-900 border-none outline-none bg-transparent cursor-pointer p-0 leading-tight w-full"
          />
        </div>
      )}

      {resumo.acimaDaCapacidade && (
        <p className="mt-2 text-xs text-red-600 font-medium">{t('overCapacityBar')}</p>
      )}
    </div>
  )
}
