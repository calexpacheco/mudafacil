import type { Meta, StoryObj } from '@storybook/nextjs'
import { typography } from '@/design-system/tokens'
import { IconLock } from '@tabler/icons-react'

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white' },
  },
}

export default meta

// ─── Type Scale ───────────────────────────────────────────────────────────────

export const TypeScale: StoryObj = {
  name: 'Type Scale',
  render: () => (
    <div className="p-8 flex flex-col gap-10">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Type Scale</h2>
        <p className="text-sm text-gray-500 mb-8">
          Escala tipográfica do MudaFácil. Heading:{' '}
          <strong>Barlow</strong>. Corpo: <strong>Inter</strong>. Monospace: <strong>JetBrains Mono</strong>.
        </p>

        <div className="flex flex-col gap-6 divide-y divide-gray-100">
          {[
            { key: '6xl', label: 'Display / 6xl', desc: 'Nunca usado em UI, apenas landing page hero', sample: 'MudaFácil' },
            { key: '5xl', label: 'Hero / 5xl', desc: 'Headings de landing page', sample: 'Planeje sua mudança' },
            { key: '4xl', label: 'H1 / 4xl', desc: 'Título de página principal', sample: 'Minha Mudança' },
            { key: '3xl', label: 'H2 / 3xl', desc: 'Seções de página', sample: 'Canvas de Carga' },
            { key: '2xl', label: 'H3 / 2xl', desc: 'Subseções', sample: 'Resumo da Carga' },
            { key: 'xl', label: 'H4 / xl', desc: 'Cards, painéis', sample: 'Cotações Disponíveis' },
            { key: 'lg', label: 'Large / lg', desc: 'Texto de destaque', sample: 'R$ 890,00 por mudança' },
            { key: 'base', label: 'Base / 16px', desc: 'Texto de corpo padrão', sample: 'Arraste os itens para o canvas e monte sua mudança ideal.' },
            { key: 'sm', label: 'Small / 14px', desc: 'Labels, descrições secundárias', sample: 'Filtrar por tipo de caminhão e disponibilidade' },
            { key: 'xs', label: 'XSmall / 12px', desc: 'Badges, metadados, captions', sample: '312 avaliações · São Paulo · Seguro incluso' },
          ].map(({ key, label, desc, sample }) => (
            <div key={key} className="flex gap-6 items-baseline pt-6 first:pt-0">
              <div className="w-36 flex-shrink-0">
                <p className="text-xs font-semibold text-gray-700">{label}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  {typography.fontSize[key as keyof typeof typography.fontSize]}
                </p>
                <p className="text-xs text-gray-400 mt-1">{desc}</p>
              </div>
              <p
                className="text-gray-900 font-normal flex-1"
                style={{ fontSize: typography.fontSize[key as keyof typeof typography.fontSize] }}
              >
                {sample}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

// ─── Font Weights ─────────────────────────────────────────────────────────────

export const FontWeights: StoryObj = {
  name: 'Font Weights',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Font Weights</h2>
        <p className="text-sm text-gray-500 mb-8">
          Pesos disponíveis na fonte Inter. Use peso semântico, não numérico nos componentes.
        </p>
        <div className="flex flex-col gap-5">
          {[
            { weight: '400', label: 'Normal', usage: 'Texto de corpo, parágrafos longos', cls: 'font-normal' },
            { weight: '500', label: 'Medium', usage: 'Labels de formulário, navegação secundária', cls: 'font-medium' },
            { weight: '600', label: 'Semibold', usage: 'Cabeçalhos de cards, nomes de transportadoras', cls: 'font-semibold' },
            { weight: '700', label: 'Bold', usage: 'Preços, CTAs, headings de seção', cls: 'font-bold' },
            { weight: '800', label: 'Extrabold', usage: 'Display, hero headlines', cls: 'font-extrabold' },
          ].map(({ weight, label, usage, cls }) => (
            <div key={weight} className="flex gap-6 items-center border-b border-gray-100 pb-5 last:border-0">
              <div className="w-32 flex-shrink-0">
                <p className="text-xs font-semibold text-gray-700">{label}</p>
                <p className="text-xs font-mono text-gray-400">{weight}</p>
                <p className="text-xs text-gray-400 mt-1">{usage}</p>
              </div>
              <p className={`text-2xl text-gray-900 ${cls}`}>
                MudaFácil — Sua mudança, simplificada
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

// ─── Font Families ────────────────────────────────────────────────────────────

export const FontFamilies: StoryObj = {
  name: 'Font Families',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Font Families</h2>
        <p className="text-sm text-gray-500 mb-8">
          Duas famílias tipográficas no sistema.
        </p>

        <div className="flex flex-col gap-8">
          {/* Barlow — Heading */}
          <div className="p-6 rounded-xl border-2 border-[#E83500] bg-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF0EA] text-[#E83500]">
                Heading
              </span>
              <h3 className="text-base font-semibold text-gray-900">Barlow</h3>
              <span className="text-xs text-gray-400 font-mono">geometric sans-serif</span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Barlow, sans-serif' }}>
              Aa Bb Cc 0123
            </p>
            <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Barlow, sans-serif' }}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789 !@#$%&*()
            </p>
            <p className="text-2xl font-extrabold text-[#E83500] mb-4" style={{ fontFamily: 'Barlow, sans-serif' }}>
              Muda sem estresse — We move with you
            </p>
            <p className="text-sm text-gray-500">
              Usada em: h1, h2, h3, h4, h5, h6 — headings de página, seções, cards.
            </p>
          </div>

          {/* Inter — Body */}
          <div className="p-6 rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                Corpo
              </span>
              <h3 className="text-base font-semibold text-gray-900">Inter</h3>
              <span className="text-xs text-gray-400 font-mono">sans-serif</span>
            </div>
            <p className="text-4xl font-normal text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Aa Bb Cc 0123
            </p>
            <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789 !@#$%&*()
            </p>
            <p className="text-sm text-gray-500">
              Usada em: textos de corpo, labels, descrições, botões, inputs.
            </p>
          </div>

          {/* Mono */}
          <div className="p-6 rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                Código
              </span>
              <h3 className="text-base font-semibold text-gray-900">JetBrains Mono</h3>
              <span className="text-xs text-gray-400 font-mono">monospace</span>
            </div>
            <p className="text-4xl font-normal text-gray-900 mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              Aa Bb Cc 0123
            </p>
            <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789 !@#$%&*()
            </p>
            <p className="text-sm text-gray-500">
              Usada em: tokens hex, dimensões técnicas, IDs de mudança.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
}

// ─── Text Styles ──────────────────────────────────────────────────────────────

export const TextStyles: StoryObj = {
  name: 'Text Styles — Aplicados',
  render: () => (
    <div className="p-8 max-w-2xl">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Text Styles — Contexto Real</h2>
      <p className="text-sm text-gray-500 mb-8">
        Como a tipografia aparece nos contextos reais do produto.
      </p>

      <div className="flex flex-col gap-8">
        {/* Card de cotação como exemplo */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Card de Cotação</p>
          <div className="p-4 rounded-xl border border-gray-200 bg-white">
            <p className="text-sm font-semibold text-gray-900">MudaBR Express</p>
            <p className="text-xs text-gray-400 mt-0.5">312 avaliações · São Paulo</p>
            <p className="text-xl font-bold text-gray-900 mt-2">R$ 890,00</p>
            <p className="text-xs text-gray-400">por mudança</p>
          </div>
        </div>

        {/* Resumo de carga */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Resumo de Carga</p>
          <div className="p-4 rounded-xl border border-gray-200 bg-white">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Resumo da Carga</h3>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Volume total</span>
              <span className="font-semibold text-gray-900">4.82 m³</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Peso estimado</span>
              <span className="font-semibold text-gray-900">312 kg</span>
            </div>
          </div>
        </div>

        {/* Alerta de paywall */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Paywall / Alerta</p>
          <div className="p-6 rounded-xl border-2 border-dashed border-[#FCC1A9] bg-[#FEF0EA] text-center">
            <div className="flex justify-center mb-3"><IconLock size={48} stroke={1.5} className="text-gray-700" /></div>
            <p className="font-semibold text-gray-900">Recurso PRO</p>
            <p className="text-sm text-gray-500 mt-1">
              Assine o MudaFácil PRO por R$ 29,90/mês para desbloquear este recurso.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
}
