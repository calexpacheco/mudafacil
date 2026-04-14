'use client'

import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import type { ItemPositionado } from '@/types/mudafacil'
import { cn } from '@/design-system/utils'
import { IconPackage, IconX, IconAlertTriangle, IconRuler } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'

// ─── Mapeamentos por categoria ───────────────────────────────────────────────

const CATEGORIA_COR: Record<string, { bg: string; text: string }> = {
  quarto:     { bg: 'bg-violet-500', text: 'text-white' },
  cozinha:    { bg: 'bg-orange-500', text: 'text-white' },
  sala:       { bg: 'bg-emerald-500', text: 'text-white' },
  escritorio: { bg: 'bg-blue-500',   text: 'text-white' },
  caixa:      { bg: 'bg-amber-400',  text: 'text-white' },
}

function getCor(categoria: string) {
  return CATEGORIA_COR[categoria] ?? { bg: 'bg-gray-400', text: 'text-white' }
}

function fmtM3(v: number) {
  return v.toFixed(2) + ' m³'
}

// ─── Caixa de dimensão ───────────────────────────────────────────────────────

function DimBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 bg-white rounded-lg border border-gray-200 p-2">
      <IconRuler size={14} stroke={1.5} className="text-gray-400" />
      <span className="text-xs font-bold text-gray-800 leading-tight">{value}</span>
      <span className="text-[10px] text-gray-400 leading-tight">{label}</span>
    </div>
  )
}

// ─── Card individual de item ─────────────────────────────────────────────────

