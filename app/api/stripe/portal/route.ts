import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createPortalSession } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  })

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: 'Sem assinatura ativa' }, { status: 400 })
  }

  const portalSession = await createPortalSession(user.stripeCustomerId)
  return NextResponse.json({ url: portalSession.url })
}
