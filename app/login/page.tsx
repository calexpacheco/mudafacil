import { signIn } from '@/lib/auth'
import { IconTruck } from '@tabler/icons-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const { callbackUrl } = await searchParams
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#E83500] rounded-2xl flex items-center justify-center shadow-xl shadow-[#E83500]/30">
            <IconTruck size={36} stroke={1.5} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Muda<span className="text-[#E83500]">Fácil</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">Entre para planejar sua mudança</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl p-8 flex flex-col gap-4">
          {/* Google OAuth */}
          <form action={async () => {
            'use server'
            await signIn('google', { redirectTo: callbackUrl ?? '/app/dashboard' })
          }}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
            >
              <GoogleIcon />
              Continuar com Google
            </button>
          </form>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="flex-1 h-px bg-gray-200" />
            ou
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Magic Link */}
          <form action={async (formData: FormData) => {
            'use server'
            const email = formData.get('email') as string
            await signIn('resend', { email, redirectTo: callbackUrl ?? '/app/dashboard' })
          }} className="flex flex-col gap-3">
            <input
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E83500] focus:border-[#E83500]"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#E83500] text-white font-bold text-sm hover:bg-[#C42A08] transition-colors shadow-lg shadow-[#E83500]/25"
            >
              Enviar link mágico
            </button>
          </form>

          <p className="text-xs text-center text-gray-400">
            Primeiro acesso = 14 dias de trial gratuito
          </p>
        </div>
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  )
}