function ItemCard({
  itemPos,
  onRemove,
  onQuantidadeChange,
}: {
  itemPos: ItemPositionado
  onRemove: () => void
  onQuantidadeChange: (qty: number) => void
}) {
  const t = useTranslations('canvas')
  const tCat = useTranslations('app.categories')
  const [expandido, setExpandido] = useState(false)
  const { item } = itemPos
  const qty = itemPos.quantidade ?? 1
  const cor = getCor(item.categoria)
  const catLabel = tCat(item.categoria as Parameters<typeof tCat>[0]) ?? item.categoria
  const inicial = item.nome.charAt(0).toUpperCase()

  return (
    <div
      className={cn(
        'rounded-xl border bg-white overflow-hidden transition-shadow min-w-0',
        expandido
          ? 'border-blue-300 shadow-md sm:col-span-2'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      )}
    >
      {/* Linha principal */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className={cn(
            'w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm',
            cor.bg,
            cor.text
          )}
        >
          {inicial}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate leading-snug">
            {item.nome}
          </p>
          <p className="text-xs text-gray-400 leading-snug">
            {catLabel}
            <span className="mx-1.5 text-gray-300">·</span>
            {fmtM3(item.volumeM3 * qty)}
            <span className="mx-1.5 text-gray-300">·</span>
            {(item.pesoKg * qty).toFixed(0)} kg
          </p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Controle de quantidade */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-1 py-0.5">
            <button
              onClick={() => qty > 1 ? onQuantidadeChange(qty - 1) : onRemove()}
              title={qty > 1 ? t('decreaseQty') : t('removeItem')}
              className="w-5 h-5 flex items-center justify-center rounded text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors text-sm font-bold"
            >
              −
            </button>
            <span className="min-w-[1.5rem] text-center text-sm font-bold text-gray-800 tabular-nums">
              {qty}
            </span>
            <button
              onClick={() => onQuantidadeChange(qty + 1)}
              title={t('increaseQty')}
              className="w-5 h-5 flex items-center justify-center rounded text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors text-sm font-bold"
            >
              +
            </button>
          </div>

          <button
            onClick={() => setExpandido((v) => !v)}
            title={expandido ? t('collapseDetails') : t('viewDimensions')}
            className={cn(
              'p-1.5 rounded-lg text-xs transition-colors',
              expandido
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
            )}
          >
            {expandido ? '▲' : '▼'}
          </button>
          <button
            onClick={onRemove}
            title={t('removeItem')}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <IconX size={14} stroke={2} />
          </button>
        </div>
      </div>

      {/* Painel de detalhes */}
      {expandido && (
        <div className="px-4 pb-4 pt-3 border-t border-gray-100 bg-gray-50/80">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
            {t('dimensions')}
          </p>
          <div className="grid grid-cols-4 gap-2">
            <DimBox label={t('width')}   value={`${item.larguraCm} cm`} />
            <DimBox label={t('height')}  value={`${item.alturaCm} cm`} />
            <DimBox label={t('depth')}   value={`${item.profundidadeCm} cm`} />
            <DimBox label={t('weight')}  value={`${item.pesoKg} kg`} />
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-xs text-gray-500">
            <IconRuler size={16} stroke={1.5} className="text-gray-400" />
            <span>
              {t('unitVolume')}{' '}
              <span className="font-semibold text-gray-700">{item.volumeM3.toFixed(3)} m³</span>
              {qty > 1 && (
                <span className="text-[#E83500] font-semibold ml-2">
                  × {qty} = {(item.volumeM3 * qty).toFixed(3)} m³
                </span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Componente principal ────────────────────────────────────────────────────

interface ListaItensCanvasProps {
  itens: ItemPositionado[]
  onRemoveItem: (uid: string) => void
  onQuantidadeChange?: (uid: string, qty: number) => void
  limiteAtingido?: boolean
}

export function ListaItensCanvas({
  itens,
  onRemoveItem,
  onQuantidadeChange,
  limiteAtingido,
}: ListaItensCanvasProps) {
  const t = useTranslations('canvas')
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-area' })

  // ── Estado vazio: container com borda tracejada ──────────────────────────
  if (itens.length === 0) {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          'rounded-xl border-2 border-dashed transition-all duration-150 min-h-[420px]',
          'flex flex-col items-center justify-center gap-3 text-center',
          isOver ? 'border-blue-400 bg-blue-50/60' : 'border-gray-200 bg-gray-50/40'
        )}
      >
        <div className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors',
          isOver ? 'bg-blue-100' : 'bg-gray-100'
        )}>
          <IconPackage size={32} stroke={1.5} className={isOver ? 'text-blue-500' : 'text-gray-400'} />
        </div>
        <div>
          <p className={cn('text-sm font-semibold', isOver ? 'text-blue-600' : 'text-gray-500')}>
            {isOver ? t('dropHere') : t('emptyTitle')}
          </p>
          <p className="text-xs text-gray-400 mt-1">{t('emptySubtitle')}</p>
        </div>
      </div>
    )
  }

  // ── Com itens: grid direto no flex-1, sem wrapper com padding/border ─────
  // O ring-inset não ocupa espaço, mantendo a mesma largura que o grid de cotações.
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'transition-all duration-150 rounded-xl',
        isOver && 'ring-2 ring-blue-400 ring-inset bg-blue-50/30'
      )}
    >
      {/* Cabeçalho contador */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500">
          {t('itemsInMove', { count: itens.reduce((acc, i) => acc + (i.quantidade ?? 1), 0) })}
        </p>
        {isOver && (
          <span className="text-xs text-blue-600 font-medium animate-pulse">
            {t('dropToAdd')}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {itens.map((itemPos) => (
          <ItemCard
            key={itemPos.uid}
            itemPos={itemPos}
            onRemove={() => onRemoveItem(itemPos.uid)}
            onQuantidadeChange={(qty) => onQuantidadeChange?.(itemPos.uid, qty)}
          />
        ))}

        {isOver && (
          <div className="rounded-xl border-2 border-dashed border-blue-400 bg-blue-50 h-16 flex items-center justify-center">
            <span className="text-xs text-blue-500 font-medium">{t('addHere')}</span>
          </div>
        )}
      </div>

      {limiteAtingido && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-700 flex items-center gap-2">
          <IconAlertTriangle size={16} stroke={1.5} className="text-amber-600 flex-shrink-0" />
          <span>
            {t('limitReached')}{' '}
            <a href="/app/billing" className="font-semibold underline underline-offset-2">
              {t('subscribePro')}
            </a>
          </span>
        </div>
      )}
    </div>
  )
}
