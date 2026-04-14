import Stripe from 'stripe'

// Lazy init — evita erro em build time quando env vars não estão disponíveis
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY não configurada')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-03-31.basil',
    })
  }
  return _stripe
}

// Alias para compatibilidade
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe]
  },
})

export async function createCheckoutSession({
  userId,
  email,
  stripeCustomerId,
}: {
  userId: string
  email: string
  stripeCustomerId?: string | null
}) {
  const s = getStripe()
  const session = await s.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: stripeCustomerId ?? undefined,
    customer_email: stripeCustomerId ? undefined : email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID_PRO!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing?canceled=true`,
    metadata: { userId },
    subscription_data: { metadata: { userId } },
  })

  return session
}

export async function createPortalSession(customerId: string) {
  const s = getStripe()
  const session = await s.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing`,
  })
  return session
}
