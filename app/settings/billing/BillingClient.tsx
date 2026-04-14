'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Plan } from '@/lib/prisma-types'
import { IconCheck, IconX } from '@tabler/icons-react'

interface BillingClientProps {
  user: {
    plan: Plan
    stripeCustomerId: string | null
    subscriptionEnd: Date | null
    trialEnd: Date | null
    email: string | null
  }
}

export function BillingClient({ user }: BillingClientProps) {
  const t = useTranslations('billing')
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoading(false)
  }

  async function handlePortal() {
    setLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoading(false)
  }

  const isPro = user.plan === 'PRO'
  const isTrial = user.plan === 'TRIAL'

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">{t('currentPlan')}</p>
            <p className="text-xl font-bold text-gray-900">
              {isPro ? t('planPro') : isTrial ? t('planTrial') : t('planFree')}
            </p>
            {isTrial && user.trialEnd && (
              <p className="text-sm text-amber-600 mt-1">
                {t('trialExpires', { date: new Date(user.trialEnd).toLocaleDateString() })}
              </p>
            )}
            {isPro && user.subscriptionEnd && (
              <p className="text-sm text-gray-500 mt-1">
                {t('renewsOn', { date: new Date(user.subscriptionEnd).toLocaleDateString() })}
              </p>
            )}
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${
              isPro
                ? 'bg-blue-100 text-blue-700'
                : isTrial
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isPro ? t('statusActive') : isTrial ? t('statusTrial') : t('statusFree')}
          </span>
        </div>
      </div>

      {isPro ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900">{t('manageSubscription')}</h2>
          <p className="text-sm text-gray-500">{t('manageDescription')}</p>
          <button
            onClick={handlePortal}
            disabled={loading}
            className="w-fit px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {loading ? t('opening') : t('openPortal')}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-blue-600 bg-blue-50 p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">{t('proTitle')}</h2>
              <p className="text-sm text-gray-500 mt-1">{t('proSubtitle')}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{t('proPrice')}</p>
              <p className="text-xs text-gray-500">{t('proPeriod')}</p>
            </div>
          </div>
          <ul className="flex flex-col gap-2">
            {(t.raw('proFeatures') as string[]).map((item) => (
              <li key={item} className="text-sm text-gray-700 flex items-center gap-2">
                <IconCheck size={16} stroke={2} className="text-blue-600 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? t('redirecting') : t('subscribeCta')}
          </button>
        </div>
      )}
    </div>
  )
}
