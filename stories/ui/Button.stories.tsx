import type { Meta, StoryObj } from '@storybook/nextjs'
import { IconPackage, IconCurrencyDollar, IconStar, IconArrowRight } from '@tabler/icons-react'

const meta: Meta = {
  title: 'UI/Button',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white' },
  },
}

export default meta

// ─── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: StoryObj = {
  name: 'Variantes',
  render: () => (
    <div className="p-8 flex flex-col gap-10">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Button Variants</h2>
        <p className="text-sm text-gray-500 mb-8">
          Todos os botões do sistema. O MudaFácil usa Tailwind diretamente — sem componente abstraído.
          Padrão de classes abaixo de cada exemplo.
        </p>

        {/* Primary */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Primary</h3>
          <div className="flex flex-wrap gap-4 items-center mb-3">
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
              Contratar
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors opacity-50 cursor-not-allowed">
              Desabilitado
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold transition-colors flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> Carregando...
            </button>
          </div>
          <code className="text-xs font-mono text-gray-400 bg-gray-50 p-2 rounded block">
            px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors
          </code>
        </section>

        {/* Secondary */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Secondary</h3>
          <div className="flex flex-wrap gap-4 items-center mb-3">
            <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors">
              Cancelar
            </button>
            <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors opacity-50 cursor-not-allowed">
              Desabilitado
            </button>
          </div>
          <code className="text-xs font-mono text-gray-400 bg-gray-50 p-2 rounded block">
            px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors
          </code>
        </section>

        {/* Outline */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Outline</h3>
          <div className="flex flex-wrap gap-4 items-center mb-3">
            <button className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors">
              Ver detalhes
            </button>
            <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
              Opções
            </button>
          </div>
          <code className="text-xs font-mono text-gray-400 bg-gray-50 p-2 rounded block">
            px-4 py-2 rounded-lg border border-blue-600 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors
          </code>
        </section>

        {/* Ghost */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Ghost / Link</h3>
          <div className="flex flex-wrap gap-4 items-center mb-3">
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors underline">
              Limpar filtros
            </button>
            <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline">
              Saiba mais
            </button>
          </div>
          <code className="text-xs font-mono text-gray-400 bg-gray-50 p-2 rounded block">
            text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors underline
          </code>
        </section>

        {/* Danger */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Danger</h3>
          <div className="flex flex-wrap gap-4 items-center mb-3">
            <button className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">
              Excluir mudança
            </button>
            <button className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
              Cancelar assinatura
            </button>
          </div>
          <code className="text-xs font-mono text-gray-400 bg-gray-50 p-2 rounded block">
            px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors
          </code>
        </section>

        {/* PRO CTA */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">PRO / Upgrade CTA</h3>
          <div className="flex flex-wrap gap-4 items-center mb-3">
            <a
              href="#"
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Assinar PRO — R$ 29,90/mês
            </a>
            <a
              href="#"
              className="text-sm px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors whitespace-nowrap text-white flex items-center gap-1"
              style={{ backgroundColor: 'rgba(249,115,22,0.8)' }}
            >
              Assinar PRO <IconArrowRight size={16} stroke={1.5} />
            </a>
          </div>
        </section>
      </div>
    </div>
  ),
}

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: StoryObj = {
  name: 'Tamanhos',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Button Sizes</h2>
        <p className="text-sm text-gray-500 mb-8">Variações de tamanho usadas no produto.</p>

        <div className="flex flex-wrap items-end gap-6">
          <div className="flex flex-col items-center gap-2">
            <button className="px-6 py-3 rounded-xl bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-colors">
              Grande
            </button>
            <span className="text-xs text-gray-400">px-6 py-3 text-base</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button className="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
              Médio
            </button>
            <span className="text-xs text-gray-400">px-4 py-2.5 text-sm</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
              Padrão
            </button>
            <span className="text-xs text-gray-400">px-4 py-2 text-sm</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
              Pequeno
            </button>
            <span className="text-xs text-gray-400">px-3 py-1.5 text-xs</span>
          </div>
        </div>
      </div>
    </div>
  ),
}

// ─── States ───────────────────────────────────────────────────────────────────

export const States: StoryObj = {
  name: 'Estados',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Button States</h2>
        <p className="text-sm text-gray-500 mb-8">Todos os estados possíveis de um botão.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2 items-start">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Default</p>
            <button className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold transition-colors">
              Contratar
            </button>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hover</p>
            <button className="w-full py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold transition-colors">
              Contratar
            </button>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Loading</p>
            <button className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> Aguarde...
            </button>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Disabled</p>
            <button
              disabled
              className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold opacity-50 cursor-not-allowed"
            >
              Contratar
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
}

// ─── Tab Buttons ──────────────────────────────────────────────────────────────

export const TabButtons: StoryObj = {
  name: 'Tab Buttons',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Tab Buttons</h2>
        <p className="text-sm text-gray-500 mb-8">
          Padrão de tabs usado no CanvasEditor (Canvas de Carga / Cotações).
        </p>

        <div className="flex flex-col gap-6">
          {/* Canvas editor tabs */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tab ativa vs inativa</p>
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
              <button className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-900 shadow-sm flex items-center gap-1.5">
                <IconPackage size={16} stroke={1.5} className="text-gray-700" /> Canvas de Carga
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1.5">
                <IconCurrencyDollar size={16} stroke={1.5} /> Cotações
              </button>
            </div>
          </div>

          {/* Sort pills */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sort Pills (FiltrosCotacao)</p>
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1.5 rounded-full font-medium bg-blue-600 text-white flex items-center gap-1">
                <IconCurrencyDollar size={14} stroke={1.5} /> Menor preço
              </button>
              <button className="text-xs px-3 py-1.5 rounded-full font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-1">
                <IconStar size={14} stroke={1.5} /> Melhor nota
              </button>
              <button className="text-xs px-3 py-1.5 rounded-full font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
                Disponível
              </button>
            </div>
          </div>

          {/* Caminhão pills */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tipo de Veículo Pills</p>
            <div className="flex flex-wrap gap-1.5">
              {['Todos', 'FIORINO', 'HR', '3/4', 'BAU'].map((tipo, i) => (
                <button
                  key={tipo}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}
