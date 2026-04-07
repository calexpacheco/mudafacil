// Config leve do Auth.js — sem providers nem adapter, usado apenas no proxy (Edge Runtime)
// O proxy só precisa verificar se o usuário está autenticado via JWT cookie
import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  providers: [], // providers ficam apenas em lib/auth.ts
  pages: {
    signIn: '/login',
    verifyRequest: '/login/verify',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const protectedRoutes = ['/dashboard', '/app', '/settings']
      const isProtected = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      )
      if (isProtected && !isLoggedIn) {
        const loginUrl = new URL('/login', nextUrl)
        loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
        return Response.redirect(loginUrl)
      }
      return true
    },
  },
}
