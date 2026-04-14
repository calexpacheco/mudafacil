'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { IconPackage } from '@tabler/icons-react'
import { NovaMudancaModal } from '@/components/ui/NovaMudancaModal'

export function EmptyStateMudancas() {
  const [modalOpen, setModalOpen] = useState(false)
  const t = useTranslations('app.empty')

  return (
    <>
      <div className="text-center py-20">
        <div className="flex justify-center mb-4">
          <IconPackage size={64} stroke={1} className="text-gray-300" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('title')}</h2>
        <p className="text-gray-500 text-sm mb-6">
          {t('description')}
        </p>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex px-6 py-3 rounded-xl bg-[#E83500] text-white font-semibold hover:bg-[#C42A08] transition-colors"
        >
          {t('cta')}
        </button>
      </div>

      {modalOpen && <NovaMudancaModal onClose={() => setModalOpen(false)} />}
    </>
  )
}
