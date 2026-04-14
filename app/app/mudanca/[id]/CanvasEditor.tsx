'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { ListaItensCanvas } from '@/components/canvas/ListaItensCanvas'
import { ResumoBar } from '@/components/canvas/ResumoCanvas'
import { SeletorCaminhao } from '@/components/canvas/SeletorCaminhao'
import { CatalogoPainel } from '@/components/catalog/CatalogoPainel'
import { FiltrosCotacaoPainel } from '@/components/cotacoes/FiltrosCotacao'
import { CardCotacao } from '@/components/cotacoes/CardCotacao'
import { CAMINHOES } from '@/lib/caminhoes'
import { PLAN_LIMITS } from '@/lib/plan-limits'
import type { CaminhaoInfo, ItemCatalogo, ItemPositionado, FiltrosCotacao, CotacaoCard } from '@/types/mudafacil'
import { IconTruck, IconBooks, IconPackage, IconSearch, IconCheck, IconAlertTriangle, IconChevronDown, IconAdjustments, IconPlus, IconTrash } from '@tabler/icons-react'
import { toast } from 'sonner'
import { NovaMudancaModal } from '@/components/ui/NovaMudancaModal'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'

// ─── Preço dinâmico das cotações ─────────────────────────────────────────────
// Ajusta o preço base de cada cotação conforme volume atual, nº de caminhões e urgência.

function calcularPrecoDinamico(
  precoBase: number,
  volumeTotal: number,
  caminhao: CaminhaoInfo,
  quantidadeCaminhoes: number,
  dataDesejada: string | null,
): number {
  if (volumeTotal === 0) return Math.round(precoBase * 0.3)

  // Quantos caminhões desse tipo seriam necessários
  const qtdNecessaria = Math.max(1, Math.ceil(volumeTotal / caminhao.capacidadeM3))
  const qtdEfetiva = Math.max(qtdNecessaria, quantidadeCaminhoes)

  // Fator de ocupação do último caminhão (evita cobrar 100% por 1% de uso)
  const volUltimoCaminhao = volumeTotal - (qtdEfetiva - 1) * caminhao.capacidadeM3
  const ocupacaoUltimo = Math.min(1, Math.max(0.35, volUltimoCaminhao / caminhao.capacidadeM3))
  const fatorVolume = (qtdEfetiva - 1) + ocupacaoUltimo

  // Fator urgência baseado em dias até a data
  let fatorUrgencia = 1.0
  if (dataDesejada) {
    const dias = Math.max(0, (new Date(dataDesejada).getTime() - Date.now()) / 86_400_000)
    if (dias < 3)       fatorUrgencia = 1.30
    else if (dias < 7)  fatorUrgencia = 1.15
    else if (dias < 14) fatorUrgencia = 1.05
    else if (dias > 30) fatorUrgencia = 0.97
  }

  return Math.round(precoBase * fatorVolume * fatorUrgencia)
}

// ─── Preview visual do item sendo arrastado ──────────────────────────────────

const CATEGORIA_COR: Record<string, string> = {
  quarto:     'bg-violet-500',
  cozinha:    'bg-orange-500',
  sala:       'bg-emerald-500',
  escritorio: 'bg-blue-500',
  caixa:      'bg-amber-400',
}

