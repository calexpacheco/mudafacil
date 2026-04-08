import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  cotacaoId: z.string(),               // ID do mock (ou real)
  nomeTransportadora: z.string(),
  precoCentavos: z.number().int().positive(),
  caminhaoId: z.string(),              // ID real do Caminhao no banco
  dataDisponivel: z.string(),
  seguroIncluso: z.boolean(),
  validade: z.string(),
})

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: mudancaId } = await params

  const mudanca = await db.mudanca.findUnique({
    where: { id: mudancaId, userId: session.user.id },
  })
  if (!mudanca) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const d = parsed.data

  // Encontra ou cria a transportadora (mock → upsert por nome)
  const transportadora = await db.transportadora.upsert({
    where: { id: `mock-${d.nomeTransportadora.toLowerCase().replace(/\s+/g, '-')}` },
    create: {
      id: `mock-${d.nomeTransportadora.toLowerCase().replace(/\s+/g, '-')}`,
      nome: d.nomeTransportadora,
      cidade: 'São Paulo',
      notaMedia: 0,
      totalAvaliacoes: 0,
    },
    update: {},
  })

  // Cancela qualquer cotação contratada anterior desta mudança
  await db.cotacao.updateMany({
    where: { mudancaId, contratada: true },
    data: { contratada: false },
  })

  // Cria (ou recria) a cotação contratada
  const cotacao = await db.cotacao.create({
    data: {
      mudancaId,
      transportadoraId: transportadora.id,
      caminhaoId: d.caminhaoId,
      precoCentavos: d.precoCentavos,
      dataDisponivel: new Date(d.dataDisponivel),
      seguroIncluso: d.seguroIncluso,
      validade: new Date(d.validade),
      contratada: true,
      nomeTransportadora: d.nomeTransportadora,
    },
  })

  // Atualiza a mudança: status CONFIRMADO + valor + caminhão
  await db.mudanca.update({
    where: { id: mudancaId },
    data: {
      status: 'CONFIRMADO',
      valorEstimadoCentavos: d.precoCentavos,
      progressoPercentual: 60,
      caminhaoId: d.caminhaoId,
    },
  })

  return NextResponse.json({ ok: true, cotacaoId: cotacao.id })
}
