'use client'

import type { FiltrosCotacao } from '@/types/mudafacil'
import { cn } from '@/design-system/utils'
import { IconCurrencyDollar, IconStar, IconCalendar, IconLock } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'

interface FiltrosCotacaoProps {
  filtros: FiltrosCotacao
  onChange: (filtros: FiltrosCotacao) => void
  filtrosAvancados: boolean
}

export function FiltrosCotacaoPainel({ filtros, onChange, filtrosAvancados }: FiltrosCotacaoProps) {
  const t = useTranslations('cotacoes')
  function update(partial: Partial<FiltrosCotacao>) {
    onChange({ ...filtros, ...partial })
  }

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-gray-200 bg-white">
      <h3 className="font-semibold text-gray-900 text-sm">{t('filterTitle')}</h3>

      {/* Ordenação — disponível para todos */}
      <div>
        <label className="text-xs text-gray-500 font-medium mb-1 block">{t('sortBy')}</label>
        <div className="flex flex-wrap gap-2">
          {(['preco', 'nota', 'data'] as const).map((op) => (
            <button
              key={op}
              onClick={() => update({ ordenarPor: op })}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer',
                filtros.ordenarPor === op
                  ? 'bg-[#E83500] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {op === 'preco'
                ? <span className="flex items-center gap-1"><IconCurrencyDollar size={12} stroke={1.5} /> {t('lowestPrice')}</span>
                : op === 'nota'
                  ? <span className="flex items-center gap-1"><IconStar size={12} stroke={1.5} /> {t('bestRating')}</span>
                  : <span className="flex items-center gap-1"><IconCalendar size={12} stroke={1.5} /> {t('available')}</span>}
            </button>
          ))}
        </div>
      </div>

      {!filtrosAvancados && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 flex items-center gap-1.5">
          <IconLock size={14} stroke={1.5} className="text-amber-700 flex-shrink-0" />
          {t('advancedFiltersLocked')}
        </div>
      )}

      {filtrosAvancados && (
        <>
          {/* Preço máximo */}
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">
              {filtros.precoMax ? t('maxPrice', { price: `R$ ${filtros.precoMax}` }) : t('maxPriceNoLimit')}
            </label>
            <input
              type="range"
              min={0}
              max={5000}
              step={100}
              value={filtros.precoMax ?? 5000}
              onChange={(e) => update({ precoMax: Number(e.target.value) || undefined })}
              className="w-full cursor-pointer"
              style={{ accentColor: '#E83500' }}
            />
          </div>

          {/* Nota mínima */}
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">
              {t('minRating', { rating: filtros.notaMin ?? 0 })}
            </label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={filtros.notaMin ?? 0}
              onChange={(e) => update({ notaMin: Number(e.target.value) || undefined })}
              className="w-full cursor-pointer"
              style={{ accentColor: '#E83500' }}
            />
          </div>

          {/* Seguro incluso */}
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filtros.seguroIncluso ?? false}
              onChange={(e) => update({ seguroIncluso: e.target.checked || undefined })}
              className="rounded"
              style={{ accentColor: '#E83500' }}
            />
            {t('insuranceFilter')}
          </label>

          {/* Tipo de caminhão */}
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1.5 block">{t('vehicleType')}</label>
            <div className="flex flex-wrap gap-1.5">
              {[undefined, 'FIORINO', 'HR', 'TRES_QUARTOS', 'BAU'].map((tipo) => (
                <button
                  key={tipo ?? 'todos'}
                  onClick={() => update({ tipoCaminhao: tipo as FiltrosCotacao['tipoCaminhao'] })}
                  className={cn(
                    'text-xs px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer',
                    filtros.tipoCaminhao === tipo
                      ? 'bg-[#E83500] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {tipo === undefined ? t('allVehicles') : tipo === 'TRES_QUARTOS' ? '3/4' : tipo}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onChange({ ordenarPor: 'preco' })}
            className="text-xs text-gray-400 underline text-left hover:text-gray-600 cursor-pointer"
          >
            {t('clearFilters')}
          </button>
        </>
      )}
    </div>
  )
}
