import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'MudaFácil — Planeje sua mudança com drag & drop',
  description:
    'Monte visualmente a carga da sua mudança com drag & drop, compare tamanhos de caminhão em tempo real e receba cotações instantâneas de transportadoras avaliadas.',
  openGraph: {
    title: 'MudaFácil — Arraste seus móveis, escolha o caminhão e mude sem estresse',
    description:
      'Monte visualmente a carga da sua mudança com drag & drop, compare tamanhos de caminhão em tempo real e receba cotações instantâneas.',
    siteName: 'MudaFácil',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-gray-900">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
