import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { TrialBanner } from '@/components/paywall/PaywallGate'
import { Navbar } from '@/components/layout/Navbar'

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.mudancas.map((mudanca: { id: string; enderecoOrigem: string; enderecoDestino: string; status: string; itens: unknown[]; caminhao: { nome: string } | null }) => (
              <MudancaCard
                key={mudanca.id}
                id={mudanca.id}
                enderecoOrigem={mudanca.enderecoOrigem}
                enderecoDestino={mudanca.enderecoDestino}
                status={mudanca.status}
                totalItens={mudanca.itens.length}
                caminhaoNome={mudanca.caminhao?.nome ?? null}
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

const STATUS_LABELS: Record<string, string> = {
  RASCUNHO: 'Rascunho',
  AGUARDANDO_COTACAO: 'Aguardando cotação',
  COTADO: 'Cotado',
  CONFIRMADO: 'Confirmado',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
}

const STATUS_COLORS: Record<string, string> = {
  RASCUNHO: 'bg-gray-100 text-gray-600',
  AGUARDANDO_COTACAO: 'bg-amber-100 text-amber-700',
  COTADO: 'bg-blue-100 text-blue-700',
  CONFIRMADO: 'bg-green-100 text-green-700',
  CONCLUIDO: 'bg-green-100 text-green-700',
  CANCELADO: 'bg-red-100 text-red-700',
}

function MudancaCard({
  id,
  enderecoOrigem,
  enderecoDestino,
  status,
  totalItens,
  caminhaoNome,
}: {
  id: string
  enderecoOrigem: string
  enderecoDestino: string
  status: string
  totalItens: number
  caminhaoNome: string | null
}) {
  return (
    <Link
      href={`/app/mudanca/${id}`}
      className="flex flex-col gap-3 p-5 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 font-medium">ORIGEM</p>
          <p className="text-sm font-semibold text-gray-900 truncate">{enderecoOrigem}</p>
        </div>
        <span className="text-gray-400 text-lg flex-shrink-0">→</span>
        <div className="flex-1 min-w-0 text-right">
          <p className="text-xs text-gray-400 font-medium">DESTINO</p>
          <p className="text-sm font-semibold text-gray-900 truncate">{enderecoDestino}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[status] ?? 'bg-gray-100'}`}>
          {STATUS_LABELS[status] ?? status}
        </span>
        <div className="text-xs text-gray-400">
          {totalItens} itens{caminhaoNome ? ` · ${caminhaoNome}` : ''}
        </div>
      </div>
    </Link>
  )
}
