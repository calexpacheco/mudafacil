import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { CATALOGO_ITENS } from '@/lib/catalogo-itens'
import { CAMINHOES } from '@/lib/caminhoes'
import type { ItemPositionado } from '@/types/mudafacil'

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: mudancaId } = await params
  const { itemId } = await req.json()

  // Verifica que a mudança pertence ao usuário
  const mudanca = await db.mudanca.findUnique({
    where: { id: mudancaId, userId: session.user.id },
    include: { cargaLayout: true },
  })
  if (!mudanca) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Encontra o item no catálogo estático
  const itemCatalogo = CATALOGO_ITENS.find((i) => i.id === itemId)
  if (!itemCatalogo) return NextResponse.json({ error: 'Item not found' }, { status: 404 })

  // Lê o layout atual (ou inicia vazio)
  let itensPositionados: ItemPositionado[] = []
  let caminhaoId = mudanca.caminhaoId ?? CAMINHOES[0].id

  if (mudanca.cargaLayout) {
    try {
      itensPositionados = (mudanca.cargaLayout.itensPositionados as ItemPositionado[]) ?? []
      caminhaoId = mudanca.cargaLayout.caminhaoId
    } catch { /* ignore */ }
  }

  // Cria novo item posicionado com posição padrão (levemente escalonado)
  const offset = itensPositionados.length * 20
  const novoItem: ItemPositionado = {
    uid: uid(),
    itemId: itemCatalogo.id,
    item: itemCatalogo,
    x: offset % 200,
    y: Math.floor(offset / 200) * 20,
    rotacao: 0,
  }

  itensPositionados = [...itensPositionados, novoItem]

  // Calcula nova ocupação (baseado no primeiro caminhão se não houver layout)
  const caminhao = CAMINHOES.find((c) => c.id === caminhaoId) ?? CAMINHOES[0]
  const ocupacaoPercentual = Math.min(
    (itensPositionados.reduce((acc, i) => acc + i.item.volumeM3, 0) / caminhao.capacidadeM3) * 100,
    100
  )

  // Upsert do layout
  await db.cargaLayout.upsert({
    where: { mudancaId },
    update: { itensPositionados, ocupacaoPercentual },
    create: {
      mudancaId,
      caminhaoId,
      itensPositionados,
      ocupacaoPercentual,
    },
  })

  // Garante que a mudança aponta para o caminhão
  if (!mudanca.caminhaoId) {
    await db.mudanca.update({
      where: { id: mudancaId },
      data: { caminhaoId },
    })
  }

  return NextResponse.json({ ok: true, uid: novoItem.uid })
}
