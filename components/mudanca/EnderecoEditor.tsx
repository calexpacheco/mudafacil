'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { IconAlertTriangle, IconCheck, IconPencil } from '@tabler/icons-react'

interface EnderecoEditorProps {
  mudancaId: string
  enderecoOrigem: string
  enderecoDestino: string
}

type SaveState = 'idle' | 'saving' | 'success' | 'error'

export function EnderecoEditor({
  mudancaId,
  enderecoOrigem,
  enderecoDestino,
}: EnderecoEditorProps) {
  const router = useRouter()
  const [editando, setEditando] = useState(false)
  const [origem, setOrigem] = useState(enderecoOrigem)
  const [destino, setDestino] = useState(enderecoDestino)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [cotacoesResetadas, setCotacoesResetadas] = useState(false)
  const origemRef = useRef<HTMLInputElement>(null)

  function abrirEdicao() {
    setOrigem(enderecoOrigem)
    setDestino(enderecoDestino)
    setSaveState('idle')
    setCotacoesResetadas(false)
    setEditando(true)
    setTimeout(() => origemRef.current?.focus(), 0)
  }

  function cancelar() {
    setEditando(false)
    setSaveState('idle')
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()

    const origemTrim = origem.trim()
    const destinoTrim = destino.trim()

    if (!origemTrim || !destinoTrim) return
    if (origemTrim === enderecoOrigem && destinoTrim === enderecoDestino) {
      setEditando(false)
      return
    }

    setSaveState('saving')

    try {
      const res = await fetch(`/api/mudancas/${mudancaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enderecoOrigem: origemTrim,
          enderecoDestino: destinoTrim,
        }),
      })

      if (!res.ok) {
        setSaveState('error')
        return
      }

      const data = await res.json()
      setSaveState('success')
      setEditando(false)

      if (data.enderecoChanged) {
        setCotacoesResetadas(true)
      }

      // Recarrega a página para refletir novos endereços e estado
      router.refresh()
    } catch {
      setSaveState('error')
    }
  }

  if (editando) {
    return (
      <form onSubmit={salvar} className="flex flex-col gap-2">
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
          <IconAlertTriangle size={14} stroke={1.5} className="text-amber-600 flex-shrink-0" />
          Alterar os endereços vai <strong>resetar as cotações</strong> desta mudança.
        </p>

        {/* Endereço A */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            A
          </div>
          <input
            ref={origemRef}
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            placeholder="Endereço de origem"
            required
            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
          />
        </div>

        {/* Seta */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-4 border-l-2 border-dashed border-gray-300 h-4 ml-1" />
        </div>

        {/* Endereço B */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            B
          </div>
          <input
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            placeholder="Endereço de destino"
            required
            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
          />
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2 mt-1">
          <button
            type="submit"
            disabled={saveState === 'saving'}
            className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 flex items-center gap-1.5 transition-colors"
          >
            {saveState === 'saving' ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar endereços'
            )}
          </button>
          <button
            type="button"
            onClick={cancelar}
            className="px-3 py-1.5 rounded-lg text-gray-500 text-sm hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          {saveState === 'error' && (
            <span className="text-xs text-red-600 flex items-center gap-1">
              <IconAlertTriangle size={12} stroke={2} className="text-red-600" />
              Erro ao salvar. Tente novamente.
            </span>
          )}
        </div>
      </form>
    )
  }

  return (
    <div className="flex flex-col gap-1 group">
      {cotacoesResetadas && (
        <p className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-1 flex items-center gap-1.5">
          <IconCheck size={14} stroke={2} className="text-blue-600 flex-shrink-0" />
          Endereços atualizados. Cotações resetadas — solicite novas cotações.
        </p>
      )}

      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {/* Origem */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
              A
            </div>
            <span className="text-base font-bold text-gray-900 truncate">{enderecoOrigem}</span>
          </div>

          <div className="flex items-center gap-2 pl-0.5">
            <div className="w-4 flex justify-center">
              <div className="w-0 border-l-2 border-dashed border-gray-300 h-3" />
            </div>
            <span className="text-gray-400 text-xs">→</span>
          </div>

          {/* Destino */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
              B
            </div>
            <span className="text-base font-bold text-gray-900 truncate">{enderecoDestino}</span>
          </div>
        </div>

        {/* Botão de editar */}
        <button
          onClick={abrirEdicao}
          title="Editar endereços"
          className="opacity-0 group-hover:opacity-100 mt-0.5 p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex-shrink-0"
        >
          <IconPencil size={16} stroke={1.5} />
        </button>
      </div>
    </div>
  )
}
