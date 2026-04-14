'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/design-system/utils'
import { signOutAction } from '@/app/app/actions'
import { IconBell, IconPlus, IconCreditCard, IconLogout, IconMenu2 } from '@tabler/icons-react'

interface AppTopbarProps {
  userName: string
  userEmail: string
  onToggleSidebar?: () => void
  onOpenModal?: () => void
}

export function AppTopbar({ userName, userEmail, onToggleSidebar, onOpenModal }: AppTopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
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
    <header
      className="sticky top-0 h-14 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-gray-200"
      style={{ zIndex: 1050 }}
    >
      {/* ─── Hambúrguer (só mobile) ──────────────────────────────────────── */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
        aria-label="Abrir menu"
      >
        <IconMenu2 size={20} stroke={1.5} />
      </button>

      <div className="hidden lg:block" />

      {/* ─── Right actions ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          title="Notificações"
          className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <IconBell size={20} stroke={1.5} />
        </button>

        {/* Nova Mudança — só visível no desktop */}
        <button
          onClick={onOpenModal}
          className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E83500] text-white text-sm font-semibold hover:bg-[#C42A08] transition-colors cursor-pointer"
        >
          <IconPlus size={16} stroke={2} />
          Nova Mudança
        </button>

        {/* User avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className={cn(
              'w-9 h-9 rounded-full bg-[#E83500] flex items-center justify-center text-white text-sm font-bold transition-colors cursor-pointer',
              dropdownOpen ? 'ring-2 ring-[#FA9370] ring-offset-1' : 'hover:opacity-90'
            )}
          >
            {initial}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden" style={{ zIndex: 1200 }}>
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">{userName || 'Usuário'}</p>
                <p className="text-xs text-gray-400 truncate">{userEmail}</p>
              </div>

              <div className="py-1">
                <Link
                  href="/app/billing"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <IconCreditCard size={16} stroke={1.5} className="text-gray-700" />
                  Planos e Pagamentos
                </Link>
              </div>

              <div className="border-t border-gray-100 py-1">
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <IconLogout size={16} stroke={1.5} className="text-red-600" />
                    Sair da conta
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
