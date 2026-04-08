import type { Meta, StoryObj } from '@storybook/nextjs'
import { spacing, borderRadius, shadows } from '@/design-system/tokens'

const meta: Meta = {
  title: 'Foundations/Spacing',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white' },
  },
}

export default meta

// ─── Spacing Scale ────────────────────────────────────────────────────────────

export const SpacingScale: StoryObj = {
  name: 'Spacing Scale',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Spacing Scale</h2>
        <p className="text-sm text-gray-500 mb-8">
          Escala de espaçamento base 4px. Use sempre múltiplos desta escala para margens, paddings e gaps.
        </p>
        <div className="flex flex-col gap-4">
          {Object.entries(spacing).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <div className="w-12 flex-shrink-0 text-right">
                <span className="text-xs font-mono font-semibold text-gray-700">{key}</span>
              </div>
              <div className="w-16 text-right flex-shrink-0">
                <span className="text-xs font-mono text-gray-400">{value}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="bg-blue-400 rounded h-5 flex-shrink-0"
                  style={{ width: value }}
                />
                <span className="text-xs text-gray-400">
                  {parseInt(value) / 4}x base
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

// ─── Border Radius ────────────────────────────────────────────────────────────

export const BorderRadius: StoryObj = {
  name: 'Border Radius',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Border Radius</h2>
        <p className="text-sm text-gray-500 mb-8">
          Raios de borda do sistema. Use <strong>xl (16px)</strong> para cards principais e <strong>lg (12px)</strong> para cards menores.
        </p>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
          {Object.entries(borderRadius).map(([key, value]) => (
            <div key={key} className="flex flex-col items-center gap-3">
              <div
                className="w-20 h-20 bg-blue-100 border-2 border-blue-400"
                style={{ borderRadius: value }}
              />
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-700">{key}</p>
                <p className="text-xs font-mono text-gray-400">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Uso no produto</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-xl bg-white">
              <p className="text-xs font-semibold text-gray-700">rounded-xl (16px)</p>
              <p className="text-xs text-gray-400 mt-1">Cards, painéis, modais</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <p className="text-xs font-semibold text-gray-700">rounded-lg (12px)</p>
              <p className="text-xs text-gray-400 mt-1">Inputs, sub-cards</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md bg-white">
              <p className="text-xs font-semibold text-gray-700">rounded-md (8px)</p>
              <p className="text-xs text-gray-400 mt-1">Botões, badges menores</p>
            </div>
            <div className="px-4 py-2 border border-gray-200 rounded-full bg-white inline-block">
              <p className="text-xs font-semibold text-gray-700">rounded-full</p>
            </div>
            <div className="px-4 py-2 border border-gray-200 rounded-sm bg-white inline-block">
              <p className="text-xs font-semibold text-gray-700">rounded-sm (4px)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const Shadows: StoryObj = {
  name: 'Shadows',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Shadows</h2>
        <p className="text-sm text-gray-500 mb-8">
          Sistema de sombras sutil e funcional. Use sombras para indicar elevação e interatividade.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(shadows).map(([key, value]) => (
            <div key={key} className="flex flex-col items-center gap-4">
              <div
                className="w-24 h-24 bg-white rounded-xl"
                style={{ boxShadow: value }}
              />
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-700">shadow-{key}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {key === 'sm' && 'Inputs, tags'}
                  {key === 'md' && 'Cards em hover'}
                  {key === 'lg' && 'Dropdowns, tooltips'}
                  {key === 'xl' && 'Modais, popovers'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Sombras no produto</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-700">Estado padrão</p>
                <p className="text-xs text-gray-400">border + shadow-sm</p>
              </div>
              <p className="text-xs text-gray-400 text-center">Cards padrão</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="p-4 rounded-xl bg-white shadow-md">
                <p className="text-xs font-semibold text-gray-700">Estado hover</p>
                <p className="text-xs text-gray-400">shadow-md</p>
              </div>
              <p className="text-xs text-gray-400 text-center">Hover de cards</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="p-4 rounded-xl bg-white shadow-lg">
                <p className="text-xs font-semibold text-gray-700">Flutuante</p>
                <p className="text-xs text-gray-400">shadow-lg</p>
              </div>
              <p className="text-xs text-gray-400 text-center">Dropdowns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}
