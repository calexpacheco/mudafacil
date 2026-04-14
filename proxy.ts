import NextAuth from 'next-auth'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { authConfig } from './auth.config'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)
const { auth } = NextAuth(authConfig)

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas de API não precisam de intl nem auth redirect
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Verifica se é rota protegida (ignora prefixo de locale)
  const pathWithoutLocale = pathname.replace(/^\/(en|pt)/, '') || '/'
  const protectedRoutes = ['/dashboard', '/app', '/settings']
  const isProtected = protectedRoutes.some((r) => pathWithoutLocale.startsWith(r))

  if (isProtected) {
    // @ts-expect-error — auth aceita NextRequest
    const authResult = await auth(request)
    if (authResult instanceof NextResponse) return authResult
  }

  // Aplica detecção e redirecionamento de locale em todas as rotas
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|mp4|woff2?|ttf|eot)).*)',
  ],
}

