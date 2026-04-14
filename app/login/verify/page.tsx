import Link from 'next/link'
import { IconMail } from '@tabler/icons-react'

export default function VerifyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#1A0808] px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-[#E83500] rounded-2xl flex items-center justify-center shadow-xl shadow-[#E83500]/30">
          <IconMail size={32} stroke={1.5} className="text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-white mb-2">Verifique seu email</h1>
        <p className="text-gray-400 text-sm mb-6">
          Enviamos um link de acesso para o seu email. Clique nele para entrar.
        </p>
        <Link href="/login" className="text-sm text-[#E83500] hover:text-[#FA9370] transition-colors">
          ← Voltar ao login
        </Link>
      </div>
    </main>
  )
}