function DragPreviewCard({ item }: { item: ItemCatalogo }) {
  const t = useTranslations('app.categories')
  const cor = CATEGORIA_COR[item.categoria] ?? 'bg-gray-400'
  const cat = t(item.categoria as Parameters<typeof t>[0]) ?? item.categoria
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border-2 border-blue-400 shadow-2xl w-72 cursor-grabbing rotate-2 opacity-95">
      <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm text-white ${cor}`}>
        {item.nome.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{item.nome}</p>
        <p className="text-xs text-gray-400">
          {cat} · {item.volumeM3.toFixed(2)} m³ · {item.pesoKg} kg
        </p>
      </div>
    </div>
  )
}

// ─── Banner de empresa contratada ────────────────────────────────────────────

interface CotacaoContratadaInfo {
  nomeTransportadora: string
  precoCentavos: number          // preço original contratado
  precoAtualCentavos?: number    // preço estimado com condições atuais
  dataDisponivel: string | null
  nomeVeiculo: string | null
  tipoVeiculo: string | null
  seguroIncluso: boolean
}

// Truck sizes by vehicle type
const VEICULO_TAMANHO: Record<string, number> = {
  FIORINO: 20, HR: 22, TRES_QUARTOS: 24, BAU: 26,
}

function EmpresaContratadaBanner({ info, onAceitarPreco }: { info: CotacaoContratadaInfo; onAceitarPreco?: (novoPreco: number) => void }) {
  const t = useTranslations('canvasEditor')
  const fmt = (c: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c / 100)

  const precoAtual = info.precoAtualCentavos
  const diff = precoAtual !== undefined ? precoAtual - info.precoCentavos : 0
  const diffPct = info.precoCentavos > 0 ? Math.round((diff / info.precoCentavos) * 100) : 0
  const condicoesAlteradas = Math.abs(diffPct) >= 5

  const dataFmt = info.dataDisponivel
    ? new Date(info.dataDisponivel).toLocaleDateString('pt-BR', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
      })
    : null

  const veiculoTamanho = info.tipoVeiculo ? (VEICULO_TAMANHO[info.tipoVeiculo] ?? 24) : 24

  return (
    <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 flex flex-wrap items-center gap-x-8 gap-y-3">
      {/* Empresa */}
      <div className="flex items-center gap-3 flex-1 min-w-[180px]">
        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
          {info.nomeTransportadora.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-[10px] font-semibold text-green-700 uppercase tracking-wide">{t('contractedCompany')}</p>
          <p className="text-sm font-bold text-gray-900 leading-tight">{info.nomeTransportadora}</p>
        </div>
      </div>

      <div className="w-px h-10 bg-green-200 hidden sm:block" />

      {/* Valor */}
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold text-green-700 uppercase tracking-wide">{t('contractedValue')}</span>
        <span className="text-lg font-bold text-green-700 leading-tight">{fmt(info.precoCentavos)}</span>
        {info.seguroIncluso && (
          <span className="text-[10px] text-green-600 flex items-center gap-0.5">
            <IconCheck size={10} stroke={2} className="text-green-600" /> {t('insuranceIncluded')}
          </span>
        )}
        {condicoesAlteradas && precoAtual !== undefined && (
          <span className={`text-[10px] font-semibold flex items-center gap-1 mt-0.5 ${diff > 0 ? 'text-amber-600' : 'text-blue-600'}`}>
            <IconAlertTriangle size={10} stroke={2} />
            {t('currentEstimate', { price: fmt(precoAtual), diff: `${diff > 0 ? '+' : ''}${diffPct}` })}
            {onAceitarPreco && (
              <button
                onClick={() => onAceitarPreco(precoAtual)}
                title={t('acceptPriceTitle')}
                className="ml-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-green-100 hover:bg-green-200 text-green-700 text-[10px] font-bold transition-colors cursor-pointer border border-green-300"
              >
                <IconCheck size={10} stroke={2.5} /> {t('acceptPrice')}
              </button>
            )}
          </span>
        )}
      </div>

      <div className="w-px h-10 bg-green-200 hidden sm:block" />

      {/* Data */}
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold text-green-700 uppercase tracking-wide">{t('scheduledDate')}</span>
        <span className="text-sm font-semibold text-gray-800 leading-tight capitalize">
          {dataFmt ?? '—'}
        </span>
      </div>

      <div className="w-px h-10 bg-green-200 hidden sm:block" />

      {/* Veículo */}
      <div className="flex items-center gap-2">
        <IconTruck size={veiculoTamanho} stroke={1.5} className="text-green-700" />
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-green-700 uppercase tracking-wide">{t('vehicle')}</span>
          <span className="text-sm font-semibold text-gray-800 leading-tight">
            {info.nomeVeiculo ?? '—'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Mock de cotações ─────────────────────────────────────────────────────────

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

// ─── Speed Dial action button ─────────────────────────────────────────────────

function SpeedDialAction({
  label, icon, open, delay, color, onClick,
}: {
  label: string
  icon: React.ReactNode
  open: boolean
  delay: number
  color: string
  onClick: () => void
}) {
  return (
    <div
      className="flex items-center gap-3 justify-end"
      style={{
        transition: `opacity 200ms ${delay}ms, transform 200ms ${delay}ms`,
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.85)',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <span className="bg-gray-900/80 text-white text-xs font-medium px-2.5 py-1 rounded-lg shadow">
        {label}
      </span>
      <button
        onClick={onClick}
        className={`w-12 h-12 rounded-full ${color} text-white shadow-lg flex items-center justify-center active:scale-90 cursor-pointer transition-transform`}
      >
        {icon}
      </button>
    </div>
  )
}

type PlanType = 'FREE' | 'TRIAL' | 'PRO'
type TabType = 'canvas' | 'cotacoes'
type ContratarStatus = 'idle' | 'loading' | 'success' | 'error'

interface CanvasEditorProps {
  mudancaId: string
  caminhaoInicial: CaminhaoInfo
  layoutInicial: { itensPositionados: unknown; ocupacaoPercentual: number } | null
  plan: PlanType
  filtrosAvancados: boolean
  dataDesejadaInicial?: string | null
  cotacaoContratadaInicial?: CotacaoContratadaInfo | null
}


export function CanvasEditor({ mudancaId, caminhaoInicial, layoutInicial, plan, filtrosAvancados, dataDesejadaInicial = null, cotacaoContratadaInicial = null }: CanvasEditorProps) {
  const t = useTranslations('canvasEditor')
  const [tab, setTab] = useState<TabType>('canvas')
  const [caminhao, setCaminhao] = useState<CaminhaoInfo>(caminhaoInicial)
  const [filtros, setFiltros] = useState<FiltrosCotacao>({ ordenarPor: 'preco' })
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [contratarStatus, setContratarStatus] = useState<Record<string, ContratarStatus>>({})
  const [cotacaoContratadaId, setCotacaoContratadaId] = useState<string | null>(null)
  // Informações da empresa contratada (populada do servidor ou ao contratar)
  const [cotacaoInfo, setCotacaoInfo] = useState<CotacaoContratadaInfo | null>(cotacaoContratadaInicial)

  // Carrega layout salvo do banco — suporta formato antigo (array) e novo ({ items, quantidadeCaminhoes })
  const [itens, setItens] = useState<ItemPositionado[]>(() => {
    if (!layoutInicial?.itensPositionados) return []
    try {
      const data = layoutInicial.itensPositionados as unknown
      return Array.isArray(data) ? data : ((data as { items?: ItemPositionado[] }).items ?? [])
    } catch { return [] }
  })

  // Data desejada para a mudança
  const [dataDesejada, setDataDesejada] = useState<string>(
    dataDesejadaInicial
      ? new Date(dataDesejadaInicial).toISOString().split('T')[0]
      : ''
  )
  const dataSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleDataChange = useCallback((novaData: string) => {
    setDataDesejada(novaData)
    if (dataSaveTimer.current) clearTimeout(dataSaveTimer.current)
    dataSaveTimer.current = setTimeout(async () => {
      await fetch(`/api/mudancas/${mudancaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataDesejada: novaData || null }),
      })
    }, 1000)
  }, [mudancaId])

  const [quantidadeCaminhoes, setQuantidadeCaminhoes] = useState<number>(() => {
    if (!layoutInicial?.itensPositionados) return 1
    try {
      const data = layoutInicial.itensPositionados as unknown
      return Array.isArray(data) ? 1 : ((data as { quantidadeCaminhoes?: number }).quantidadeCaminhoes ?? 1)
    } catch { return 1 }
  })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  // Item sendo arrastado agora (para o DragOverlay)
  const [activeItem, setActiveItem] = useState<ItemCatalogo | null>(null)

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current
    if (data?.type === 'catalog-item') {
      setActiveItem(data.item as ItemCatalogo)
    }
  }, [])

  const handleDragCancel = useCallback(() => {
    setActiveItem(null)
  }, [])

  const limite = PLAN_LIMITS[plan].itensNoCanvas
  const limiteAtingido = typeof limite === 'number' && isFinite(limite) && itens.length >= limite

  // Volume total (usado em ocupação e pricing)
  const volumeTotal = itens.reduce((acc, i) => acc + i.item.volumeM3 * (i.quantidade ?? 1), 0)

  // Calcula ocupação (considera quantidade de cada item e número de caminhões)
  const ocupacaoPercentual = Math.min(
    (volumeTotal / (caminhao.capacidadeM3 * quantidadeCaminhoes)) * 100,
    100
  )

  // Auto-save com debounce de 1.5s
  const saveLayout = useCallback((
    itensAtual: ItemPositionado[],
    caminhaoAtual: CaminhaoInfo,
    qtdCaminhoes: number,
  ) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaveStatus('unsaved')
    saveTimer.current = setTimeout(async () => {
      setSaveStatus('saving')
      try {
        const volTotal = itensAtual.reduce((acc, i) => acc + i.item.volumeM3 * (i.quantidade ?? 1), 0)
        const capTotal = caminhaoAtual.capacidadeM3 * qtdCaminhoes
        await fetch(`/api/mudancas/${mudancaId}/layout`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itensPositionados: { items: itensAtual, quantidadeCaminhoes: qtdCaminhoes },
            caminhaoId: caminhaoAtual.id,
            ocupacaoPercentual: Math.min((volTotal / capTotal) * 100, 100),
          }),
        })
        setSaveStatus('saved')
      } catch {
        setSaveStatus('unsaved')
      }
    }, 1500)
  }, [mudancaId])

  // ── Seleção automática de veículo ───────────────────────────────────────────
  // Sempre escolhe o menor veículo que comporta os itens.
  // Chamado em qualquer mudança de itens (add, remove, quantidade).
  const autoSelecionarVeiculo = useCallback((
    novosItens: ItemPositionado[],
  ): { caminhao: CaminhaoInfo; quantidade: number } => {
    const volTotal  = novosItens.reduce((acc, i) => acc + i.item.volumeM3 * (i.quantidade ?? 1), 0)
    const pesoTotal = novosItens.reduce((acc, i) => acc + i.item.pesoKg   * (i.quantidade ?? 1), 0)

    // Canvas vazio → menor veículo
    if (novosItens.length === 0 || volTotal === 0) {
      return { caminhao: CAMINHOES[0], quantidade: 1 }
    }

    // Menor veículo único que comporta tudo
    for (const c of CAMINHOES) {
      if (c.capacidadeM3 >= volTotal && c.capacidadeKg >= pesoTotal) {
        return { caminhao: c, quantidade: 1 }
      }
    }

    // Precisa de múltiplos Baú
    const bau = CAMINHOES[CAMINHOES.length - 1]
    const qtdNec = Math.ceil(Math.max(volTotal / bau.capacidadeM3, pesoTotal / bau.capacidadeKg))
    return { caminhao: bau, quantidade: qtdNec }
  }, [])

  const handleRemoveItem = useCallback((uid: string) => {
    setItens((prev) => {
      const next = prev.filter((i) => i.uid !== uid)
      const { caminhao: novoCaminhao, quantidade: novaQtd } = autoSelecionarVeiculo(next)
      setCaminhao(novoCaminhao)
      setQuantidadeCaminhoes(novaQtd)
      saveLayout(next, novoCaminhao, novaQtd)
      return next
    })
  }, [autoSelecionarVeiculo, saveLayout])

  const handleQuantidadeChange = useCallback((uid: string, qty: number) => {
    setItens((prev) => {
      const next = prev.map((i) => i.uid === uid ? { ...i, quantidade: Math.max(1, qty) } : i)
      const { caminhao: novoCaminhao, quantidade: novaQtd } = autoSelecionarVeiculo(next)
      setCaminhao(novoCaminhao)
      setQuantidadeCaminhoes(novaQtd)
      saveLayout(next, novoCaminhao, novaQtd)
      return next
    })
  }, [autoSelecionarVeiculo, saveLayout])

  const handleQuantidadeCaminhoesChange = useCallback((qty: number) => {
    const novaQtd = Math.max(1, qty)
    setQuantidadeCaminhoes(novaQtd)
    saveLayout(itens, caminhao, novaQtd)
  }, [itens, caminhao, saveLayout])

  // Adiciona item direto (mobile tap ou qualquer clique no +)
  const handleAddItemDirect = useCallback((itemCatalogo: ItemCatalogo) => {
    if (limiteAtingido) {
      toast.error(t('limitReached'))
      return
    }
    const novoItem: ItemPositionado = {
      itemId: itemCatalogo.id,
      item: itemCatalogo,
      x: 0,
      y: itens.length * 60,
      rotacao: 0,
      uid: `${itemCatalogo.id}-${Date.now()}`,
      quantidade: 1,
    }
    setItens((prev) => {
      const next = [...prev, novoItem]
      const { caminhao: novoCaminhao, quantidade: novaQtd } = autoSelecionarVeiculo(next)
      setCaminhao(novoCaminhao)
      setQuantidadeCaminhoes(novaQtd)
      saveLayout(next, novoCaminhao, novaQtd)
      return next
    })
    toast.success(t('itemAdded', { name: itemCatalogo.nome }), { duration: 1500 })
  }, [itens, limiteAtingido, autoSelecionarVeiculo, saveLayout])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveItem(null)
    const { active, over } = event
    if (!over || over.id !== 'canvas-area') return
    const data = active.data.current

    // Item vindo do catálogo → adiciona à lista
    if (data?.type === 'catalog-item') {
      handleAddItemDirect(data.item as ItemCatalogo)
    }
  }, [handleAddItemDirect])

  // Cotações com preços recalculados conforme condições atuais
  const cotacoesDinamicas = useMemo(() =>
    COTACOES_MOCK.map((c) => ({
      ...c,
      precoCentavos: calcularPrecoDinamico(
        c.precoCentavos,
        volumeTotal,
        c.caminhao,
        quantidadeCaminhoes,
        dataDesejada || null,
      ),
    })),
    [volumeTotal, quantidadeCaminhoes, dataDesejada]
  )

  // Preço estimado atual da cotação contratada (se houver)
  const cotacaoContratadaComPrecoAtual = useMemo(() => {
    if (!cotacaoInfo) return null
    const cotacaoOriginal = COTACOES_MOCK.find((c) =>
      c.transportadora.nome === cotacaoInfo.nomeTransportadora
    )
    if (!cotacaoOriginal) return cotacaoInfo
    return {
      ...cotacaoInfo,
      precoAtualCentavos: calcularPrecoDinamico(
        cotacaoOriginal.precoCentavos,
        volumeTotal,
        cotacaoOriginal.caminhao,
        quantidadeCaminhoes,
        dataDesejada || null,
      ),
    }
  }, [cotacaoInfo, volumeTotal, quantidadeCaminhoes, dataDesejada])

  const cotacoesFiltradas = cotacoesDinamicas
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
    setQuantidadeCaminhoes(1) // reset para 1 ao trocar de tipo manualmente
    saveLayout(itens, novo, 1)
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
      const caminhaoContratado = CAMINHOES.find((c) => c.tipo === cotacao.caminhao.tipo)
      if (caminhaoContratado) handleCaminhaoChange(caminhaoContratado)
      // Salva infos da empresa contratada para exibir no banner
      setCotacaoInfo({
        nomeTransportadora: cotacao.transportadora.nome,
        precoCentavos:      cotacao.precoCentavos,
        dataDisponivel:     cotacao.dataDisponivel,
        nomeVeiculo:        cotacao.caminhao.nome,
        tipoVeiculo:        cotacao.caminhao.tipo,
        seguroIncluso:      cotacao.seguroIncluso,
      })
    } catch {
      setContratarStatus((prev) => ({ ...prev, [cotacao.id]: 'error' }))
      setTimeout(() => setContratarStatus((prev) => ({ ...prev, [cotacao.id]: 'idle' })), 3000)
    }
  }, [mudancaId, handleCaminhaoChange])

  const [panelOpen, setPanelOpen] = useState(false)
  const [panelVisible, setPanelVisible] = useState(false)
  const [fabOpen, setFabOpen] = useState(false)

  function openPanel() {
    setPanelOpen(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setPanelVisible(true)))
  }

  function closePanel() {
    setPanelVisible(false)
    setTimeout(() => setPanelOpen(false), 300)
  }
  const [novaMudancaOpen, setNovaMudancaOpen] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function handleDeleteConfirm() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/mudancas/${mudancaId}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/app/dashboard')
        router.refresh()
      }
    } finally {
      setDeleting(false)
      setShowDelete(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* ── Barra de tabs + controles ─────────────────────────────────────── */}
      <div className="flex items-center gap-2">

        {/* Tabs — ocupam toda a largura no mobile */}
        <div className="flex flex-1 gap-1 p-1 bg-gray-100 rounded-xl">
          {(['canvas', 'cotacoes'] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => { setTab(tabKey); closePanel() }}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                tab === tabKey ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tabKey === 'canvas'
                ? <><IconPackage size={16} stroke={1.5} /><span className="hidden sm:inline">{t('tabCanvas')}</span><span className="sm:hidden">{t('tabCanvasMobile')}</span></>
                : <><IconSearch size={16} stroke={1.5} /><span>{t('tabCotacoes')}</span></>}
            </button>
          ))}
        </div>

        {/* Botão para abrir painel no mobile */}
        <button
          onClick={() => panelOpen ? closePanel() : openPanel()}
          className="lg:hidden flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          title={tab === 'canvas' ? t('catalog') : t('filters')}
        >
          {tab === 'canvas'
            ? <IconBooks size={16} stroke={1.5} />
            : <IconAdjustments size={16} stroke={1.5} />}
          <IconChevronDown
            size={14} stroke={2}
            className={`transition-transform duration-200 ${panelOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Status de save — só desktop */}
        <span className="hidden lg:flex text-xs text-gray-400 items-center gap-1 flex-shrink-0">
          {saveStatus === 'saving' && t('saving')}
          {saveStatus === 'saved' && <><IconCheck size={14} stroke={2} className="text-green-500" /> {t('saved')}</>}
          {saveStatus === 'unsaved' && t('unsaved')}
        </span>
      </div>

      {/* ── DndContext envolve tudo ──────────────────────────────────────────── */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start w-full">

          {/* ── Painel desktop: sempre visível na esquerda ─────────────────── */}
          <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            {tab === 'canvas' ? (
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:sticky lg:top-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                  <IconBooks size={16} stroke={1.5} className="text-gray-700" /> {t('catalogTitle')}
                </h2>
                <CatalogoPainel onAdd={handleAddItemDirect} />
              </div>
            ) : (
              <FiltrosCotacaoPainel
                filtros={filtros}
                onChange={setFiltros}
                filtrosAvancados={filtrosAvancados}
              />
            )}
          </aside>

          {/* ── Gaveta mobile (portal animado) ──────────────────────────────── */}
          {panelOpen && typeof window !== 'undefined' && createPortal(
            <div style={{ zIndex: 9998 }}>
              {/* Backdrop */}
              <div
                className="fixed inset-0 transition-opacity duration-300"
                style={{ backgroundColor: 'rgba(0,0,0,0.4)', opacity: panelVisible ? 1 : 0 }}
                onClick={closePanel}
              />
              {/* Gaveta */}
              <div
                className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out"
                style={{ transform: panelVisible ? 'translateY(0)' : 'translateY(100%)', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
              >
                {/* Pill handle */}
                <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                  <div className="w-10 h-1 rounded-full bg-gray-300" />
                </div>
                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-2 pb-3 flex-shrink-0 border-b border-gray-100">
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    {tab === 'canvas'
                      ? <><IconBooks size={18} stroke={1.5} className="text-gray-700" /> {t('catalogItemsTitle')}</>
                      : <><IconAdjustments size={18} stroke={1.5} className="text-gray-700" /> {t('filters')}</>}
                  </h2>
                  <button
                    onClick={closePanel}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <IconChevronDown size={20} stroke={2} />
                  </button>
                </div>
                {/* Conteúdo com scroll */}
                <div className="overflow-y-auto overflow-x-hidden flex-1 px-3 py-4">
                  {tab === 'canvas' ? (
                    <CatalogoPainel onAdd={(item) => { handleAddItemDirect(item) }} />
                  ) : (
                    <FiltrosCotacaoPainel
                      filtros={filtros}
                      onChange={setFiltros}
                      filtrosAvancados={filtrosAvancados}
                    />
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}

          {/* ── Conteúdo principal ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 w-full">

            {tab === 'canvas' && (
              <div className="flex flex-col gap-3">
                {cotacaoContratadaComPrecoAtual && (
                  <EmpresaContratadaBanner
                    info={cotacaoContratadaComPrecoAtual}
                    onAceitarPreco={(novoPreco) => {
                      setCotacaoInfo((prev) => prev ? { ...prev, precoCentavos: novoPreco } : prev)
                      toast.success(t('priceUpdated'))
                    }}
                  />
                )}
                <ResumoBar
                  caminhao={caminhao}
                  itens={itens}
                  quantidadeCaminhoes={quantidadeCaminhoes}
                  dataDesejada={dataDesejada}
                  onDataChange={handleDataChange}
                />
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                    <IconTruck size={16} stroke={1.5} className="text-gray-700" /> {t('selectVehicle')}
                  </h2>
                  <SeletorCaminhao
                    selecionado={caminhao}
                    onSelecionar={handleCaminhaoChange}
                    itens={itens}
                    layout="grid"
                    quantidadeCaminhoes={quantidadeCaminhoes}
                    onQuantidadeCaminhoesChange={handleQuantidadeCaminhoesChange}
                  />
                </div>
                <ListaItensCanvas
                  itens={itens}
                  onRemoveItem={handleRemoveItem}
                  onQuantidadeChange={handleQuantidadeChange}
                  limiteAtingido={limiteAtingido}
                />
                {/* Status de save — só mobile, abaixo do conteúdo */}
                <div className="lg:hidden text-xs text-gray-400 flex items-center gap-1 justify-end pb-20">
                  {saveStatus === 'saving' && t('saving')}
                  {saveStatus === 'saved' && <><IconCheck size={13} stroke={2} className="text-green-500" /> {t('saved')}</>}
                  {saveStatus === 'unsaved' && t('unsaved')}
                </div>
              </div>
            )}

            {tab === 'cotacoes' && (
              <div className="flex flex-col gap-4">
                {cotacoesFiltradas.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 flex flex-col items-center gap-2">
                    <IconSearch size={32} stroke={1} className="text-gray-300" />
                    <p className="text-sm">{t('noQuotesFound')}</p>
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
                  <div className="rounded-xl border border-dashed border-[#FA9370] bg-[#FFF8F6] p-6 text-center mb-20 lg:mb-0">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      {t('moreQuotes', { count: COTACOES_MOCK.length - 3 })}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">{t('upgradeToPro')}</p>
                    <a
                      href="/app/billing"
                      className="text-sm px-4 py-2 rounded-lg bg-[#E83500] text-white font-semibold hover:bg-[#C42A08] transition-colors"
                    >
                      {t('subscribePro')}
                    </a>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeItem && <DragPreviewCard item={activeItem} />}
        </DragOverlay>
      </DndContext>

      {/* ── Speed Dial FAB — só mobile ─────────────────────────────────────── */}
      <div className="lg:hidden fixed flex flex-col items-end" style={{ zIndex: 1000, right: 24, bottom: 16 }}>

        {/* Overlay para fechar ao clicar fora */}
        {fabOpen && (
          <div
            className="fixed inset-0"
            style={{ zIndex: -1 }}
            onClick={() => setFabOpen(false)}
          />
        )}

        {/* Ações — sobem animadas acima do FAB */}
        <div className="flex flex-col items-end gap-3 mb-4">

          {/* 1. Nova Mudança */}
          <SpeedDialAction
            label={t('fabNewMove')}
            icon={<IconPlus size={18} stroke={2} />}
            open={fabOpen}
            delay={120}
            color="bg-[#E83500]"
            onClick={() => { setFabOpen(false); setNovaMudancaOpen(true) }}
          />

          {/* 2. Adicionar itens */}
          <SpeedDialAction
            label={t('fabAddItems')}
            icon={<IconBooks size={18} stroke={1.5} />}
            open={fabOpen}
            delay={60}
            color="bg-gray-700"
            onClick={() => { setFabOpen(false); setTab('canvas'); openPanel() }}
          />

          {/* 3. Excluir mudança */}
          <SpeedDialAction
            label={t('fabDelete')}
            icon={<IconTrash size={18} stroke={1.5} />}
            open={fabOpen}
            delay={0}
            color="bg-red-600"
            onClick={() => { setFabOpen(false); setShowDelete(true) }}
          />
        </div>

        {/* Botão principal */}
        <button
          onClick={() => setFabOpen((v) => !v)}
          className="w-14 h-14 rounded-full bg-[#E83500] text-white shadow-xl flex items-center justify-center active:scale-95 cursor-pointer transition-all duration-300"
          style={{ transform: fabOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
          aria-label="Ações"
        >
          <IconPlus size={26} stroke={2.5} />
        </button>
      </div>

      {/* Modais */}
      {novaMudancaOpen && <NovaMudancaModal onClose={() => setNovaMudancaOpen(false)} />}

      {showDelete && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}
          onClick={(e) => e.target === e.currentTarget && setShowDelete(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <IconTrash size={20} stroke={2} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">{t('deleteTitle')}</h3>
                <p className="text-sm text-gray-500 mt-1">{t('deleteDescription')}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(false)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                {t('deleteCancel')}
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {deleting
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><IconTrash size={14} stroke={2} /> {t('deleteConfirm')}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
