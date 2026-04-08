import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  cotacaoId: z.string(),
  nomeTransportadora: z.string(),
  precoCentavos: z.number().int().positive(),
  // tipo do caminhão (FIORINO | HR | TRES_QUARTOS | BAU) — usado para buscar no DB
  caminhaoTipo: z.enum(['FIORINO', 'HR', 'TRES_QUARTOS', 'BAU']),
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

  // Busca o caminhão no banco pelo tipo (IDs do DB são cuids, não os IDs do mock)
  let caminhao = await db.caminhao.findFirst({ where: { tipo: d.caminhaoTipo } })

  // Se não existe ainda no banco (seed não rodou), cria agora
  if (!caminhao) {
    const info = CAMINHAO_DEFAULTS[d.caminhaoTipo]
    caminhao = await db.caminhao.create({ data: info })
  }

  // Encontra ou cria a transportadora mock (upsert por nome slug)
  const slug = `mock-${d.nomeTransportadora.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
  let transportadora = await db.transportadora.findFirst({ where: { nome: d.nomeTransportadora } })
  if (!transportadora) {
    transportadora = await db.transportadora.create({
      data: { id: slug, nome: d.nomeTransportadora, cidade: 'São Paulo', notaMedia: 0, totalAvaliacoes: 0 },
    })
  }

  // Cancela cotação contratada anterior desta mudança
  await db.cotacao.updateMany({
    where: { mudancaId, contratada: true },
    data: { contratada: false },
  })

  // Cria a cotação contratada com IDs reais do banco
  const cotacao = await db.cotacao.create({
    data: {
      mudancaId,
      transportadoraId: transportadora.id,
      caminhaoId: caminhao.id,
      precoCentavos: d.precoCentavos,
      dataDisponivel: new Date(d.dataDisponivel),
      seguroIncluso: d.seguroIncluso,
      validade: new Date(d.validade),
      contratada: true,
      nomeTransportadora: d.nomeTransportadora,
    },
  })

  // Atualiza mudança: CONFIRMADO + preço + caminhão real
  await db.mudanca.update({
    where: { id: mudancaId },
    data: {
      status: 'CONFIRMADO',
      valorEstimadoCentavos: d.precoCentavos,
      progressoPercentual: 60,
      caminhaoId: caminhao.id,
    },
  })

  return NextResponse.json({ ok: true, cotacaoId: cotacao.id, caminhaoId: caminhao.id })
}

// Dados padrão para criar caminhões ausentes no banco
const CAMINHAO_DEFAULTS = {
  FIORINO:      { nome: 'Fiorino',      tipo: 'FIORINO'      as const, capacidadeM3: 2.5,  capacidadeKg: 650,   comprimentoCm: 200, larguraCm: 140, alturaCm: 110 },
  HR:           { nome: 'HR / Sprinter', tipo: 'HR'           as const, capacidadeM3: 7.5,  capacidadeKg: 1500,  comprimentoCm: 350, larguraCm: 180, alturaCm: 180 },
  TRES_QUARTOS: { nome: '3/4 Truck',    tipo: 'TRES_QUARTOS'  as const, capacidadeM3: 18,   capacidadeKg: 4000,  comprimentoCm: 550, larguraCm: 220, alturaCm: 200 },
  BAU:          { nome: 'Baú',          tipo: 'BAU'           as const, capacidadeM3: 40,   capacidadeKg: 10000, comprimentoCm: 750, larguraCm: 240, alturaCm: 240 },
}
