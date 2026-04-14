import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { TrialBanner } from '@/components/paywall/PaywallGate'
import { MudancaCard } from '@/components/dashboard/MudancaCard'
import { EmptyStateMudancas } from '@/components/dashboard/EmptyStateMudancas'
import type { Prisma } from '../../generated/prisma/client'

type MudancaComRelacoes = Prisma.MudancaGetPayload<{
  include: { caminhao: true; itens: true; cotacoes: { where: { contratada: true } } }
}>

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      mudancas: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { caminhao: true, itens: true, cotacoes: { where: { contratada: true } } },
      },
    },
  })

  if (!user) redirect('/login')

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-6">
      <TrialBanner
        user={{
          plan: user.plan,
          trialEnd: user.trialEnd,
          subscriptionEnd: user.subscriptionEnd,
        }}
      />

      <div className="flex items-center justify-between mb-6 mt-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Mudanças</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie e planeje suas mudanças</p>
        </div>
      </div>

      {user.mudancas.length === 0 ? (
        <EmptyStateMudancas />
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
              melhorCotacaoCentavos={mudanca.cotacoes[0]?.precoCentavos ?? null}
              nomeTransportadoraContratada={mudanca.cotacoes[0]?.nomeTransportadora ?? null}
              progressoPercentual={mudanca.progressoPercentual}
              latOrigem={mudanca.latOrigem}
              lngOrigem={mudanca.lngOrigem}
              latDestino={mudanca.latDestino}
              lngDestino={mudanca.lngDestino}
            />
          ))}
        </div>
      )}
    </div>
  )
}

