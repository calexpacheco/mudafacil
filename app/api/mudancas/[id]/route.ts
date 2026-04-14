import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { geocodeAddress } from '@/lib/geocoding'
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
  enderecoOrigem: z.string().min(5).optional(),
  enderecoDestino: z.string().min(5).optional(),
  dataDesejada: z.string().nullable().optional(),
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

  // ── Atualização de endereços ──────────────────────────────────────────────
  const enderecoChanged =
    parsed.data.enderecoOrigem !== undefined || parsed.data.enderecoDestino !== undefined

  if (enderecoChanged) {
    const novoOrigem = parsed.data.enderecoOrigem ?? mudanca.enderecoOrigem
    const novoDestino = parsed.data.enderecoDestino ?? mudanca.enderecoDestino

    data.enderecoOrigem = novoOrigem
    data.enderecoDestino = novoDestino

    // Re-geocoda ambos os endereços em paralelo
    const [geoOrigem, geoDestino] = await Promise.all([
      geocodeAddress(novoOrigem),
      geocodeAddress(novoDestino),
    ])

    data.latOrigem = geoOrigem?.lat ?? null
    data.lngOrigem = geoOrigem?.lng ?? null
    data.latDestino = geoDestino?.lat ?? null
    data.lngDestino = geoDestino?.lng ?? null

    // Reseta cotações, valor e status (rota mudou — cotações antigas são inválidas)
    await db.cotacao.deleteMany({ where: { mudancaId } })
    data.valorEstimadoCentavos = null
    data.caminhaoId = null
    data.status = 'RASCUNHO'
    data.progressoPercentual = PROGRESSO_POR_STATUS.RASCUNHO
  }

  // ── Campos avulsos (só aplicados se não for troca de endereço) ────────────
  if (!enderecoChanged) {
    if (parsed.data.status !== undefined) {
      data.status = parsed.data.status
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

    if (parsed.data.dataDesejada !== undefined) {
      data.dataDesejada = parsed.data.dataDesejada ? new Date(parsed.data.dataDesejada) : null
    }
  }

  const updated = await db.mudanca.update({
    where: { id: mudancaId },
    data,
  })

  return NextResponse.json({ ...updated, enderecoChanged })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: mudancaId } = await params

  const mudanca = await db.mudanca.findUnique({
    where: { id: mudancaId, userId: session.user.id },
  })
  if (!mudanca) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.mudanca.delete({ where: { id: mudancaId } })

  return NextResponse.json({ ok: true })
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
