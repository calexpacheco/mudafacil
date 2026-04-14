import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { CatalogoClient } from './CatalogoClient'

export default async function CatalogoPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  // Busca mudanças ativas do usuário para o "Adicionar à mudança"
  const mudancas = await db.mudanca.findMany({
    where: {
      userId: session.user.id,
      status: { notIn: ['CONCLUIDO', 'CANCELADO'] },
    },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, enderecoOrigem: true, enderecoDestino: true },
  })

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Catálogo de Itens</h1>
        <p className="text-gray-500 text-sm mt-1">
          Explore os itens disponíveis e adicione à sua mudança
        </p>
      </div>

      <CatalogoClient mudancas={mudancas} />
    </div>
  )
}
