import type { Meta, StoryObj } from '@storybook/nextjs'
import { PaywallGate, TrialBanner } from '@/components/paywall/PaywallGate'

const meta: Meta = {
  title: 'Components/Paywall',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'mudafacil' },
  },
}

export default meta

// ─── TrialBanner — ativo com muitos dias ──────────────────────────────────────

export const TrialAtivo: StoryObj = {
  name: 'TrialBanner — Ativo (11 dias)',
  render: () => (
    <div>
      <TrialBanner
        user={{
          plan: 'TRIAL',
          trialEnd: new Date(Date.now() + 11 * 86400000),
          subscriptionEnd: null,
        }}
      />
      <div className="p-8 bg-gray-50">
        <p className="text-sm text-gray-500">
          Banner exibido quando o usuário está no trial com mais de 3 dias restantes.
        </p>
      </div>
    </div>
  ),
}

// ─── TrialBanner — expirando ──────────────────────────────────────────────────

export const TrialExpirando: StoryObj = {
  name: 'TrialBanner — Expirando (2 dias)',
  render: () => (
    <div>
      <TrialBanner
        user={{
          plan: 'TRIAL',
          trialEnd: new Date(Date.now() + 2 * 86400000),
          subscriptionEnd: null,
        }}
      />
      <div className="p-8 bg-gray-50">
        <p className="text-sm text-gray-500">
          Banner vermelho exibido quando faltam ≤3 dias para o trial expirar.
        </p>
      </div>
    </div>
  ),
}

// ─── TrialBanner — plano FREE (invisível) ────────────────────────────────────

export const TrialHidden: StoryObj = {
  name: 'TrialBanner — FREE (não exibe)',
  render: () => (
    <div className="p-8 bg-gray-50">
      <p className="text-xs text-gray-400 mb-4">
        O componente TrialBanner retorna null quando plan !== 'TRIAL':
      </p>
      <TrialBanner
        user={{ plan: 'FREE', trialEnd: null, subscriptionEnd: null }}
      />
      <div className="h-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
        <span className="text-xs text-gray-400">(banner não renderizado)</span>
      </div>
    </div>
  ),
}

// ─── PaywallGate — bloqueado ─────────────────────────────────────────────────

export const Bloqueado: StoryObj = {
  name: 'PaywallGate — Bloqueado (FREE)',
  render: () => (
    <div className="p-8 bg-gray-50">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Recurso bloqueado para FREE:</h2>
      <div className="max-w-sm">
        <PaywallGate
          user={{ plan: 'FREE', trialEnd: null, subscriptionEnd: null }}
        >
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <p>Conteúdo PRO aqui</p>
          </div>
        </PaywallGate>
      </div>
    </div>
  ),
}

// ─── PaywallGate — liberado Trial ────────────────────────────────────────────

export const LiberadoTrial: StoryObj = {
  name: 'PaywallGate — Liberado (TRIAL)',
  render: () => (
    <div className="p-8 bg-gray-50">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Recurso liberado para TRIAL:</h2>
      <div className="max-w-sm">
        <PaywallGate
          user={{
            plan: 'TRIAL',
            trialEnd: new Date(Date.now() + 10 * 86400000),
            subscriptionEnd: null,
          }}
        >
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <p className="text-sm font-semibold text-gray-900">✅ Conteúdo PRO desbloqueado</p>
            <p className="text-xs text-gray-500 mt-1">Filtros avançados, sem limite de itens, etc.</p>
          </div>
        </PaywallGate>
      </div>
    </div>
  ),
}

// ─── PaywallGate — liberado PRO ──────────────────────────────────────────────

export const LiberadoPro: StoryObj = {
  name: 'PaywallGate — Liberado (PRO)',
  render: () => (
    <div className="p-8 bg-gray-50">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Recurso liberado para PRO:</h2>
      <div className="max-w-sm">
        <PaywallGate
          user={{
            plan: 'PRO',
            trialEnd: null,
            subscriptionEnd: new Date(Date.now() + 30 * 86400000),
          }}
        >
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <p className="text-sm font-semibold text-gray-900">⭐ Assinante PRO</p>
            <p className="text-xs text-gray-500 mt-1">Acesso completo a todos os recursos.</p>
          </div>
        </PaywallGate>
      </div>
    </div>
  ),
}

// ─── Comparativo de planos ────────────────────────────────────────────────────

export const ComparativoPlanos: StoryObj = {
  name: 'Comparativo — FREE vs TRIAL vs PRO',
  render: () => {
    const feature = (
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <p className="text-sm font-semibold text-gray-900">📊 Relatório de Mudança</p>
        <p className="text-xs text-gray-500 mt-1">PDF com resumo completo da sua mudança</p>
      </div>
    )
    return (
      <div className="p-8 bg-gray-50">
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'FREE', user: { plan: 'FREE' as const, trialEnd: null, subscriptionEnd: null } },
            { label: 'TRIAL', user: { plan: 'TRIAL' as const, trialEnd: new Date(Date.now() + 10 * 86400000), subscriptionEnd: null } },
            { label: 'PRO', user: { plan: 'PRO' as const, trialEnd: null, subscriptionEnd: new Date(Date.now() + 30 * 86400000) } },
          ].map(({ label, user }) => (
            <div key={label}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  label === 'FREE' ? 'bg-gray-100 text-gray-500' :
                  label === 'TRIAL' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-600 text-white'
                }`}>
                  {label}
                </span>
              </div>
              <PaywallGate user={user}>{feature}</PaywallGate>
            </div>
          ))}
        </div>
      </div>
    )
  },
}
