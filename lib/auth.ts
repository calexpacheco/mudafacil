import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { db } from '@/lib/db'
import { addDays } from 'date-fns'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY!,
      from: 'MudaFácil <onboarding@resend.dev>',
    }),
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/login/verify',
  },
  events: {
    async createUser({ user }) {
      const now = new Date()
      await db.user.update({
        where: { id: user.id! },
        data: {
          plan: 'TRIAL',
          trialStart: now,
          trialEnd: addDays(now, 14),
        },
      })
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Primeiro login: user está presente. token.sub = id do usuário (sempre preenchido)
      if (user || account) {
        const userId = user?.id ?? token.sub!
        token.id = userId
        try {
          const dbUser = await db.user.findUnique({
            where: { id: userId },
            select: { plan: true, trialEnd: true, subscriptionEnd: true },
          })
          token.plan = dbUser?.plan ?? 'FREE'
          token.trialEnd = dbUser?.trialEnd ?? null
          token.subscriptionEnd = dbUser?.subscriptionEnd ?? null
        } catch {
          token.plan = 'FREE'
          token.trialEnd = null
          token.subscriptionEnd = null
        }
      }
      // Garante que token.id nunca fica undefined
      if (!token.id) token.id = token.sub
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id ?? token.sub) as string
        session.user.plan = (token.plan ?? 'FREE') as 'FREE' | 'TRIAL' | 'PRO'
        session.user.trialEnd = (token.trialEnd ?? null) as Date | null
        session.user.subscriptionEnd = (token.subscriptionEnd ?? null) as Date | null
      }
      return session
    },
  },
})
