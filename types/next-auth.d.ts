import type { Plan } from '@/lib/prisma-types'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      plan: Plan
      trialEnd: Date | null
      subscriptionEnd: Date | null
    } & DefaultSession['user']
  }
}
