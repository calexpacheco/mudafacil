'use client'

import type { CaminhaoInfo, ItemPositionado, ResumoCanvas } from '@/types/mudafacil'
import { cn } from '@/design-system/utils'

interface ResumoCanvasProps {
  caminhao: CaminhaoInfo
  itens: ItemPositionado[]
}

function calcularResumo(caminhao: CaminhaoInfo, itens: ItemPositionado[]): ResumoCanvas {
  const volumeTotal = itens.reduce((acc, i) => acc + i.item.volumeM3, 0)
  const pesoTotal = itens.reduce((acc, i) => acc + i.item.pesoKg, 0)
  const ocupacaoPercentual = Math.min((volumeTotal / caminhao.capacidadeM3) * 100, 100)
  const acimaDaCapacidade =
    volumeTotal > caminhao.capacidadeM3 || pesoTotal > caminhao.capacidadeKg

  return { volumeTotal, pesoTotal, ocupacaoPercentual, acimaDaCapacidade }
}

export function ResumoCanvasPanel({ caminhao, itens }: ResumoCanvasProps) {
  const resumo = calcularResumo(caminhao, itens)

  const barColor =
    resumo.ocupacaoPercentual > 90
      ? 'bg-red-500'
      : resumo.ocupacaoPercentual > 70
        ? 'bg-amber-500'
        : 'bg-blue-600'

  return (
    <aside className="flex flex-col gap-4 p-4 rounded-xl border border-gray-200 bg-white min-w-[200px]">
      <h3 className="font-semibold text-gray-900 text-sm">Resumo da Carga</h3>

      <div className="flex flex-col gap-3">
        <StatRow label="Volume total" value={`${resumo.volumeTotal.toFixed(2)} m³`} />
        <StatRow label="Peso estimado" value={`${resumo.pesoTotal.toFixed(0)} kg`} />
        <StatRow label="Capacidade do caminhão" value={`${caminhao.capacidadeM3} m³`} />
        <StatRow label="Itens no canvas" value={itens.length.toString()} />
      </div>

      {/* Barra de ocupação */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Ocupação</span>
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
          ⚠️ Carga acima da capacidade! Considere um caminhão maior.
        </div>
      )}

      {resumo.ocupacaoPercentual < 40 && itens.length > 0 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
          💡 O caminhão está subutilizado. Você pode economizar com um modelo menor.
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
