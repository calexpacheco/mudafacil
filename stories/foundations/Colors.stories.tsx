import type { Meta, StoryObj } from '@storybook/nextjs'
import { colors, semantic } from '@/design-system/tokens'

// Helper component for a single swatch
function Swatch({
  hex,
  name,
  usage,
  large = false,
}: {
  hex: string
  name: string
  usage?: string
  large?: boolean
}) {
  const isLight = isLightColor(hex)
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <div
        style={{ backgroundColor: hex, height: large ? 96 : 64 }}
        className="w-full flex items-end p-2"
      >
        {large && (
          <span
            className="text-xs font-mono font-semibold"
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
          >
            {hex}
          </span>
        )}
      </div>
      <div className="p-3 bg-white">
        <p className="text-xs font-semibold text-gray-900">{name}</p>
        {!large && <p className="text-xs font-mono text-gray-400 mt-0.5">{hex}</p>}
        {usage && <p className="text-xs text-gray-500 mt-1">{usage}</p>}
      </div>
    </div>
  )
}

function isLightColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}

function PaletteRow({ label, scale }: { label: string; scale: Record<string | number, string> }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{label}</h3>
      <div className="grid grid-cols-5 gap-3 md:grid-cols-10">
        {Object.entries(scale).map(([key, hex]) => (
          <div key={key} className="flex flex-col gap-1">
            <div
              className="h-10 rounded-lg border border-gray-100"
              style={{ backgroundColor: hex }}
            />
            <p className="text-xs font-mono text-center text-gray-500">{key}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Story component ───────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'mudafacil' },
  },
}

export default meta

// ─── Brand Colors ─────────────────────────────────────────────────────────────

export const BrandColors: StoryObj = {
  name: 'Brand Colors',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Brand Colors</h2>
        <p className="text-sm text-gray-500 mb-6">
          Cores principais da identidade MudaFácil. Nunca use hex diretamente — importe de{' '}
          <code className="bg-gray-100 px-1 rounded text-xs">design-system/tokens.ts</code>.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Swatch
            hex={colors.primary[600]}
            name="Primary"
            usage="Botões, links, CTAs principais"
            large
          />
          <Swatch
            hex={colors.accent[500]}
            name="Accent — Caminhão"
            usage="Destaques, badges de plano, ícones de frota"
            large
          />
          <Swatch
            hex={colors.gray[900]}
            name="Text Primary"
            usage="Textos principais, headings"
            large
          />
          <Swatch
            hex={colors.gray[50]}
            name="Background"
            usage="Fundo da página, canvas"
            large
          />
        </div>
      </div>
    </div>
  ),
}

// ─── Primary Palette ──────────────────────────────────────────────────────────

