import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      if (!userId || !session.customer || !session.subscription) break

      const sub = await stripe.subscriptions.retrieve(session.subscription as string)
      const item = sub.items.data[0]
      const periodStart = new Date((item as unknown as { current_period_start?: number }).current_period_start
        ? (item as unknown as { current_period_start: number }).current_period_start * 1000
        : Date.now())
      const periodEnd = new Date((item as unknown as { current_period_end?: number }).current_period_end
        ? (item as unknown as { current_period_end: number }).current_period_end * 1000
        : Date.now() + 30 * 86400000)

      await db.user.update({
        where: { id: userId },
        data: {
          plan: 'PRO',
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          stripePriceId: item.price.id,
          subscriptionStart: periodStart,
          subscriptionEnd: periodEnd,
        },
      })
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string }
      if (!invoice.subscription) break

      const sub = await stripe.subscriptions.retrieve(invoice.subscription)
      const userId = sub.metadata?.userId
      if (!userId) break

      // Calcular período a partir da data da fatura
      const now = new Date()
      const nextMonth = new Date(now)
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      await db.user.update({
        where: { id: userId },
        data: {
          plan: 'PRO',
          subscriptionStart: now,
          subscriptionEnd: nextMonth,
        },
      })
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.userId
      if (!userId) break

      await db.user.update({
        where: { id: userId },
        data: {
          plan: 'FREE',
          stripeSubscriptionId: null,
          subscriptionEnd: null,
        },
      })
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.userId
      if (!userId) break

      // Buscar data de fim a partir do item ou metadata
      const now = new Date()
      const nextMonth = new Date(now)
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      await db.user.update({
        where: { id: userId },
        data: { subscriptionEnd: nextMonth },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}
