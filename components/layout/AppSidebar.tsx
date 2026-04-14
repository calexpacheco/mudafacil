'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/design-system/utils'
import { IconPackage, IconCategory2, IconCreditCard, IconTruck, IconX } from '@tabler/icons-react'

interface AppSidebarProps {
  userName: string
  userEmail: string
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const NAV_LINKS = [
  { href: '/app/dashboard', label: 'Minhas Mudanças',    Icon: IconPackage },
  { href: '/app/catalogo',  label: 'Catálogo de Itens',  Icon: IconCategory2 },
  { href: '/app/billing',   label: 'Planos e Pagamentos', Icon: IconCreditCard },
]

export function AppSidebar({ userName, userEmail, mobileOpen = false, onMobileClose }: AppSidebarProps) {
  const pathname = usePathname()
  const initial = (userName || 'U').charAt(0).toUpperCase()

  return (
    <aside
      style={{ zIndex: 1200 }}
      className={cn(
        'fixed left-0 top-0 h-screen w-64 flex flex-col bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out',
        // Desktop: sempre visível
        'lg:translate-x-0',
        // Mobile: desliza conforme estado
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* ─── Brand ─────────────────────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#E83500] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:opacity-90 transition-opacity">
            <IconTruck size={22} stroke={1.5} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-base leading-tight">
              Muda<span className="text-[#E83500]">Fácil</span>
            </p>
            <p className="text-[11px] text-gray-400 leading-snug">Organize sua mudança</p>
          </div>
        </Link>

        {/* Botão fechar — só no mobile */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <IconX size={18} stroke={2} />
        </button>
      </div>

      {/* ─── Nav links ─────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_LINKS.map(({ href, label, Icon }) => {
          const isActive =
            pathname === href ||
            (href !== '/app/dashboard' && pathname.startsWith(href + '/')) ||
            (href === '/app/dashboard' && pathname.startsWith('/app/mudanca/'))
          return (
            <Link
              key={href}
              href={href}
              onClick={onMobileClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full',
                isActive
                  ? 'bg-[#FFF0EC] text-[#E83500]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon size={18} stroke={1.5} className="flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* ─── User info ─────────────────────────────────────────────────────── */}
      <div className="px-3 pb-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#E83500] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
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
