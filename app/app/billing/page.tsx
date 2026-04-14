import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { BillingClient } from '@/app/settings/billing/BillingClient'

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const sp = await searchParams

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      plan: true,
      stripeCustomerId: true,
      subscriptionEnd: true,
      trialEnd: true,
      email: true,
    },
  })

  if (!user) redirect('/login')

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Planos e Pagamentos</h1>
      <p className="text-gray-500 text-sm mb-8">Gerencie seu plano e pagamento</p>

      {sp.success && (
        <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-green-700 text-sm font-medium">
          🎉 Assinatura ativada com sucesso! Bem-vindo ao PRO.
        </div>
      )}

      {sp.canceled && (
        <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4 text-amber-700 text-sm">
          Pagamento cancelado. Você ainda pode assinar quando quiser.
        </div>
      )}

      <BillingClient user={user} />
    </div>
  )
}
