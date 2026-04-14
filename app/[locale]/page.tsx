import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
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
async function HeroSection() {
  const t = await getTranslations('hero')

  return (
    <section className="relative overflow-hidden pb-20">
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

      <div className="absolute inset-0 bg-gradient-to-b from-[#1A0808]/80 via-[#1A0808]/75 to-[#1A0808]/85" />

      <div className="relative z-10 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-6 backdrop-blur-sm">
            <IconTruck size={18} stroke={2} className="text-[#FA9370]" />
            <span>{t('badge')}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
            {t('headline1')}{' '}
            <span className="text-[#FA9370]">{t('headline2')}</span>
            {' '}{t('headline3')}
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('subheadline')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl bg-[#E83500] text-white font-bold text-base hover:bg-[#C42A08] transition-colors shadow-xl shadow-[#E83500]/40"
            >
              {t('ctaPrimary')}
            </Link>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl border border-white/30 bg-white/10 text-white font-semibold text-base hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              {t('ctaSecondary')}
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <IconStar size={16} stroke={1.5} className="text-amber-400" />
              {t('socialRating')}
            </span>
            <span className="flex items-center gap-1.5">
              <IconPackage size={16} stroke={1.5} className="text-white/80" />
              {t('socialMoves')}
            </span>
            <span className="flex items-center gap-1.5">
              <IconCheck size={16} stroke={2} className="text-emerald-400" />
              {t('socialVerified')}
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-16">
          <AppFlowMockup />
        </div>
      </div>
    </section>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────
async function Footer() {
  const t = await getTranslations('footer')

  return (
    <footer className="border-t border-gray-200 bg-[#1A0808] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-white">
          <IconTruck size={20} stroke={2} className="text-white" />
          <span>Muda<span className="text-[#E83500]">Fácil</span></span>
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="/termos" className="hover:text-gray-300 transition-colors">{t('terms')}</a>
          <a href="/privacidade" className="hover:text-gray-300 transition-colors">{t('privacy')}</a>
          <a href="mailto:suporte@mudafacil.com.br" className="hover:text-gray-300 transition-colors">{t('support')}</a>
        </div>
        <p className="text-xs text-gray-600">© {new Date().getFullYear()} MudaFácil. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