export const PrimaryPalette: StoryObj = {
  name: 'Primary Palette',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Primary — Vermelho Brand</h2>
        <p className="text-sm text-gray-500 mb-6">
          Escala completa do vermelho primário. Use{' '}
          <strong>primary-600 (#E83500)</strong> como cor principal.
        </p>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
          {Object.entries(colors.primary).map(([key, hex]) => (
            <div key={key} className="flex flex-col gap-1">
              <div
                className="h-14 rounded-lg border border-gray-100 relative"
                style={{ backgroundColor: hex }}
              >
                {key === '600' && (
                  <span className="absolute -top-2 -right-2 bg-[#E83500] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    ★
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-center text-gray-500">{key}</p>
              <p className="text-xs font-mono text-center text-gray-400 text-[10px]">{hex}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Swatch hex={colors.primary[50]} name="Primary / 5%" usage="Hover backgrounds" />
          <Swatch hex={colors.primary[100]} name="Primary / 10%" usage="Ícone backgrounds" />
          <Swatch hex={colors.primary[200]} name="Primary / 20%" usage="Canvas items" />
          <Swatch hex={colors.primary[300]} name="Primary / 30%" usage="Borders dashed" />
          <Swatch hex={colors.primary[600]} name="Primary" usage="Botões, links" />
          <Swatch hex={colors.primary[700]} name="Primary Hover" usage="Hover de CTAs" />
        </div>
      </div>
    </div>
  ),
}

// ─── Accent Palette ───────────────────────────────────────────────────────────

export const AccentPalette: StoryObj = {
  name: 'Accent Palette',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Accent — Âmbar (Caminhão)</h2>
        <p className="text-sm text-gray-500 mb-6">
          Representa energia, movimento e frete. Use <strong>accent-500</strong> como cor de destaque.
        </p>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
          {Object.entries(colors.accent).map(([key, hex]) => (
            <div key={key} className="flex flex-col gap-1">
              <div
                className="h-14 rounded-lg border border-gray-100 relative"
                style={{ backgroundColor: hex }}
              >
                {key === '500' && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    ★
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-center text-gray-500">{key}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Swatch hex={colors.accent[50]} name="Accent / 5%" usage="Trial banner background" />
          <Swatch hex={colors.accent[100]} name="Accent / 10%" usage="Paywall backgrounds" />
          <Swatch hex={colors.accent[500]} name="Accent" usage="Trial badge, truck accent" />
          <Swatch hex={colors.accent[600]} name="Accent Hover" usage="Hover state do accent" />
        </div>
      </div>
    </div>
  ),
}

// ─── Gray Palette ─────────────────────────────────────────────────────────────

export const GrayPalette: StoryObj = {
  name: 'Gray Palette',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Neutral — Cinza</h2>
        <p className="text-sm text-gray-500 mb-6">
          Escala de neutros. Base de todo o sistema de tipografia e superfícies.
        </p>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
          {Object.entries(colors.gray).map(([key, hex]) => (
            <div key={key} className="flex flex-col gap-1">
              <div
                className="h-14 rounded-lg border border-gray-100"
                style={{ backgroundColor: hex }}
              />
              <p className="text-xs font-mono text-center text-gray-500">{key}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Swatch hex={colors.gray[50]} name="Gray / 50" usage="Background da página" />
          <Swatch hex={colors.gray[100]} name="Gray / 100" usage="Muted backgrounds, canvas" />
          <Swatch hex={colors.gray[200]} name="Gray / 200" usage="Borders padrão" />
          <Swatch hex={colors.gray[400]} name="Gray / 400" usage="Texto muted, placeholders" />
          <Swatch hex={colors.gray[600]} name="Gray / 600" usage="Texto secundário" />
          <Swatch hex={colors.gray[900]} name="Gray / 900" usage="Texto principal, headings" />
        </div>
      </div>
    </div>
  ),
}

// ─── Semantic Tokens ──────────────────────────────────────────────────────────

export const SemanticTokens: StoryObj = {
  name: 'Semantic Tokens',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Semantic Tokens</h2>
        <p className="text-sm text-gray-500 mb-6">
          Tokens com significado semântico. Use estes nos componentes, nunca as cores brutas.
        </p>

        <div className="flex flex-col gap-6">
          {/* Background */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Background</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(semantic.background).map(([key, hex]) => (
                <Swatch key={key} hex={hex} name={`bg.${key}`} usage={hex} />
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Text</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(semantic.text).map(([key, hex]) => (
                <Swatch key={key} hex={hex} name={`text.${key}`} usage={hex} />
              ))}
            </div>
          </div>

          {/* Brand */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Brand</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(semantic.brand).map(([key, hex]) => (
                <Swatch key={key} hex={hex} name={`brand.${key}`} usage={hex} />
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Swatch hex={colors.success[500]} name="Success" usage="Confirmações, seguro incluso" />
              <Swatch hex={colors.danger[500]} name="Danger" usage="Erros, limite atingido" />
              <Swatch hex={colors.warning[500]} name="Warning" usage="Alertas, trial expirando" />
              <Swatch hex={colors.gray[400]} name="Neutral" usage="Estados desabilitados" />
            </div>
          </div>

          {/* Planos */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Planos</h3>
            <div className="grid grid-cols-3 gap-3">
              <Swatch hex={semantic.plan.free} name="plan.free" usage="Plano gratuito" />
              <Swatch hex={semantic.plan.trial} name="plan.trial" usage="Trial ativo" />
              <Swatch hex={semantic.plan.pro} name="plan.pro" usage="Assinante PRO" />
            </div>
          </div>

          {/* Tipos de caminhão */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tipos de Caminhão</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Swatch hex={semantic.truck.fiorino} name="Fiorino" usage="Utilitário compacto" />
              <Swatch hex={semantic.truck.hr} name="HR / Sprinter" usage="Médio porte" />
              <Swatch hex={semantic.truck.treQuartos} name="3/4 Truck" usage="Carga média-grande" />
              <Swatch hex={semantic.truck.bau} name="Baú" usage="Grande, apartamento inteiro" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// ─── Full Token Map ────────────────────────────────────────────────────────────

export const FullTokenMap: StoryObj = {
  name: 'Full Token Map',
  render: () => (
    <div className="p-8">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Full Token Map</h2>
      <p className="text-sm text-gray-500 mb-6">
        Todas as cores do sistema em uma única visualização.
      </p>
      <div className="flex flex-col gap-6">
        <PaletteRow label="Primary (Vermelho Brand)" scale={colors.primary} />
        <PaletteRow label="Accent (Âmbar)" scale={colors.accent} />
        <PaletteRow label="Gray (Neutro)" scale={colors.gray} />
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Status</h3>
          <div className="grid grid-cols-4 gap-3" style={{ maxWidth: 300 }}>
            {Object.entries({ ...colors.success, ...colors.danger, ...colors.warning }).map(([key, hex]) => (
              <div key={`${hex}-${key}`} className="flex flex-col gap-1">
                <div className="h-10 rounded-lg border border-gray-100" style={{ backgroundColor: hex }} />
                <p className="text-xs font-mono text-center text-gray-500">{key}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
}
