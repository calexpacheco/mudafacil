import NextAuth from 'next-auth'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { authConfig } from './auth.config'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)
const { auth } = NextAuth(authConfig)

// Rotas que pertencem ao app (não precisam de locale prefix)
const APP_ROUTES = ['/app', '/login', '/settings', '/dashboard', '/api']

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verifica se é rota de app (sem locale)
  const isAppRoute = APP_ROUTES.some((r) => pathname.startsWith(r))

  if (isAppRoute) {
    // Protege rotas autenticadas
    const protectedRoutes = ['/app', '/settings', '/dashboard']
    const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))

    if (isProtected) {
      // @ts-expect-error — auth aceita NextRequest
      const authResult = await auth(request)
      if (authResult instanceof NextResponse) return authResult
    }

    return NextResponse.next()
  }

  // Apenas rotas da landing page passam pelo intl middleware
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|mp4|woff2?|ttf|eot)).*)',
  ],
}

