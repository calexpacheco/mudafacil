import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { TrialBanner } from '@/components/paywall/PaywallGate'
import { Navbar } from '@/components/layout/Navbar'
import { MudancaCard } from '@/components/dashboard/MudancaCard'
import type { Prisma } from '../generated/prisma/client'

type MudancaComRelacoes = Prisma.MudancaGetPayload<{
  include: { caminhao: true; itens: true }
}>

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      mudancas: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { caminhao: true, itens: true },
      },
    },
  })

  if (!user) redirect('/login')

  return (
    <>
      <Navbar />
      <TrialBanner
        user={{
          plan: user.plan,
          trialEnd: user.trialEnd,
          subscriptionEnd: user.subscriptionEnd,
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Minhas Mudanças</h1>
            <p className="text-gray-500 text-sm mt-1">Gerencie e planeje suas mudanças</p>
          </div>
          <Link
            href="/app/nova-mudanca"
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            + Nova Mudança
          </Link>
        </div>

        {user.mudancas.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {user.mudancas.map((mudanca: MudancaComRelacoes) => (
              <MudancaCard
                key={mudanca.id}
                id={mudanca.id}
                enderecoOrigem={mudanca.enderecoOrigem}
                enderecoDestino={mudanca.enderecoDestino}
                status={mudanca.status}
                totalItens={mudanca.itens.length}
                caminhaoNome={mudanca.caminhao?.nome ?? null}
                caminhaoTipo={mudanca.caminhao?.tipo ?? null}
                dataDesejada={mudanca.dataDesejada}
                valorEstimadoCentavos={mudanca.valorEstimadoCentavos}
                progressoPercentual={mudanca.progressoPercentual}
                latOrigem={mudanca.latOrigem}
                lngOrigem={mudanca.lngOrigem}
                latDestino={mudanca.latDestino}
                lngDestino={mudanca.lngDestino}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">📦</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma mudança ainda</h2>
      <p className="text-gray-500 text-sm mb-6">
        Crie sua primeira mudança e planeje visualmente com drag & drop.
      </p>
      <Link
        href="/app/nova-mudanca"
        className="inline-flex px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
      >
        Planejar minha mudança
      </Link>
    </div>
  )
}
