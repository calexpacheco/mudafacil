import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: mudancaId } = await params
  const body = await req.json()
  const { itensPositionados, caminhaoId, ocupacaoPercentual } = body

  // Verifica que a mudança pertence ao usuário
  const mudanca = await db.mudanca.findUnique({
    where: { id: mudancaId, userId: session.user.id },
  })
  if (!mudanca) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Upsert do layout
  const layout = await db.cargaLayout.upsert({
    where: { mudancaId },
    update: { itensPositionados, caminhaoId, ocupacaoPercentual },
    create: { mudancaId, itensPositionados, caminhaoId, ocupacaoPercentual },
  })

  // Atualiza o caminhão da mudança também
  await db.mudanca.update({
    where: { id: mudancaId },
    data: { caminhaoId },
  })

  return NextResponse.json({ ok: true, layout })
}
