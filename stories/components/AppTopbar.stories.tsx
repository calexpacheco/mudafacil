import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/design-system/utils'
import { IconBell, IconPlus, IconCreditCard, IconLogout, IconTruck, IconPackage, IconCategory2 } from '@tabler/icons-react'

// AppTopbar usa server actions (signOut) — criamos versão visual para o Storybook

// ─── AppTopbarVisual ──────────────────────────────────────────────────────────

interface AppTopbarVisualProps {
  userName: string
  userEmail: string
  dropdownAberto?: boolean
}

function AppTopbarVisual({ userName, userEmail, dropdownAberto: initialOpen = false }: AppTopbarVisualProps) {
  const [dropdownOpen, setDropdownOpen] = useState(initialOpen)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const initial = (userName || 'U').charAt(0).toUpperCase()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center justify-end px-6 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3">
        <button
          title="Notificações"
          className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <IconBell size={20} stroke={1.5} className="text-gray-500" />
        </button>

        <a
          href="#"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <IconPlus size={16} stroke={2} />
          Nova Mudança
        </a>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className={cn(
              'w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold transition-colors',
              dropdownOpen ? 'ring-2 ring-blue-300 ring-offset-1' : 'hover:bg-blue-700'
            )}
          >
            {initial}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">{userName || 'Usuário'}</p>
                <p className="text-xs text-gray-400 truncate">{userEmail}</p>
              </div>
              <div className="py-1">
                <a
                  href="#"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <IconCreditCard size={16} stroke={1.5} className="text-gray-500" />
                  Planos e Pagamentos
                </a>
              </div>
              <div className="border-t border-gray-100 py-1">
                <button
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  onClick={() => alert('Sair (simulado)')}
                >
                  <IconLogout size={16} stroke={1.5} className="text-red-500" />
                  Sair da conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// ─── AppSidebarVisual (inline para o ShellCompleto) ───────────────────────────

const NAV_LINKS = [
  { href: '/app/dashboard', label: 'Minhas Mudanças', Icon: IconPackage },
  { href: '/app/catalogo',  label: 'Catálogo de Itens', Icon: IconCategory2 },
  { href: '/app/billing',   label: 'Planos e Pagamentos', Icon: IconCreditCard },
]

function AppSidebarVisual({ userName, userEmail, activeHref = '/app/dashboard' }: { userName: string; userEmail: string; activeHref?: string }) {
  const initial = (userName || 'U').charAt(0).toUpperCase()
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-gray-200">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
            <IconTruck size={22} stroke={1.5} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-base leading-tight">
              Muda<span className="text-blue-600">Fácil</span>
            </p>
            <p className="text-[11px] text-gray-400 leading-snug">Organize sua mudança</p>
          </div>
        </a>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {NAV_LINKS.map(({ href, label, Icon }) => {
          const isActive = activeHref === href
          return (
            <a
              key={href}
              href="#"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full',
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon size={18} stroke={1.5} className={isActive ? 'text-[#E83500]' : 'text-gray-600'} />
              {label}
            </a>
          )
        })}
      </nav>
      <div className="px-3 pb-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{userName || 'Usuário'}</p>
            <p className="text-xs text-gray-400 truncate">{userEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Components/Navigation/AppTopbar',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'mudafacil' },
  },
}

export default meta

// ─── Padrão ───────────────────────────────────────────────────────────────────

export const Padrao: StoryObj = {
  name: 'Padrão — Dropdown fechado',
  render: () => (
    <div>
      <AppTopbarVisual userName="Carlos Pacheco" userEmail="carlos@mudafacil.com.br" />
      <div className="p-8">
        <p className="text-sm text-gray-400">Conteúdo da página abaixo do topbar</p>
      </div>
    </div>
  ),
}

// ─── Dropdown aberto ──────────────────────────────────────────────────────────

export const DropdownAberto: StoryObj = {
  name: 'Dropdown — Aberto',
  render: () => (
    <div>
      <AppTopbarVisual
        userName="Carlos Pacheco"
        userEmail="carlos@mudafacil.com.br"
        dropdownAberto={true}
      />
      <div className="p-8">
        <p className="text-sm text-gray-400">Conteúdo da página abaixo do topbar</p>
      </div>
    </div>
  ),
}

// ─── Nome longo ───────────────────────────────────────────────────────────────

export const NomeLongo: StoryObj = {
  name: 'Nome longo — Dropdown aberto',
  render: () => (
    <div>
      <AppTopbarVisual
        userName="Augusto Fernandinho de Souza Cavalcante"
        userEmail="augusto.fernandinho.cavalcante@empresa.com.br"
        dropdownAberto={true}
      />
      <div className="p-8">
        <p className="text-sm text-gray-400">Conteúdo da página abaixo do topbar</p>
      </div>
    </div>
  ),
}

// ─── Shell completo: Topbar + Sidebar ─────────────────────────────────────────

export const ShellCompleto: StoryObj = {
  name: 'Shell — Sidebar + Topbar juntos',
  render: () => (
    <div className="flex h-screen bg-[#F8FAFC]">
      <AppSidebarVisual userName="Carlos Pacheco" userEmail="carlos@mudafacil.com.br" activeHref="/app/dashboard" />
      <div className="flex-1 flex flex-col min-w-0">
        <AppTopbarVisual userName="Carlos Pacheco" userEmail="carlos@mudafacil.com.br" />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Minhas Mudanças</h1>
          <p className="text-gray-500 text-sm">Gerencie e planeje suas mudanças</p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-xl border border-gray-200 bg-white animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
}
