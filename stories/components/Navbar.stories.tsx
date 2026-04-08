import type { Meta, StoryObj } from '@storybook/nextjs'

// Navbar usa next-auth session, então renderizamos uma versão visual
// diretamente para o Storybook, sem depender de autenticação

function NavbarVisual({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm border-b border-gray-200 bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 font-bold text-lg text-gray-900">
            🚛 MudaFácil
          </a>

          {/* Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Funcionalidades
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Preços
            </a>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <a
                  href="#"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </a>
                <button className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                  Sair
                </button>
              </>
            ) : (
              <>
                <a
                  href="#"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Entrar
                </a>
                <a
                  href="#"
                  className="text-sm font-semibold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Criar conta
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

const meta: Meta = {
  title: 'Components/Navbar',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white' },
  },
}

export default meta

// ─── Deslogado ────────────────────────────────────────────────────────────────

export const Deslogado: StoryObj = {
  name: 'Deslogado — Login + Criar conta',
  render: () => (
    <div>
      <NavbarVisual isLoggedIn={false} />
      <div className="p-8 bg-gray-50 min-h-40">
        <p className="text-sm text-gray-400">Conteúdo da página abaixo do header</p>
      </div>
    </div>
  ),
}

// ─── Logado ───────────────────────────────────────────────────────────────────

export const Logado: StoryObj = {
  name: 'Logado — Dashboard + Sair',
  render: () => (
    <div>
      <NavbarVisual isLoggedIn={true} />
      <div className="p-8 bg-gray-50 min-h-40">
        <p className="text-sm text-gray-400">Conteúdo da página abaixo do header</p>
      </div>
    </div>
  ),
}

// ─── Com TrialBanner ─────────────────────────────────────────────────────────

export const ComTrialBanner: StoryObj = {
  name: 'Com Trial Banner',
  render: () => (
    <div>
      {/* Trial banner acima do navbar */}
      <div className="flex items-center justify-between px-4 py-2 text-sm font-medium bg-amber-500 text-white">
        <span>🎉 Trial ativo — 9 dias restantes de acesso completo</span>
        <a href="#" className="ml-4 text-xs px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors whitespace-nowrap">
          Assinar PRO →
        </a>
      </div>
      <NavbarVisual isLoggedIn={true} />
      <div className="p-8 bg-gray-50 min-h-40">
        <p className="text-sm text-gray-400">Conteúdo da página abaixo do header</p>
      </div>
    </div>
  ),
}
