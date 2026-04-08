'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { CanvasCarga } from '@/components/canvas/CanvasCarga'
import { ResumoCanvasPanel } from '@/components/canvas/ResumoCanvas'
import { SeletorCaminhao } from '@/components/canvas/SeletorCaminhao'
import { CatalogoPainel } from '@/components/catalog/CatalogoPainel'
import { FiltrosCotacaoPainel } from '@/components/cotacoes/FiltrosCotacao'
import { CardCotacao } from '@/components/cotacoes/CardCotacao'
import { CAMINHOES } from '@/lib/caminhoes'
import { PLAN_LIMITS } from '@/lib/plan-limits'
import type { CaminhaoInfo, ItemPositionado, FiltrosCotacao, CotacaoCard } from '@/types/mudafacil'

const d = (days: number) => new Date(Date.now() + days * 86400000).toISOString()

const COTACOES_MOCK: CotacaoCard[] = [
  // ── Fiorino ──────────────────────────────────────────────────────────────
  {
    id: 'c1',
    transportadora: { id: 't1', nome: 'FreteFácil SP', notaMedia: 4.5, totalAvaliacoes: 143, cidade: 'São Paulo', logoUrl: undefined, tiposCaminhao: ['FIORINO'] },
    caminhao: CAMINHOES[0],
    precoCentavos: 32000,
    dataDisponivel: d(1),
    seguroIncluso: false,
    validade: d(6),
  },
  {
    id: 'c2',
    transportadora: { id: 't2', nome: 'Leve & Rápido', notaMedia: 4.1, totalAvaliacoes: 58, cidade: 'Guarulhos', logoUrl: undefined, tiposCaminhao: ['FIORINO', 'HR'] },
    caminhao: CAMINHOES[0],
    precoCentavos: 28500,
    dataDisponivel: d(3),
    seguroIncluso: false,
    validade: d(8),
  },

  // ── HR / Sprinter ─────────────────────────────────────────────────────────
  {
    id: 'c3',
    transportadora: { id: 't3', nome: 'MudaBR Express', notaMedia: 4.8, totalAvaliacoes: 312, cidade: 'São Paulo', logoUrl: undefined, tiposCaminhao: ['HR', 'TRES_QUARTOS'] },
    caminhao: CAMINHOES[1],
    precoCentavos: 89000,
    dataDisponivel: d(2),
    seguroIncluso: true,
    validade: d(7),
  },
  {
    id: 'c4',
    transportadora: { id: 't4', nome: 'Rápido Mudanças', notaMedia: 4.2, totalAvaliacoes: 87, cidade: 'São Paulo', logoUrl: undefined, tiposCaminhao: ['FIORINO', 'HR'] },
    caminhao: CAMINHOES[1],
    precoCentavos: 74000,
    dataDisponivel: d(5),
    seguroIncluso: false,
    validade: d(10),
  },
  {
    id: 'c5',
    transportadora: { id: 't5', nome: 'TransporteJá', notaMedia: 3.9, totalAvaliacoes: 34, cidade: 'Santo André', logoUrl: undefined, tiposCaminhao: ['HR'] },
    caminhao: CAMINHOES[1],
    precoCentavos: 65000,
    dataDisponivel: d(7),
    seguroIncluso: false,
    validade: d(12),
  },
  {
    id: 'c6',
    transportadora: { id: 't6', nome: 'Mudança Premium', notaMedia: 4.9, totalAvaliacoes: 521, cidade: 'São Paulo', logoUrl: undefined, tiposCaminhao: ['HR', 'TRES_QUARTOS', 'BAU'] },
    caminhao: CAMINHOES[1],
    precoCentavos: 97500,
    dataDisponivel: d(1),
    seguroIncluso: true,
    validade: d(5),
  },

  // ── 3/4 Truck ────────────────────────────────────────────────────────────
  {
    id: 'c7',
    transportadora: { id: 't7', nome: 'Mudança Segura', notaMedia: 4.6, totalAvaliacoes: 204, cidade: 'São Paulo', logoUrl: undefined, tiposCaminhao: ['TRES_QUARTOS', 'BAU'] },
    caminhao: CAMINHOES[2],
    precoCentavos: 135000,
    dataDisponivel: d(1),
    seguroIncluso: true,
    validade: d(5),
  },
  {
    id: 'c8',
    transportadora: { id: 't8', nome: 'Brasil Mudanças', notaMedia: 4.4, totalAvaliacoes: 176, cidade: 'Campinas', logoUrl: undefined, tiposCaminhao: ['TRES_QUARTOS'] },
    caminhao: CAMINHOES[2],
    precoCentavos: 118000,
    dataDisponivel: d(4),
    seguroIncluso: false,
    validade: d(9),
  },
  {
    id: 'c9',
    transportadora: { id: 't9', nome: 'Sul Frete & Mudança', notaMedia: 4.3, totalAvaliacoes: 92, cidade: 'São Bernardo', logoUrl: undefined, tiposCaminhao: ['HR', 'TRES_QUARTOS'] },
    caminhao: CAMINHOES[2],
    precoCentavos: 122000,
    dataDisponivel: d(2),
    seguroIncluso: true,
    validade: d(7),
  },

  // ── Baú ──────────────────────────────────────────────────────────────────
  {
    id: 'c10',
    transportadora: { id: 't10', nome: 'MegaMuda', notaMedia: 4.7, totalAvaliacoes: 389, cidade: 'São Paulo', logoUrl: undefined, tiposCaminhao: ['BAU'] },
    caminhao: CAMINHOES[3],
    precoCentavos: 198000,
    dataDisponivel: d(3),
    seguroIncluso: true,
    validade: d(7),
  },
  {
    id: 'c11',
    transportadora: { id: 't11', nome: 'Carrega Tudo', notaMedia: 4.0, totalAvaliacoes: 67, cidade: 'Osasco', logoUrl: undefined, tiposCaminhao: ['TRES_QUARTOS', 'BAU'] },
    caminhao: CAMINHOES[3],
    precoCentavos: 175000,
    dataDisponivel: d(6),
    seguroIncluso: false,
    validade: d(10),
  },
  {
    id: 'c12',
    transportadora: { id: 't12', nome: 'Logística Total', notaMedia: 4.5, totalAvaliacoes: 248, cidade: 'São Paulo', logoUrl: undefined, tiposCaminhao: ['BAU'] },
    caminhao: CAMINHOES[3],
    precoCentavos: 210000,
    dataDisponivel: d(2),
    seguroIncluso: true,
    validade: d(6),
  },
]

