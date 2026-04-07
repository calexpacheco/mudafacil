'use client'

import { useState } from 'react'
import {
  DragOverlay,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import type { CaminhaoInfo, ItemCatalogo, ItemPositionado } from '@/types/mudafacil'
import { cn } from '@/design-system/utils'

// ─── Constantes de escala ────────────────────────────────────────────────────
const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 340
const SCALE_FACTOR = 1.2 // px por cm (adaptado ao canvas)

function cmToPx(cm: number) {
  return Math.max(cm * SCALE_FACTOR, 32)
}

// ─── Item arrastável no canvas ───────────────────────────────────────────────
function ItemNoCanvas({
  itemPos,
  selected,
  onSelect,
}: {
  itemPos: ItemPositionado
  selected: boolean
  onSelect: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: itemPos.uid,
    data: { type: 'canvas-item', itemPos },
  })

  const w = cmToPx(itemPos.item.larguraCm)
  const h = cmToPx(itemPos.item.profundidadeCm)

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      style={{
        position: 'absolute',
        left: itemPos.x,
        top: itemPos.y,
        width: w,
        height: h,
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        opacity: isDragging ? 0.3 : 1,
        rotate: `${itemPos.rotacao}deg`,
        cursor: 'grab',
        zIndex: selected ? 10 : 1,
      }}
      className={cn(
        'rounded border-2 flex flex-col items-center justify-center text-[8px] font-medium select-none',
        selected ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-blue-300 bg-blue-50/70'
      )}
    >
      <span className="text-lg leading-none">{getEmoji(itemPos.item.categoria)}</span>
      <span className="text-center px-0.5 leading-tight line-clamp-2 text-gray-700">
        {itemPos.item.nome}
      </span>
    </div>
  )
}

function getEmoji(cat: string) {
  const map: Record<string, string> = {
    quarto: '🛏️',
    cozinha: '🍳',
    sala: '🛋️',
    escritorio: '💻',
    caixa: '📦',
  }
  return map[cat] ?? '📦'
}

// ─── Área droppable do caminhão ──────────────────────────────────────────────
function AreaCaminhao({ children, caminhao }: { children: React.ReactNode; caminhao: CaminhaoInfo }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-area' })

  return (
    <div
      ref={setNodeRef}
      style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      className={cn(
        'relative border-2 rounded-xl overflow-hidden transition-colors',
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
      )}
    >
      {/* Grade visual */}
      <svg className="absolute inset-0 opacity-20 pointer-events-none" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Label caminhão */}
      <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm text-xs font-semibold text-gray-500 px-2 py-1 rounded-full border border-gray-200">
        {caminhao.nome} • {caminhao.capacidadeM3}m³
      </div>

      {children}
    </div>
  )
}

// ─── Componente principal ────────────────────────────────────────────────────
interface CanvasCargaProps {
  caminhao: CaminhaoInfo
  itens: ItemPositionado[]
  onItensChange: (itens: ItemPositionado[]) => void
  onRemoveItem: (uid: string) => void
  limiteAtingido?: boolean
}

export function CanvasCarga({
  caminhao,
  itens,
  onItensChange,
  onRemoveItem,
  limiteAtingido,
}: CanvasCargaProps) {
  const [selectedUid, setSelectedUid] = useState<string | null>(null)
  const [draggingItem] = useState<ItemPositionado | null>(null)

  const rotateSelected = () => {
    if (!selectedUid) return
    const updated = itens.map((i) =>
      i.uid === selectedUid ? { ...i, rotacao: (i.rotacao + 90) % 360 } : i
    )
    onItensChange(updated)
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <AreaCaminhao caminhao={caminhao}>
          {itens.map((itemPos) => (
            <ItemNoCanvas
              key={itemPos.uid}
              itemPos={itemPos}
              selected={selectedUid === itemPos.uid}
              onSelect={() => setSelectedUid(itemPos.uid)}
            />
          ))}
          {/* Click fora deseleciona */}
          <div
            className="absolute inset-0 -z-0"
            onClick={() => setSelectedUid(null)}
          />
        </AreaCaminhao>

        {/* Toolbar */}
        {selectedUid && (
          <div className="flex gap-2">
            <button
              onClick={rotateSelected}
              className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              ↻ Girar 90°
            </button>
            <button
              onClick={() => { onRemoveItem(selectedUid); setSelectedUid(null) }}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
            >
              🗑 Remover
            </button>
          </div>
        )}

        {limiteAtingido && (
          <p className="text-xs text-amber-600 font-medium">
            ⚠️ Limite de itens atingido no plano Free. Faça upgrade para adicionar mais.
          </p>
        )}
      </div>

      <DragOverlay>
        {draggingItem && (
          <div className="rounded border-2 border-blue-500 bg-blue-100 opacity-80 p-2 text-xs font-medium shadow-xl">
            {draggingItem.item.nome}
          </div>
        )}
      </DragOverlay>
    </>
  )
}
