import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { CanvasEditorClient as CanvasEditor } from './CanvasEditorClient'
import { Navbar } from '@/components/layout/Navbar'
import { TrialBanner } from '@/components/paywall/PaywallGate'
import { CAMINHOES } from '@/lib/caminhoes'

interface Props {
  params: Promise<{ id: string }>
}

export default async function MudancaPage({ params }: Props) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const mudanca = await db.mudanca.findUnique({
    where: { id, userId: session.user.id },
    include: {
      itens: { include: { item: true } },
      cargaLayout: true,
      caminhao: true,
      cotacoes: { include: { transportadora: true, caminhao: true } },
    },
  })

  if (!mudanca) notFound()

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, trialEnd: true, subscriptionEnd: true },
  })

  const caminhaoInicial = mudanca.caminhao ?? CAMINHOES[0]

  return (
    <>
      <Navbar />
      {user && <TrialBanner user={user} />}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900">
            {mudanca.enderecoOrigem} → {mudanca.enderecoDestino}
          </h1>
          <p className="text-gray-500 text-sm">Monte visualmente sua carga</p>
        </div>

        <CanvasEditor
          mudancaId={mudanca.id}
          caminhaoInicial={caminhaoInicial as typeof CAMINHOES[0]}
          layoutInicial={mudanca.cargaLayout}
          plan={user?.plan ?? 'FREE'}
          filtrosAvancados={user?.plan !== 'FREE'}
        />
      </main>
    </>
  )
}
