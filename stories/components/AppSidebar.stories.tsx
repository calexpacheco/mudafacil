import type { Meta, StoryObj } from '@storybook/nextjs'
import { IconPackage, IconCategory2, IconCreditCard, IconTruck } from '@tabler/icons-react'

// AppSidebar usa usePathname — criamos versão visual estática para o Storybook

const NAV_LINKS = [
  { href: '/app/dashboard', label: 'Minhas Mudanças', Icon: IconPackage },
  { href: '/app/catalogo',  label: 'Catálogo de Itens', Icon: IconCategory2 },
  { href: '/app/billing',   label: 'Planos e Pagamentos', Icon: IconCreditCard },
]

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

interface SidebarVisualProps {
  userName: string
  userEmail: string
  activeHref?: string
}

function AppSidebarVisual({ userName, userEmail, activeHref = '/app/dashboard' }: SidebarVisualProps) {
  const initial = (userName || 'U').charAt(0).toUpperCase()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-white border-r border-gray-200 z-40">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:bg-blue-700 transition-colors">
            <IconTruck size={22} stroke={1.5} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-base leading-tight group-hover:text-blue-600 transition-colors">
              Muda<span className="text-blue-600">Fácil</span>
            </p>
            <p className="text-[11px] text-gray-400 leading-snug">Organize sua mudança</p>
          </div>
        </a>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_LINKS.map(({ href, label, Icon }) => {
          const isActive = activeHref === href || activeHref.startsWith(href + '/')
          return (
            <a
              key={href}
              href="#"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon size={18} stroke={1.5} className={isActive ? 'text-[#E83500]' : 'text-gray-600'} />
              {label}
            </a>
          )
        })}
      </nav>

      {/* User info */}
      <div className="px-3 pb-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate leading-snug">{userName || 'Usuário'}</p>
            <p className="text-xs text-gray-400 truncate leading-snug">{userEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Components/Navigation/AppSidebar',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'mudafacil' },
  },
}

export default meta

// ─── Minhas Mudanças ativo ────────────────────────────────────────────────────

export const Dashboard: StoryObj = {
  name: 'Ativo — Minhas Mudanças',
  render: () => (
    <div className="flex h-screen bg-gray-50">
      <AppSidebarVisual
        userName="Carlos Pacheco"
        userEmail="carlos@mudafacil.com.br"
        activeHref="/app/dashboard"
      />
      <div className="ml-64 flex-1 p-8">
        <p className="text-sm text-gray-400">Conteúdo da página</p>
      </div>
    </div>
  ),
}

// ─── Catálogo ativo ───────────────────────────────────────────────────────────

export const Catalogo: StoryObj = {
  name: 'Ativo — Catálogo de Itens',
  render: () => (
    <div className="flex h-screen bg-gray-50">
      <AppSidebarVisual
        userName="Carlos Pacheco"
        userEmail="carlos@mudafacil.com.br"
        activeHref="/app/catalogo"
      />
      <div className="ml-64 flex-1 p-8">
        <p className="text-sm text-gray-400">Conteúdo da página</p>
      </div>
    </div>
  ),
}

// ─── Billing ativo ────────────────────────────────────────────────────────────

export const Billing: StoryObj = {
  name: 'Ativo — Planos e Pagamentos',
  render: () => (
    <div className="flex h-screen bg-gray-50">
      <AppSidebarVisual
        userName="Carlos Pacheco"
        userEmail="carlos@mudafacil.com.br"
        activeHref="/app/billing"
      />
      <div className="ml-64 flex-1 p-8">
        <p className="text-sm text-gray-400">Conteúdo da página</p>
      </div>
    </div>
  ),
}

// ─── Nome longo ───────────────────────────────────────────────────────────────

export const NomeLongo: StoryObj = {
  name: 'Nome/email longo — truncado',
  render: () => (
    <div className="flex h-screen bg-gray-50">
      <AppSidebarVisual
        userName="Augusto Fernandinho de Souza Cavalcante"
        userEmail="augusto.fernandinho.cavalcante@empresa.com.br"
        activeHref="/app/dashboard"
      />
      <div className="ml-64 flex-1 p-8">
        <p className="text-sm text-gray-400">Conteúdo da página</p>
      </div>
    </div>
  ),
}

// ─── Sem nome ─────────────────────────────────────────────────────────────────

export const SemNome: StoryObj = {
  name: 'Sem nome — fallback inicial "U"',
  render: () => (
    <div className="flex h-screen bg-gray-50">
      <AppSidebarVisual
        userName=""
        userEmail="usuario@mudafacil.com.br"
        activeHref="/app/dashboard"
      />
      <div className="ml-64 flex-1 p-8">
        <p className="text-sm text-gray-400">Conteúdo da página</p>
      </div>
    </div>
  ),
}
