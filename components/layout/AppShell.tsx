'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { AppSidebar } from './AppSidebar'
import { AppTopbar } from './AppTopbar'
import { NovaMudancaModal } from '@/components/ui/NovaMudancaModal'
import { IconPlus } from '@tabler/icons-react'

interface AppShellProps {
  userName: string
  userEmail: string
  children: React.ReactNode
}

export function AppShell({ userName, userEmail, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen]     = useState(false)
  const pathname = usePathname()
  const t = useTranslations('app')
  // Na tela de edição de mudança o FAB próprio substitui este
  const hideFab = pathname.startsWith('/app/mudanca/')

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Overlay mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden"
          style={{ zIndex: 1100 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AppSidebar
        userName={userName}
        userEmail={userEmail}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 min-w-0">
        <AppTopbar
          userName={userName}
          userEmail={userEmail}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          onOpenModal={() => setModalOpen(true)}
        />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>

      {/* ─── FAB mobile — Nova Mudança (oculto nas páginas de edição) ──────── */}
      {!hideFab && (
        <button
          onClick={() => setModalOpen(true)}
          className="lg:hidden fixed bottom-6 right-5 flex items-center gap-2 px-5 py-4 rounded-full bg-[#E83500] text-white font-bold text-sm shadow-xl hover:bg-[#C42A08] active:scale-95 transition-all cursor-pointer"
          style={{ zIndex: 1000 }}
          aria-label={t('newMove')}
        >
          <IconPlus size={20} stroke={2.5} />
          {t('newMove')}
        </button>
      )}

      {/* Modal */}
      {modalOpen && <NovaMudancaModal onClose={() => setModalOpen(false)} />}
    </div>
  )
}
