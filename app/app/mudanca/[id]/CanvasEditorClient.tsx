'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'
import type { CanvasEditor as CanvasEditorType } from './CanvasEditor'

const CanvasEditorDynamic = dynamic(
  () => import('./CanvasEditor').then((m) => m.CanvasEditor),
  { ssr: false, loading: () => <div className="h-96 flex items-center justify-center text-gray-400 text-sm">Carregando canvas...</div> }
)

export function CanvasEditorClient(props: ComponentProps<typeof CanvasEditorType>) {
  return <CanvasEditorDynamic {...props} />
}
