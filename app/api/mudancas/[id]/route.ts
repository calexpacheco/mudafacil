import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const PROGRESSO_POR_STATUS: Record<string, number> = {
  RASCUNHO: 5,
  AGUARDANDO_COTACAO: 25,
  COTADO: 45,
  CONFIRMADO: 60,
  EM_ANDAMENTO: 80,
  CONCLUIDO: 100,
  CANCELADO: 0,
}

const patchSchema = z.object({
  status: z
    .enum(['RASCUNHO', 'AGUARDANDO_COTACAO', 'COTADO', 'CONFIRMADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'])
    .optional(),
  valorEstimadoCentavos: z.number().int().min(0).nullable().optional(),
  progressoPercentual: z.number().min(0).max(100).optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: mudancaId } = await params
  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const mudanca = await db.mudanca.findUnique({
    where: { id: mudancaId, userId: session.user.id },
  })
  if (!mudanca) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const data: Record<string, unknown> = {}

  if (parsed.data.status !== undefined) {
    data.status = parsed.data.status
    // Auto-calcula progresso quando status muda (salvo se overrideado)
    if (parsed.data.progressoPercentual === undefined) {
      data.progressoPercentual = PROGRESSO_POR_STATUS[parsed.data.status] ?? mudanca.progressoPercentual
    }
  }

  if (parsed.data.valorEstimadoCentavos !== undefined) {
    data.valorEstimadoCentavos = parsed.data.valorEstimadoCentavos
  }

  if (parsed.data.progressoPercentual !== undefined) {
    data.progressoPercentual = parsed.data.progressoPercentual
  }

  const updated = await db.mudanca.update({
    where: { id: mudancaId },
    data,
  })

  return NextResponse.json(updated)
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: mudancaId } = await params

  const mudanca = await db.mudanca.findUnique({
    where: { id: mudancaId, userId: session.user.id },
    include: { caminhao: true, itens: { include: { item: true } }, cargaLayout: true },
  })

  if (!mudanca) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(mudanca)
}
