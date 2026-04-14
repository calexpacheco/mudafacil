'use server'

import { signOut } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function signOutAction() {
  await signOut({ redirectTo: '/' })
}

/** Persiste a preferência de locale para rotas de app (sem prefixo de URL). */
export async function setLocaleAction(locale: string) {
  const jar = await cookies()
  jar.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 ano
    sameSite: 'lax',
  })
}
