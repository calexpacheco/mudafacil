import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { NovaMudancaForm } from './NovaMudancaForm'

export default async function NovaMudancaPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const t = await getTranslations('novaMudanca')

  return (
    <>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-500 text-sm mb-8">{t('subtitle')}</p>
        <NovaMudancaForm />
      </main>
    </>
  )
}
