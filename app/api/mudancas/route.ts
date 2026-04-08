import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PLAN_LIMITS } from '@/lib/plan-limits'
import { hasAccess } from '@/lib/subscription'
import { geocodeAddress } from '@/lib/geocoding'

const createMudancaSchema = z.object({
  enderecoOrigem: z.string().min(5, 'Endereço de origem obrigatório'),
  enderecoDestino: z.string().min(5, 'Endereço de destino obrigatório'),
  dataDesejada: z.string().nullable().optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = createMudancaSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      mudancas: { where: { status: { not: 'CANCELADO' } } },
    },
  })

  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

  const userSub = { plan: user.plan, trialEnd: user.trialEnd, subscriptionEnd: user.subscriptionEnd }

  if (!hasAccess(userSub)) {
    const plan = user.plan as 'FREE' | 'TRIAL' | 'PRO'
    const limit = PLAN_LIMITS[plan].mudancasAtivas
    if (user.mudancas.length >= limit) {
      return NextResponse.json(
        { error: `Limite de ${limit} mudança(s) ativa(s) no plano Free. Faça upgrade.`, code: 'LIMIT_REACHED' },
        { status: 403 }
      )
    }
  }

  // Geocodifica endereços em paralelo (best-effort — não bloqueia criação)
  const [geoOrigem, geoDestino] = await Promise.all([
    geocodeAddress(parsed.data.enderecoOrigem),
    geocodeAddress(parsed.data.enderecoDestino),
  ])

  const mudanca = await db.mudanca.create({
    data: {
      userId: session.user.id,
      enderecoOrigem: parsed.data.enderecoOrigem,
      enderecoDestino: parsed.data.enderecoDestino,
      dataDesejada: parsed.data.dataDesejada ? new Date(parsed.data.dataDesejada) : null,
      latOrigem: geoOrigem?.lat ?? null,
      lngOrigem: geoOrigem?.lng ?? null,
      latDestino: geoDestino?.lat ?? null,
      lngDestino: geoDestino?.lng ?? null,
    },
  })

  return NextResponse.json({ id: mudanca.id }, { status: 201 })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const mudancas = await db.mudanca.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { caminhao: true, itens: { include: { item: true } } },
  })

  return NextResponse.json(mudancas)
}