type PlanType = 'FREE' | 'TRIAL' | 'PRO'
type TabType = 'canvas' | 'cotacoes'
type ContratarStatus = 'idle' | 'loading' | 'success' | 'error'

interface CanvasEditorProps {
  mudancaId: string
  caminhaoInicial: CaminhaoInfo
  layoutInicial: { itensPositionados: unknown; ocupacaoPercentual: number } | null
  plan: PlanType
  filtrosAvancados: boolean
}

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 340
function cmToPx(cm: number) { return Math.max(cm * 1.2, 32) }

export function CanvasEditor({ mudancaId, caminhaoInicial, layoutInicial, plan, filtrosAvancados }: CanvasEditorProps) {
  const [tab, setTab] = useState<TabType>('canvas')
  const [caminhao, setCaminhao] = useState<CaminhaoInfo>(caminhaoInicial)
  const [filtros, setFiltros] = useState<FiltrosCotacao>({ ordenarPor: 'preco' })
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [contratarStatus, setContratarStatus] = useState<Record<string, ContratarStatus>>({})
  const [cotacaoContratadaId, setCotacaoContratadaId] = useState<string | null>(null)

  // Carrega layout salvo do banco
  const [itens, setItens] = useState<ItemPositionado[]>(() => {
    if (!layoutInicial?.itensPositionados) return []
    try {
      return layoutInicial.itensPositionados as ItemPositionado[]
    } catch { return [] }
  })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const limite = PLAN_LIMITS[plan].itensNoCanvas
  const limiteAtingido = typeof limite === 'number' && isFinite(limite) && itens.length >= limite

  // Calcula ocupação
  const ocupacaoPercentual = Math.min(
    (itens.reduce((acc, i) => acc + i.item.volumeM3, 0) / caminhao.capacidadeM3) * 100,
    100
  )

  // Auto-save com debounce de 1.5s
  const saveLayout = useCallback((itensAtual: ItemPositionado[], caminhaoAtual: CaminhaoInfo) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaveStatus('unsaved')
    saveTimer.current = setTimeout(async () => {
      setSaveStatus('saving')
      try {
        await fetch(`/api/mudancas/${mudancaId}/layout`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itensPositionados: itensAtual,
            caminhaoId: caminhaoAtual.id,
            ocupacaoPercentual: Math.min(
              (itensAtual.reduce((acc, i) => acc + i.item.volumeM3, 0) / caminhaoAtual.capacidadeM3) * 100,
              100
            ),
          }),
        })
        setSaveStatus('saved')
      } catch {
        setSaveStatus('unsaved')
      }
    }, 1500)
  }, [mudancaId])

  const handleRemoveItem = useCallback((uid: string) => {
    setItens((prev) => {
      const next = prev.filter((i) => i.uid !== uid)
      saveLayout(next, caminhao)
      return next
    })
  }, [caminhao, saveLayout])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta, over } = event
    if (!over || over.id !== 'canvas-area') return
    const data = active.data.current

    // Item vindo do catálogo → adiciona ao canvas
    if (data?.type === 'catalog-item') {
      if (limiteAtingido) return
      const novoItem: ItemPositionado = {
        itemId: data.item.id,
        item: data.item,
        x: Math.max(0, Math.min(delta.x + 100, CANVAS_WIDTH - cmToPx(data.item.larguraCm))),
        y: Math.max(0, Math.min(CANVAS_HEIGHT / 2, CANVAS_HEIGHT - cmToPx(data.item.profundidadeCm))),
        rotacao: 0,
        uid: `${data.item.id}-${Date.now()}`,
      }
      setItens((prev) => {
        const next = [...prev, novoItem]
        saveLayout(next, caminhao)
        return next
      })
      return
    }

    // Item já no canvas → reposiciona
    if (data?.type === 'canvas-item') {
      const itemPos = data.itemPos as ItemPositionado
      setItens((prev) => {
        const next = prev.map((i) => {
          if (i.uid !== itemPos.uid) return i
          return {
            ...i,
            x: Math.max(0, Math.min(i.x + delta.x, CANVAS_WIDTH - cmToPx(i.item.larguraCm))),
            y: Math.max(0, Math.min(i.y + delta.y, CANVAS_HEIGHT - cmToPx(i.item.profundidadeCm))),
          }
        })
        saveLayout(next, caminhao)
        return next
      })
    }
  }, [itens, limiteAtingido, caminhao, saveLayout])

  const cotacoesFiltradas = COTACOES_MOCK
    .filter((c) => {
      if (filtros.precoMax && c.precoCentavos > filtros.precoMax * 100) return false
      if (filtros.notaMin && c.transportadora.notaMedia < filtros.notaMin) return false
      if (filtros.seguroIncluso && !c.seguroIncluso) return false
      if (filtros.tipoCaminhao && c.caminhao.tipo !== filtros.tipoCaminhao) return false
      return true
    })
    .sort((a, b) => {
      if (filtros.ordenarPor === 'preco') return a.precoCentavos - b.precoCentavos
      if (filtros.ordenarPor === 'nota') return b.transportadora.notaMedia - a.transportadora.notaMedia
      return new Date(a.dataDisponivel).getTime() - new Date(b.dataDisponivel).getTime()
    })

  const handleCaminhaoChange = (novo: CaminhaoInfo) => {
    setCaminhao(novo)
    saveLayout(itens, novo)
  }

  const handleContratar = useCallback(async (cotacao: CotacaoCard) => {
    setContratarStatus((prev) => ({ ...prev, [cotacao.id]: 'loading' }))
    try {
      const res = await fetch(`/api/mudancas/${mudancaId}/contratar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cotacaoId: cotacao.id,
          nomeTransportadora: cotacao.transportadora.nome,
          precoCentavos: cotacao.precoCentavos,
          caminhaoTipo: cotacao.caminhao.tipo,   // tipo enum, não o ID mock
          dataDisponivel: cotacao.dataDisponivel,
          seguroIncluso: cotacao.seguroIncluso,
          validade: cotacao.validade,
        }),
      })
      if (!res.ok) throw new Error('Erro ao contratar')
      setCotacaoContratadaId(cotacao.id)
      setContratarStatus((prev) => ({ ...prev, [cotacao.id]: 'success' }))
      // Atualiza o caminhão no canvas para o da cotação contratada
      const caminhaoContratado = CAMINHOES.find((c) => c.id === cotacao.caminhao.id)
      if (caminhaoContratado) handleCaminhaoChange(caminhaoContratado)
    } catch {
      setContratarStatus((prev) => ({ ...prev, [cotacao.id]: 'error' }))
      setTimeout(() => setContratarStatus((prev) => ({ ...prev, [cotacao.id]: 'idle' })), 3000)
    }
  }, [mudancaId, handleCaminhaoChange])

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs + status de save */}
      <div className="flex items-center justify-between">
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {(['canvas', 'cotacoes'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'canvas' ? '📦 Canvas de Carga' : '💰 Cotações'}
          </button>
        ))}
      </div>
      <span className="text-xs text-gray-400">
        {saveStatus === 'saving' && '⏳ Salvando...'}
        {saveStatus === 'saved' && '✅ Salvo'}
        {saveStatus === 'unsaved' && '○ Não salvo'}
      </span>
      </div>

      {tab === 'canvas' && (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 items-start">
            <aside className="w-56 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">📚 Catálogo</h2>
                <CatalogoPainel />
              </div>
            </aside>

            <div className="flex-1 flex flex-col gap-4">
              <SeletorCaminhao selecionado={caminhao} onSelecionar={handleCaminhaoChange} itens={itens} />
              <CanvasCarga
                caminhao={caminhao}
                itens={itens}
                onItensChange={(next) => { setItens(next); saveLayout(next, caminhao) }}
                onRemoveItem={handleRemoveItem}
                limiteAtingido={limiteAtingido}
              />
            </div>

            <ResumoCanvasPanel caminhao={caminhao} itens={itens} />
          </div>
        </DndContext>
      )}

      {tab === 'cotacoes' && (
        <div className="flex gap-4 items-start">
          <aside className="w-64 flex-shrink-0">
            <FiltrosCotacaoPainel
              filtros={filtros}
              onChange={setFiltros}
              filtrosAvancados={filtrosAvancados}
            />
          </aside>

          <div className="flex-1">
            {cotacoesFiltradas.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-sm">Nenhuma cotação encontrada com esses filtros</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cotacoesFiltradas.slice(0, plan === 'FREE' ? 3 : undefined).map((cotacao) => (
                  <CardCotacao
                    key={cotacao.id}
                    cotacao={cotacao}
                    contratada={cotacaoContratadaId === cotacao.id}
                    contratarStatus={contratarStatus[cotacao.id] ?? 'idle'}
                    onContratar={handleContratar}
                  />
                ))}
              </div>
            )}

            {plan === 'FREE' && COTACOES_MOCK.length > 3 && (
              <div className="mt-4 rounded-xl border border-dashed border-blue-200 bg-blue-50 p-6 text-center">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  +{COTACOES_MOCK.length - 3} cotações disponíveis
                </p>
                <p className="text-xs text-gray-500 mb-3">Assine PRO para ver todas as cotações</p>
                <a
                  href="/settings/billing"
                  className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  Assinar PRO
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
