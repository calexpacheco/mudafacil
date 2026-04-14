import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { CanvasEditorClient as CanvasEditor } from './CanvasEditorClient'
import { TrialBanner } from '@/components/paywall/PaywallGate'
import { EnderecoEditor } from '@/components/mudanca/EnderecoEditor'
import { BotaoDeletarMudanca } from '@/components/dashboard/BotaoDeletarMudanca'
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

  // Cotação contratada mais recente (se houver)
  const cotacaoContratada = mudanca.cotacoes.find((c) => c.contratada) ?? null

  return (
    <>
      {user && <TrialBanner user={user} />}
      <main className="max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="mb-4">
          <div className="flex items-start justify-between gap-4">
            <EnderecoEditor
              mudancaId={mudanca.id}
              enderecoOrigem={mudanca.enderecoOrigem}
              enderecoDestino={mudanca.enderecoDestino}
            />
            <BotaoDeletarMudanca mudancaId={mudanca.id} variant="full" />
          </div>
          <p className="text-gray-500 text-sm mt-2">Monte visualmente sua carga</p>
        </div>

        <CanvasEditor
          mudancaId={mudanca.id}
          caminhaoInicial={caminhaoInicial as typeof CAMINHOES[0]}
          layoutInicial={mudanca.cargaLayout}
          plan={user?.plan ?? 'FREE'}
          filtrosAvancados={user?.plan !== 'FREE'}
          dataDesejadaInicial={mudanca.dataDesejada?.toISOString() ?? null}
          cotacaoContratadaInicial={cotacaoContratada ? {
            nomeTransportadora: cotacaoContratada.nomeTransportadora ?? cotacaoContratada.transportadora?.nome ?? '',
            precoCentavos:      cotacaoContratada.precoCentavos,
            dataDisponivel:     cotacaoContratada.dataDisponivel?.toISOString() ?? null,
            nomeVeiculo:        cotacaoContratada.caminhao?.nome ?? null,
            tipoVeiculo:        cotacaoContratada.caminhao?.tipo ?? null,
            seguroIncluso:      cotacaoContratada.seguroIncluso,
          } : null}
        />
      </main>
    </>
  )
}
