'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { IconTrash, IconAlertTriangle, IconX } from '@tabler/icons-react'
import { createPortal } from 'react-dom'

// ─── Modal de confirmação ────────────────────────────────────────────────────

function ConfirmModal({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  const t = useTranslations('app.delete')
  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <IconAlertTriangle size={20} stroke={2} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">{t('title')}</h3>
            <p className="text-sm text-gray-500 mt-1">{t('description')}</p>
          </div>
          <button onClick={onCancel} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0">
            <IconX size={16} stroke={2} />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><IconTrash size={14} stroke={2} /> {t('confirm')}</>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ─── Botão ────────────────────────────────────────────────────────────────────

interface BotaoDeletarMudancaProps {
  mudancaId: string
  /** 'icon' = só ícone de lixeira | 'full' = botão com texto (para tela de detalhe) */
  variant?: 'icon' | 'full'
  /** Após deletar, redireciona para este caminho (padrão: /app/dashboard) */
  redirectTo?: string
}

export function BotaoDeletarMudanca({
  mudancaId,
  variant = 'icon',
  redirectTo = '/app/dashboard',
}: BotaoDeletarMudancaProps) {
  const router = useRouter()
  const t = useTranslations('app.delete')
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/mudancas/${mudancaId}`, { method: 'DELETE' })
      if (res.ok) {
        setShowConfirm(false)
        router.push(redirectTo)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {variant === 'icon' ? (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowConfirm(true) }}
          title="Excluir mudança"
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <IconTrash size={15} stroke={1.5} />
        </button>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
        >
          <IconTrash size={15} stroke={1.5} />
          {t('button')}
        </button>
      )}

      {showConfirm && (
        <ConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          loading={loading}
        />
      )}
    </>
  )
}
