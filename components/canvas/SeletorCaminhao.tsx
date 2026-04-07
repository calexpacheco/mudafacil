'use client'

import { CAMINHOES, CAMINHAO_CORES } from '@/lib/caminhoes'
import type { CaminhaoInfo, ItemPositionado } from '@/types/mudafacil'
import { cn } from '@/design-system/utils'

interface SeletorCaminhaoProps {
  selecionado: CaminhaoInfo
  onSelecionar: (caminhao: CaminhaoInfo) => void
  itens: ItemPositionado[]
}

export function SeletorCaminhao({ selecionado, onSelecionar, itens }: SeletorCaminhaoProps) {
  const volumeTotal = itens.reduce((acc, i) => acc + i.item.volumeM3, 0)
  const pesoTotal = itens.reduce((acc, i) => acc + i.item.pesoKg, 0)

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-700">Selecionar Caminhão</h3>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {CAMINHOES.map((caminhao) => {
          const ocupacaoVol = Math.min((volumeTotal / caminhao.capacidadeM3) * 100, 100)
          const ocupacaoPeso = Math.min((pesoTotal / caminhao.capacidadeKg) * 100, 100)
          const ocupacao = Math.max(ocupacaoVol, ocupacaoPeso)
          const acima = volumeTotal > caminhao.capacidadeM3 || pesoTotal > caminhao.capacidadeKg
          const isSelected = selecionado.id === caminhao.id
          const cor = CAMINHAO_CORES[caminhao.tipo]

          return (
            <button
              key={caminhao.id}
              onClick={() => onSelecionar(caminhao)}
              className={cn(
                'flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all hover:shadow-md',
                isSelected ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-blue-300'
              )}
            >
              {/* Ícone caminhão */}
              <div
                className="text-2xl mb-1 w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${cor}15` }}
              >
                <TruckIcon tipo={caminhao.tipo} cor={cor} />
              </div>

              <span className="font-semibold text-sm text-gray-900">{caminhao.nome}</span>
              <span className="text-xs text-gray-500">{caminhao.capacidadeM3}m³ · {caminhao.capacidadeKg}kg</span>

              {/* Barra de ocupação em tempo real */}
              <div className="w-full mt-2">
                <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                  <span>Ocupação</span>
                  <span className={acima ? 'text-red-500 font-bold' : ''}>{ocupacao.toFixed(0)}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      acima ? 'bg-red-500' : ocupacao > 70 ? 'bg-amber-500' : 'bg-green-500'
                    )}
                    style={{ width: `${Math.min(ocupacao, 100)}%` }}
                  />
                </div>
              </div>

              {acima && (
                <span className="text-[10px] text-red-500 font-medium mt-1">Acima da cap.</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TruckIcon({ tipo, cor }: { tipo: string; cor: string }) {
  const labels: Record<string, string> = {
    FIORINO: '🚐',
    HR: '🚚',
    TRES_QUARTOS: '🚛',
    BAU: '🏗️',
  }
  return <span style={{ color: cor }}>{labels[tipo] ?? '🚚'}</span>
}
