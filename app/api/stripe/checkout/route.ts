import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createCheckoutSession } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, stripeCustomerId: true },
  })

  if (!user?.email) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  const checkoutSession = await createCheckoutSession({
    userId: session.user.id,
    email: user.email,
    stripeCustomerId: user.stripeCustomerId,
  })

  return NextResponse.json({ url: checkoutSession.url })
}
