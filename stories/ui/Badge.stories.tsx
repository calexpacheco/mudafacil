import type { Meta, StoryObj } from '@storybook/nextjs'
import { IconCheck, IconX, IconAlertTriangle, IconConfetti, IconStar, IconTruckDelivery, IconShield, IconLock } from '@tabler/icons-react'

const meta: Meta = {
  title: 'UI/Badge',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white' },
  },
}

export default meta

// ─── All Badge Variants ───────────────────────────────────────────────────────

export const AllVariants: StoryObj = {
  name: 'Variantes',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Badge Variants</h2>
        <p className="text-sm text-gray-500 mb-8">
          Badges usados em toda a interface. Padrão:{' '}
          <code className="text-xs bg-gray-100 px-1 rounded">inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border</code>
        </p>

        {/* Status badges */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Status</h3>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
              <IconCheck size={12} stroke={2} /> Ativo
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-medium">
              <IconX size={12} stroke={2} /> Inativo
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
              <IconAlertTriangle size={12} stroke={1.5} /> Pendente
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
              Em andamento
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
              — Rascunho
            </span>
          </div>
        </section>

        {/* Plan badges */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Planos</h3>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
              FREE
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">
              <IconConfetti size={12} stroke={1.5} /> TRIAL
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-600 text-white font-semibold">
              <IconStar size={12} stroke={1.5} /> PRO
            </span>
          </div>
        </section>

        {/* Card cotação badges (com ícone) */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Card Cotação (com ícone)</h3>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
              <IconTruckDelivery size={12} stroke={1.5} /> HR / Sprinter
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
              Disponível 15 abr
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border bg-green-50 text-green-700 border-green-200">
              <IconShield size={12} stroke={1.5} /> Seguro incluso
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border bg-gray-50 text-gray-600 border-gray-200">
              Válido até 20 abr
            </span>
          </div>
        </section>

        {/* Tipo de caminhão */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Tipo de Caminhão</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Fiorino', icon: <IconTruckDelivery size={12} stroke={1.5} />, color: '#6366f1' },
              { label: 'HR / Sprinter', icon: <IconTruckDelivery size={12} stroke={1.5} />, color: '#8b5cf6' },
              { label: '3/4 Truck', icon: <IconTruckDelivery size={12} stroke={1.5} />, color: '#E83500' },
              { label: 'Baú', icon: <IconTruckDelivery size={12} stroke={1.5} />, color: '#0f172a' },
            ].map(({ label, icon, color }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium text-white"
                style={{ backgroundColor: color }}
              >
                {icon} {label}
              </span>
            ))}
          </div>
        </section>

        {/* Paywall lock */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Paywall / Lock</h3>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-medium">
              <IconLock size={12} stroke={1.5} /> Filtros avançados disponíveis no Trial ou PRO
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-dashed border-blue-200 font-medium">
              <IconLock size={12} stroke={1.5} /> Recurso PRO
            </span>
          </div>
        </section>
      </div>
    </div>
  ),
}

// ─── Rating Stars ─────────────────────────────────────────────────────────────

export const RatingStars: StoryObj = {
  name: 'Rating Stars',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Rating — Estrelas</h2>
        <p className="text-sm text-gray-500 mb-8">
          Sistema de avaliação das transportadoras. Usado no CardCotacao.
        </p>
        <div className="flex flex-col gap-4">
          {[5, 4.8, 4.2, 3.5, 2.3, 1].map((nota) => (
            <div key={nota} className="flex items-center gap-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={`text-sm ${i <= Math.round(nota) ? 'text-amber-400' : 'text-gray-200'}`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-xs text-gray-500 ml-1">{nota.toFixed(1)}</span>
              </div>
              <span className="text-xs text-gray-400">
                {nota >= 4.5 && '— Excelente'}
                {nota >= 4 && nota < 4.5 && '— Muito bom'}
                {nota >= 3 && nota < 4 && '— Bom'}
                {nota < 3 && '— Abaixo da média'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

// ─── Save Status ──────────────────────────────────────────────────────────────

export const SaveStatus: StoryObj = {
  name: 'Save Status',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Save Status</h2>
        <p className="text-sm text-gray-500 mb-8">
          Indicador de status de auto-save do CanvasEditor.
        </p>
        <div className="flex gap-6 items-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-400 flex items-center gap-1"><IconCheck size={12} stroke={2} className="text-green-500" /> Salvo</span>
            <p className="text-xs text-gray-400">Estado: saved</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-400 flex items-center gap-1"><span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin inline-block" /> Salvando...</span>
            <p className="text-xs text-gray-400">Estado: saving</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-400">○ Não salvo</span>
            <p className="text-xs text-gray-400">Estado: unsaved</p>
          </div>
        </div>
      </div>
    </div>
  ),
}
