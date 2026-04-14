'use client'

import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  IconX, IconMapPin, IconCalendar, IconPackage,
  IconBed, IconArmchair, IconToolsKitchen2, IconBath,
  IconDeviceDesktop, IconWashMachine, IconChevronRight,
} from '@tabler/icons-react'
import { CAMINHOES } from '@/lib/caminhoes'
import { CATALOGO_ITENS } from '@/lib/catalogo-itens'
import type { ItemPositionado } from '@/types/mudafacil'

// ─── Estimativas por cômodo ─────────────────────────────────────────────────

const COMODOS = [
  { id: 'quarto',        icon: IconBed,            itens: 8,  volumeM3: 5.0, pesoKg: 220 },
  { id: 'sala',          icon: IconArmchair,        itens: 7,  volumeM3: 4.5, pesoKg: 180 },
  { id: 'cozinha',       icon: IconToolsKitchen2,   itens: 6,  volumeM3: 2.8, pesoKg: 220 },
  { id: 'banheiro',      icon: IconBath,            itens: 2,  volumeM3: 0.4, pesoKg: 15  },
  { id: 'escritorio',    icon: IconDeviceDesktop,   itens: 5,  volumeM3: 1.8, pesoKg: 90  },
  { id: 'areadeservico', icon: IconWashMachine,     itens: 3,  volumeM3: 0.8, pesoKg: 110 },
] as const

type ComodoId = typeof COMODOS[number]['id']

// Itens típicos por cômodo (ids do catálogo)
const ITENS_POR_COMODO: Record<ComodoId, string[]> = {
  quarto:        ['cama-casal', 'guarda-roupa-4', 'comoda', 'criado-mudo', 'colchao-casal'],
  sala:          ['sofa-3l', 'mesa-sala', 'cadeira', 'rack-tv', 'tv-50', 'tapete'],
  cozinha:       ['geladeira', 'fogao', 'microondas', 'armario-cozinha', 'mesa-cozinha'],
  banheiro:      ['caixa-p', 'caixa-m'],
  escritorio:    ['mesa-escritorio', 'cadeira-escritorio', 'armario-escritorio', 'monitor'],
  areadeservico: ['maquina-lavar', 'maquina-secar'],
}

function gerarItensPositionados(qtd: Record<ComodoId, number>): ItemPositionado[] {
  const itens: ItemPositionado[] = []
  let idx = 0

  for (const comodo of COMODOS) {
    const count = qtd[comodo.id]
    if (count === 0) continue
    const ids = ITENS_POR_COMODO[comodo.id]
    for (const itemId of ids) {
      const itemCatalogo = CATALOGO_ITENS.find((i) => i.id === itemId)
      if (!itemCatalogo) continue
      itens.push({
        uid: `${itemId}-${idx++}-${Date.now()}`,
        itemId: itemCatalogo.id,
        item: itemCatalogo,
        x: (idx % 5) * 20,
        y: Math.floor(idx / 5) * 20,
        rotacao: 0,
        quantidade: count,
      })
    }
  }

  return itens
}

const PRECO_BASE: Record<string, number> = {
  FIORINO: 32000, HR: 79000, TRES_QUARTOS: 130000, BAU: 195000,
}

function fmt(centavos: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(centavos / 100)
}

// ─── Modal interno (sem portal) ─────────────────────────────────────────────

