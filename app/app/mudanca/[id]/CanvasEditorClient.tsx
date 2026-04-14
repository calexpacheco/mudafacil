'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'
import type { CanvasEditor as CanvasEditorType } from './CanvasEditor'
import { useTranslations } from 'next-intl'

function CanvasLoadingFallback() {
  const t = useTranslations('canvasEditor')
  return <div className="h-96 flex items-center justify-center text-gray-400 text-sm">{t('loading')}</div>
}

const CanvasEditorDynamic = dynamic(
  () => import('./CanvasEditor').then((m) => m.CanvasEditor),
  { ssr: false, loading: () => <CanvasLoadingFallback /> }
)

export function CanvasEditorClient(props: ComponentProps<typeof CanvasEditorType>) {
  return <CanvasEditorDynamic {...props} />
}
