'use client'

import { hasAccess, daysLeftInTrial } from '@/lib/subscription'
import type { Plan } from '@/lib/prisma-types'
import { cn } from '@/design-system/utils'

interface UserInfo {
  plan: Plan
  trialEnd: Date | null
  subscriptionEnd: Date | null
}

interface PaywallGateProps {
  user: UserInfo
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PaywallGate({ user, children, fallback }: PaywallGateProps) {
  if (!hasAccess(user)) {
    return fallback ? <>{fallback}</> : <UpgradePrompt />
  }
  return <>{children}</>
}

export function TrialBanner({ user }: { user: UserInfo }) {
  if (user.plan !== 'TRIAL') return null

  const days = daysLeftInTrial(user)
  const isExpiring = days <= 3

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-2 text-sm font-medium',
        isExpiring ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
      )}
    >
      <span>
        {isExpiring
          ? `⚠️ Seu trial expira em ${days} dia${days !== 1 ? 's' : ''}!`
          : `🎉 Trial ativo — ${days} dias restantes de acesso completo`}
      </span>
      <a
        href="/settings/billing"
        className="ml-4 text-xs px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors whitespace-nowrap"
      >
        Assinar PRO →
      </a>
    </div>
  )
}

function UpgradePrompt() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50">
      <div className="text-4xl">🔒</div>
      <div>
        <p className="font-semibold text-gray-900">Recurso PRO</p>
        <p className="text-sm text-gray-500 mt-1">
          Assine o MudaFácil PRO por R$ 29,90/mês para desbloquear este recurso.
        </p>
      </div>
      <a
        href="/settings/billing"
        className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        Assinar PRO — R$ 29,90/mês
      </a>
    </div>
  )
}