function ModalContent({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const t = useTranslations('app.modal')
  const tRooms = t.raw('rooms') as Array<{ label: string; hint: string }>

  const [origem, setOrigem]   = useState('')
  const [destino, setDestino] = useState('')
  const [data, setData]       = useState('')
  const [qtd, setQtd]         = useState<Record<ComodoId, number>>({
    quarto: 0, sala: 0, cozinha: 0, banheiro: 0, escritorio: 0, areadeservico: 0,
  })
  const [loading, setLoading] = useState(false)
  const [erro, setErro]       = useState('')
  const [visible, setVisible] = useState(false)

  // Bloqueia scroll do body enquanto modal está aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    // Dispara animação de entrada no próximo frame
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    return () => { document.body.style.overflow = '' }
  }, [])

  // Animação de saída antes de fechar
  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  const change = (id: ComodoId, delta: number) =>
    setQtd((prev) => ({ ...prev, [id]: Math.max(0, prev[id] + delta) }))

  const estimativa = useMemo(() => {
    const totalItens = COMODOS.reduce((acc, c) => acc + c.itens  * qtd[c.id], 0)
    const totalVol   = COMODOS.reduce((acc, c) => acc + c.volumeM3 * qtd[c.id], 0)
    const totalPeso  = COMODOS.reduce((acc, c) => acc + c.pesoKg  * qtd[c.id], 0)
    if (totalItens === 0) return null

    const caminhao =
      CAMINHOES.find((c) => c.capacidadeM3 >= totalVol && c.capacidadeKg >= totalPeso) ??
      CAMINHOES[CAMINHOES.length - 1]

    let fator = 1.0
    if (data) {
      const dias = Math.max(0, (new Date(data).getTime() - Date.now()) / 86_400_000)
      if (dias < 3) fator = 1.30
      else if (dias < 7) fator = 1.15
      else if (dias > 30) fator = 0.97
    }

    const base = PRECO_BASE[caminhao.tipo] ?? 80000
    return {
      totalItens, totalVol, caminhao,
      precoMin: Math.round(base * 0.85 * fator),
      precoMax: Math.round(base * 1.20 * fator),
    }
  }, [qtd, data])

  const podeSubmit = origem.trim().length >= 5 && destino.trim().length >= 5

  async function handleSubmit() {
    if (!podeSubmit) return
    setErro('')
    setLoading(true)
    try {
      // 1. Cria a mudança
      const res = await fetch('/api/mudancas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enderecoOrigem: origem.trim(),
          enderecoDestino: destino.trim(),
          dataDesejada: data || null,
        }),
      })
      const json = await res.json()
      if (!res.ok) { setErro(json.error ?? t('errorConnection')); return }

      const mudancaId: string = json.id

      // 2. Se tiver cômodos selecionados, monta e salva o layout com os itens estimados
      const totalComodos = Object.values(qtd).reduce((a, b) => a + b, 0)
      if (totalComodos > 0) {
        const itensPositionados = gerarItensPositionados(qtd)
        const volTotal  = itensPositionados.reduce((acc, i) => acc + i.item.volumeM3 * (i.quantidade ?? 1), 0)
        const pesoTotal = itensPositionados.reduce((acc, i) => acc + i.item.pesoKg   * (i.quantidade ?? 1), 0)

        // Seleciona o menor caminhão que comporta tudo
        const caminhao =
          CAMINHOES.find((c) => c.capacidadeM3 >= volTotal && c.capacidadeKg >= pesoTotal) ??
          CAMINHOES[CAMINHOES.length - 1]

        const ocupacaoPercentual = Math.min((volTotal / caminhao.capacidadeM3) * 100, 100)

        await fetch(`/api/mudancas/${mudancaId}/layout`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itensPositionados: { items: itensPositionados, quantidadeCaminhoes: 1 },
            caminhaoId: caminhao.id,
            ocupacaoPercentual,
          }),
        })
      }

      handleClose()
      router.push(`/app/mudanca/${mudancaId}`)
    } catch {
      setErro(t('errorConnection'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: 9999 }}
      onMouseDown={(e) => e.target === e.currentTarget && handleClose()}
    >
      {/* Backdrop animado */}
      <div
        className="fixed inset-0 transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', opacity: visible ? 1 : 0 }}
      />

      <div className="relative flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className={[
          'bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl',
          'transition-transform duration-300 ease-out',
          // Mobile: desliza de baixo; desktop: escala suavemente
          'sm:transition-[transform,opacity] sm:duration-300',
          visible
            ? 'translate-y-0 sm:scale-100 sm:opacity-100'
            : 'translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0',
        ].join(' ')}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Pill handle — só mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-4 sm:px-6 pt-3 sm:pt-6 pb-2">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">{t('title')}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{t('subtitle')}</p>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
            <IconX size={18} stroke={2} />
          </button>
        </div>

        <div className="px-4 sm:px-6 pb-6 flex flex-col gap-4 sm:gap-5 mt-3">

          {/* Origem */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">{t('originLabel')}</label>
            <div className="relative">
              <IconMapPin size={16} stroke={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E83500]" />
              <input
                type="text" value={origem} onChange={(e) => setOrigem(e.target.value)}
                placeholder={t('originPlaceholder')}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E83500] focus:border-[#E83500] placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Destino */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">{t('destinationLabel')}</label>
            <div className="relative">
              <IconMapPin size={16} stroke={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text" value={destino} onChange={(e) => setDestino(e.target.value)}
                placeholder={t('destinationPlaceholder')}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E83500] focus:border-[#E83500] placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Cômodos */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2.5">
              <IconPackage size={16} stroke={1.5} className="text-gray-500" />
              {t('roomsLabel')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {COMODOS.map((comodo, idx) => {
                const Icon = comodo.icon
                const count = qtd[comodo.id]
                const room = tRooms[idx]
                return (
                  <div key={comodo.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#fafafa' }}>
                    <Icon size={18} stroke={1.5} style={{ color: '#9ca3af', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>{room.label}</p>
                      <p style={{ fontSize: '11px', color: '#9ca3af', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{room.hint}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <button onClick={() => change(comodo.id, -1)} style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #e5e7eb', background: 'white', fontSize: 16, fontWeight: 700, color: '#6b7280', cursor: 'pointer' }}>−</button>
                      <span style={{ width: 16, textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#111827' }}>{count}</span>
                      <button onClick={() => change(comodo.id, +1)} style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #e5e7eb', background: 'white', fontSize: 16, fontWeight: 700, color: '#6b7280', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">{t('dateLabel')}</label>
            <div className="relative">
              <IconCalendar size={16} stroke={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date" value={data} min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setData(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E83500] focus:border-[#E83500] cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{t('dateHint')}</p>
          </div>

          {/* Estimativa */}
          {estimativa && (
            <div className="rounded-xl border border-[#FA9370] bg-[#FFF8F6] px-4 py-3.5 flex flex-col gap-2">
              <p className="text-xs font-bold text-[#E83500] uppercase tracking-widest">{t('estimateTitle')}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase">{t('estimateItems')}</span>
                  <span className="text-lg font-extrabold text-gray-900">{estimativa.totalItens}</span>
                </div>
                <div className="w-px h-8 bg-[#FA9370]/40" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase">{t('estimateVolume')}</span>
                  <span className="text-lg font-extrabold text-gray-900">{estimativa.totalVol.toFixed(1)} m³</span>
                </div>
                <div className="w-px h-8 bg-[#FA9370]/40" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase">{t('estimateVehicle')}</span>
                  <span className="text-sm font-bold text-gray-900">{estimativa.caminhao.nome}</span>
                </div>
                <div className="w-px h-8 bg-[#FA9370]/40" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase">{t('estimatePrice')}</span>
                  <span className="text-sm font-bold text-[#E83500]">{fmt(estimativa.precoMin)} – {fmt(estimativa.precoMax)}</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                <IconChevronRight size={10} stroke={2} />
                {t('estimateHint')}
              </p>
            </div>
          )}

          {/* Erro */}
          {erro && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{erro}</p>}

          {/* Botões */}
          <div className="flex gap-3 pt-1">
            <button onClick={handleClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer">
              {t('cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!podeSubmit || loading}
              className="flex-1 py-3 rounded-xl bg-[#E83500] text-white text-sm font-bold hover:bg-[#C42A08] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('submitting') : t('submit')}
            </button>
          </div>

        </div>
      </div>
      </div>
    </div>
  )
}

// ─── Portal wrapper ──────────────────────────────────────────────────────────

export function NovaMudancaModal({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return createPortal(<ModalContent onClose={onClose} />, document.body)
}
