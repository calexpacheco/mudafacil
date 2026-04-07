import Link from 'next/link'
import { auth } from '@/lib/auth'
import { signOut } from '@/lib/auth'

export async function Navbar() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900">
          <span className="text-2xl">🚛</span>
          <span>
            Muda<span className="text-blue-600">Fácil</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link href="/#features" className="hover:text-gray-900 transition-colors">Recursos</Link>
          <Link href="/#pricing" className="hover:text-gray-900 transition-colors">Preços</Link>
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </Link>
              <form action={async () => { 'use server'; await signOut({ redirectTo: '/' }) }}>
                <button
                  type="submit"
                  className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/login"
                className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                Começar grátis
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
