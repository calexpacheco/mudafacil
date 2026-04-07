'use client'

import type { CotacaoCard } from '@/types/mudafacil'
import { cn } from '@/design-system/utils'

function Estrelas({ nota }: { nota: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={cn('text-xs', i <= Math.round(nota) ? 'text-amber-400' : 'text-gray-200')}>
          ★
        </span>
      ))}
      <span className="text-xs text-gray-500 ml-1">{nota.toFixed(1)}</span>
    </div>
  )
}

function formatCurrency(centavos: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(centavos / 100)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

interface CardCotacaoProps {
  cotacao: CotacaoCard
  onContratar: (cotacao: CotacaoCard) => void
}

export function CardCotacao({ cotacao, onContratar }: CardCotacaoProps) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
          🚛
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{cotacao.transportadora.nome}</p>
          <Estrelas nota={cotacao.transportadora.notaMedia} />
          <p className="text-xs text-gray-400 mt-0.5">
            {cotacao.transportadora.totalAvaliacoes} avaliações · {cotacao.transportadora.cidade}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-bold text-gray-900">{formatCurrency(cotacao.precoCentavos)}</p>
          <p className="text-xs text-gray-400">por mudança</p>
        </div>
      </div>

      {/* Detalhes */}
      <div className="flex flex-wrap gap-2">
        <Badge icon="🚚" label={cotacao.caminhao.nome} />
        <Badge icon="📅" label={`Disponível ${formatDate(cotacao.dataDisponivel)}`} />
        {cotacao.seguroIncluso && <Badge icon="🛡️" label="Seguro incluso" className="bg-green-50 text-green-700 border-green-200" />}
        <Badge icon="⏳" label={`Válido até ${formatDate(cotacao.validade)}`} className="bg-gray-50" />
      </div>

      {/* CTA */}
      <button
        onClick={() => onContratar(cotacao)}
        className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        Contratar
      </button>
    </div>
  )
}

function Badge({ icon, label, className }: { icon: string; label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200',
        className
      )}
    >
      {icon} {label}
    </span>
  )
}
