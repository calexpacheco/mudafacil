import type { Meta, StoryObj } from '@storybook/nextjs'
import { IconTruck, IconArrowRight, IconConfetti } from '@tabler/icons-react'

// Navbar usa next-auth session — versão visual estática para o Storybook

function NavbarVisual({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm border-b border-gray-200 bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-[#E83500] rounded-lg flex items-center justify-center group-hover:bg-[#C42A08] transition-colors">
              <IconTruck size={18} stroke={1.5} className="text-white" />
            </div>
            <span className="font-extrabold text-lg text-gray-900 leading-none">
              Muda<span className="text-[#E83500]">Fácil</span>
            </span>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Recursos
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Preços
            </a>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <a href="#" className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                  Minhas Mudanças
                </a>
                <button className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                  Sair
                </button>
              </>
            ) : (
              <>
                <a href="#" className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                  Entrar
                </a>
                <a
                  href="#"
                  className="text-sm px-4 py-2 rounded-lg bg-[#E83500] text-white font-bold hover:bg-[#C42A08] transition-colors shadow-md shadow-[#E83500]/20"
                >
                  Começar grátis
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
  name: 'Deslogado — Entrar + Começar grátis',
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
  name: 'Logado — Minhas Mudanças + Sair',
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
      <div className="flex items-center justify-between px-4 py-2 text-sm font-medium bg-amber-500 text-white">
        <span className="flex items-center gap-1.5"><IconConfetti size={16} stroke={1.5} /> Trial ativo — 9 dias restantes de acesso completo</span>
        <a href="#" className="ml-4 text-xs px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors whitespace-nowrap flex items-center gap-1">
          Assinar PRO <IconArrowRight size={14} stroke={1.5} />
        </a>
      </div>
      <NavbarVisual isLoggedIn={true} />
      <div className="p-8 bg-gray-50 min-h-40">
        <p className="text-sm text-gray-400">Conteúdo da página abaixo do header</p>
      </div>
    </div>
  ),
}

// ─── Sobre fundo dark ─────────────────────────────────────────────────────────

export const SobreFundoDark: StoryObj = {
  name: 'Contexto — Landing page dark footer',
  render: () => (
    <div className="bg-[#1A0808] p-8 flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-[#E83500] rounded-lg flex items-center justify-center">
          <IconTruck size={18} stroke={1.5} className="text-white" />
        </div>
        <span className="font-extrabold text-lg text-white leading-none">
          Muda<span className="text-[#E83500]">Fácil</span>
        </span>
      </div>
      <p className="text-sm text-gray-400">Footer da landing page com fundo dark brand</p>
    </div>
  ),
}
