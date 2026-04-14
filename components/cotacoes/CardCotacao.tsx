'use client'

import type { CotacaoCard } from '@/types/mudafacil'
import { cn } from '@/design-system/utils'
import { IconTruck, IconShield, IconTruckDelivery, IconCalendar, IconCheck, IconAlertTriangle, IconStar } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'

function Estrelas({ nota }: { nota: number }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <IconStar
          key={i}
          size={12}
          stroke={1.5}
          className={cn(i <= Math.round(nota) ? 'text-amber-400' : 'text-gray-200')}
          fill={i <= Math.round(nota) ? 'currentColor' : 'none'}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{nota.toFixed(1)}</span>
    </div>
  )
}

function formatCurrency(centavos: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(centavos / 100)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })
}

interface CardCotacaoProps {
  cotacao: CotacaoCard
  onContratar: (cotacao: CotacaoCard) => void
  contratada?: boolean
  contratarStatus?: 'idle' | 'loading' | 'success' | 'error'
}

export function CardCotacao({
  cotacao,
  onContratar,
  contratada = false,
  contratarStatus = 'idle',
}: CardCotacaoProps) {
  const t = useTranslations('cotacoes')
  const isLoading = contratarStatus === 'loading'
  const isSuccess = contratada || contratarStatus === 'success'
  const isError = contratarStatus === 'error'

  return (
    <div className={cn(
      'flex flex-col gap-3 p-4 rounded-xl border bg-white transition-all min-w-0 overflow-hidden',
      isSuccess
        ? 'border-green-300 shadow-md shadow-green-50 ring-1 ring-green-200'
        : 'border-gray-200 hover:shadow-md'
    )}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <IconTruck size={22} stroke={1.5} className="text-gray-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{cotacao.transportadora.nome}</p>
          <Estrelas nota={cotacao.transportadora.notaMedia} />
          <p className="text-xs text-gray-400 mt-0.5">
            {t('reviews', { count: cotacao.transportadora.totalAvaliacoes })} · {cotacao.transportadora.cidade}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-bold text-gray-900">{formatCurrency(cotacao.precoCentavos)}</p>
          <p className="text-xs text-gray-400">{t('perMove')}</p>
          {cotacao.seguroIncluso && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-700 mt-1">
              <IconShield size={12} stroke={1.5} className="text-green-700" /> {t('insuranceIncluded')}
            </span>
          )}
        </div>
      </div>

      {/* Detalhes — apenas badges de largura previsível, sem seguro */}
      <div className="flex flex-wrap gap-1.5">
        <Badge icon={<IconTruckDelivery size={12} stroke={1.5} />} label={cotacao.caminhao.nome} />
        <Badge icon={<IconCalendar size={12} stroke={1.5} />} label={t('availableOn', { date: formatDate(cotacao.dataDisponivel) })} />
        <Badge icon={<IconCalendar size={12} stroke={1.5} />} label={t('validUntil', { date: formatDate(cotacao.validade) })} className="bg-gray-50" />
      </div>

      {/* CTA */}
      {isSuccess ? (
        <div className="w-full py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
          <IconCheck size={14} stroke={2} className="text-green-700" /> {t('contracted')}
        </div>
      ) : isError ? (
        <button
          onClick={() => onContratar(cotacao)}
          className="w-full py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-100 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
        >
          <IconAlertTriangle size={14} stroke={1.5} className="text-red-700" /> {t('tryAgain')}
        </button>
      ) : (
        <button
          onClick={() => onContratar(cotacao)}
          disabled={isLoading}
          className="w-full py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-60 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
        >
          {isLoading ? (
            <>
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t('contracting')}
            </>
          ) : (
            t('hire')
          )}
        </button>
      )}
    </div>
  )
}

function Badge({ icon, label, className }: { icon: React.ReactNode; label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200 whitespace-nowrap',
        className
      )}
    >
      {icon} {label}
    </span>
  )
}
