'use client'

import { useState } from 'react'
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
            <p className="text-sm text-gray-500 font-medium mb-1">Plano atual</p>
            <p className="text-xl font-bold text-gray-900">
              {isPro ? 'PRO' : isTrial ? 'Trial Gratuito' : 'Free'}
            </p>
            {isTrial && user.trialEnd && (
              <p className="text-sm text-amber-600 mt-1">
                Trial expira em {new Date(user.trialEnd).toLocaleDateString('pt-BR')}
              </p>
            )}
            {isPro && user.subscriptionEnd && (
              <p className="text-sm text-gray-500 mt-1">
                Renova em {new Date(user.subscriptionEnd).toLocaleDateString('pt-BR')}
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
            {isPro ? 'Ativo' : isTrial ? 'Trial' : 'Gratuito'}
          </span>
        </div>
      </div>

      {isPro ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900">Gerenciar assinatura</h2>
          <p className="text-sm text-gray-500">
            Gerencie seu cartão, baixe faturas ou cancele pelo portal do Stripe.
          </p>
          <button
            onClick={handlePortal}
            disabled={loading}
            className="w-fit px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Abrindo...' : 'Acessar portal de faturamento'}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-blue-600 bg-blue-50 p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">MudaFácil PRO</h2>
              <p className="text-sm text-gray-500 mt-1">Tudo ilimitado para planejar sua mudança</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">R$ 29,90</p>
              <p className="text-xs text-gray-500">/mês</p>
            </div>
          </div>
          <ul className="flex flex-col gap-2">
            {[
              'Mudanças ilimitadas',
              'Itens ilimitados no canvas',
              'Cotações ilimitadas',
              'Filtros avançados de cotação',
              'Comparação lado a lado',
            ].map((item) => (
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
            {loading ? 'Redirecionando...' : 'Assinar PRO — R$ 29,90/mês'}
          </button>
        </div>
      )}
    </div>
  )
}
