'use client'

import { hasAccess, daysLeftInTrial } from '@/lib/subscription'
import type { Plan } from '@/lib/prisma-types'
import { cn } from '@/design-system/utils'
import { useTranslations } from 'next-intl'
import { IconAlertTriangle, IconConfetti, IconLock } from '@tabler/icons-react'

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
  const t = useTranslations('app.trial')
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
      <span className="flex items-center gap-1.5">
        {isExpiring
          ? <><IconAlertTriangle size={16} stroke={2} className="text-white flex-shrink-0" /> {t('expiring', { days })}</>
          : <><IconConfetti size={16} stroke={1.5} className="text-white flex-shrink-0" /> {t('active', { days })}</>}
      </span>
      <a
        href="/app/billing"
        className="ml-4 text-xs px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors whitespace-nowrap"
      >
        {t('subscribeCta')}
      </a>
    </div>
  )
}

function UpgradePrompt() {
  const t = useTranslations('app.paywall')
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
        <IconLock size={32} stroke={1.5} className="text-blue-600" />
      </div>
      <div>
        <p className="font-semibold text-gray-900">{t('title')}</p>
        <p className="text-sm text-gray-500 mt-1">{t('description')}</p>
      </div>
      <a
        href="/app/billing"
        className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        {t('cta')}
      </a>
    </div>
  )
}
