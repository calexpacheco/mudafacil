import Link from 'next/link'

export default function VerifyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="text-5xl mb-4">📧</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifique seu email</h1>
        <p className="text-gray-500 text-sm mb-6">
          Enviamos um link de acesso para o seu email. Clique nele para entrar.
        </p>
        <Link href="/login" className="text-sm text-blue-600 hover:underline">
          ← Voltar ao login
        </Link>
      </div>
    </main>
  )
}
