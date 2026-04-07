// @ts-ignore — Prisma 7 generated client
import { PrismaClient } from '../app/generated/prisma/client.ts'
import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'
import { CATALOGO_ITENS } from '../lib/catalogo-itens'
import { CAMINHOES } from '../lib/caminhoes'

async function main() {
  console.log('🌱 Seeding banco de dados MudaFácil...')

  // WebSocket for Node.js
  neonConfig.webSocketConstructor = ws

  // PrismaNeon is a factory — pass config (not a Pool instance)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new (PrismaNeon as any)({ connectionString: process.env.DATABASE_URL! })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db: any = new (PrismaClient as any)({ adapter })

  for (const caminhao of CAMINHOES) {
    await db.caminhao.upsert({
      where: { id: caminhao.id },
      update: {},
      create: {
        id: caminhao.id,
        nome: caminhao.nome,
        tipo: caminhao.tipo,
        capacidadeM3: caminhao.capacidadeM3,
        capacidadeKg: caminhao.capacidadeKg,
        comprimentoCm: caminhao.comprimentoCm,
        larguraCm: caminhao.larguraCm,
        alturaCm: caminhao.alturaCm,
        imagemUrl: caminhao.imagemUrl,
      },
    })
  }
  console.log(`✅ ${CAMINHOES.length} caminhões inseridos`)

  for (const item of CATALOGO_ITENS) {
    await db.item.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        nome: item.nome,
        categoria: item.categoria,
        iconeUrl: item.iconeUrl,
        larguraCm: item.larguraCm,
        alturaCm: item.alturaCm,
        profundidadeCm: item.profundidadeCm,
        pesoKg: item.pesoKg,
        volumeM3: item.volumeM3,
      },
    })
  }
  console.log(`✅ ${CATALOGO_ITENS.length} itens de catálogo inseridos`)

  const transportadoras = [
    { id: 't1', nome: 'MudaBR Express', notaMedia: 4.8, totalAvaliacoes: 312, cidade: 'São Paulo', tiposCaminhao: ['HR', 'TRES_QUARTOS'] },
    { id: 't2', nome: 'Rápido Mudanças', notaMedia: 4.2, totalAvaliacoes: 87, cidade: 'São Paulo', tiposCaminhao: ['FIORINO', 'HR'] },
    { id: 't3', nome: 'Mudança Segura', notaMedia: 4.6, totalAvaliacoes: 204, cidade: 'São Paulo', tiposCaminhao: ['TRES_QUARTOS', 'BAU'] },
    { id: 't4', nome: 'TransFácil', notaMedia: 3.9, totalAvaliacoes: 45, cidade: 'Campinas', tiposCaminhao: ['HR'] },
    { id: 't5', nome: 'CargaMove', notaMedia: 4.7, totalAvaliacoes: 178, cidade: 'Rio de Janeiro', tiposCaminhao: ['TRES_QUARTOS', 'BAU'] },
  ]

  for (const t of transportadoras) {
    await db.transportadora.upsert({
      where: { id: t.id },
      update: {},
      create: t,
    })
  }
  console.log(`✅ ${transportadoras.length} transportadoras inseridas`)
  console.log('🎉 Seed concluído!')

  await db.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
