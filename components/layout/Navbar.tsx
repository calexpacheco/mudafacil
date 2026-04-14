import Link from 'next/link'
import { auth } from '@/lib/auth'
import { signOut } from '@/lib/auth'
import { IconTruck } from '@tabler/icons-react'
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher'

export async function Navbar() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-[#E83500] rounded-lg flex items-center justify-center text-white group-hover:bg-[#C42A08] transition-colors">
            <IconTruck size={18} stroke={2} className="text-white" />
          </div>
          <span className="font-extrabold text-lg text-gray-900 leading-none">
            Muda<span className="text-[#E83500]">Fácil</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link href="/#features" className="hover:text-gray-900 transition-colors font-medium">Recursos</Link>
          <Link href="/#pricing" className="hover:text-gray-900 transition-colors font-medium">Preços</Link>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          {session ? (
            <>
              <Link
                href="/app/dashboard"
                className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                Minhas Mudanças
              </Link>
              <form action={async () => { 'use server'; await signOut({ redirectTo: '/' }) }}>
                <button
                  type="submit"
                  className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/login"
                className="text-sm px-4 py-2 rounded-lg bg-[#E83500] text-white font-bold hover:bg-[#C42A08] transition-colors shadow-md shadow-[#E83500]/20"
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
