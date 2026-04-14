import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { AppFlowMockup } from '@/components/ui/AppFlowMockup'
import { FeaturesSection } from '@/components/ui/FeaturesSection'
import { HowItWorksSection } from '@/components/ui/HowItWorksSection'
import { PricingSection } from '@/components/ui/PricingSection'
import { TestimonialsSection } from '@/components/ui/TestimonialsSection'
import {
  IconTruck,
  IconStar,
  IconPackage,
  IconCheck,
} from '@tabler/icons-react'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F8FAFC]">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <Footer />
      </main>
    </>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-20">
      {/* ── Vídeo de fundo ───────────────────────────────────────────────── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source
          src="https://videos.pexels.com/video-files/4277475/4277475-hd_1920_1080_25fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* ── Overlay ────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A0808]/80 via-[#1A0808]/75 to-[#1A0808]/85" />

      {/* ── Conteúdo ──────────────────────────────────────────────────── */}
      <div className="relative z-10 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-6 backdrop-blur-sm">
            <IconTruck size={18} stroke={2} className="text-[#FA9370]" />
            <span>7 dias grátis para testar — sem cartão de crédito</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
            Planeje sua mudança em minutos{' '}
            <span className="text-[#FA9370]">e escolha a melhor opção</span>
            {' '}sem dor de cabeça
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Informe o que você precisa levar e receba cotações de empresas confiáveis na sua região — simples, rápido e sem compromisso.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl bg-[#E83500] text-white font-bold text-base hover:bg-[#C42A08] transition-colors shadow-xl shadow-[#E83500]/40"
            >
              Planejar minha mudança grátis →
            </Link>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl border border-white/30 bg-white/10 text-white font-semibold text-base hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Ver como funciona
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <IconStar size={16} stroke={1.5} className="text-amber-400" /> 4.9 de satisfação
            </span>
            <span className="flex items-center gap-1.5">
              <IconPackage size={16} stroke={1.5} className="text-white/80" /> Mais de 2.000 mudanças planejadas com satisfação
            </span>
            <span className="flex items-center gap-1.5">
              <IconCheck size={16} stroke={2} className="text-emerald-400" /> Empresas verificadas e avaliadas
            </span>
          </div>
        </div>

        {/* ── App flow mockup ─────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto mt-16">
          <AppFlowMockup />
        </div>
      </div>
    </section>
  )
}

// FeaturesSection — ver components/ui/FeaturesSection.tsx (Client Component com animações)

// HowItWorksSection — ver components/ui/HowItWorksSection.tsx (Client Component com animações)

// PricingSection — ver components/ui/PricingSection.tsx (Client Component com animações)

// ─── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-[#1A0808] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-white">
          <IconTruck size={20} stroke={2} className="text-white" />
          <span>Muda<span className="text-[#E83500]">Fácil</span></span>
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="/termos" className="hover:text-gray-300 transition-colors">Termos de uso</a>
          <a href="/privacidade" className="hover:text-gray-300 transition-colors">Privacidade</a>
          <a href="mailto:suporte@mudafacil.com.br" className="hover:text-gray-300 transition-colors">Suporte</a>
        </div>
        <p className="text-xs text-gray-600">© {new Date().getFullYear()} MudaFácil. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
