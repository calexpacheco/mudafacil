import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { NovaMudancaForm } from './NovaMudancaForm'
import { Navbar } from '@/components/layout/Navbar'

export default async function NovaMudancaPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nova Mudança</h1>
        <p className="text-gray-500 text-sm mb-8">
          Preencha os dados da sua mudança para começar a montar o canvas.
        </p>
        <NovaMudancaForm />
      </main>
    </>
  )
}
