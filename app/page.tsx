import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F8FAFC]">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <Footer />
      </main>
    </>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-blue-600/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium mb-6">
          <span>🚛</span>
          <span>14 dias grátis — sem cartão de crédito</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Arraste seus móveis,{' '}
          <span className="text-[#2563EB]">escolha o caminhão</span>
          {' '}e mude sem estresse
        </h1>

        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Monte visualmente a carga da sua mudança com drag & drop, compare tamanhos de caminhão
          em tempo real e receba cotações instantâneas de transportadoras avaliadas.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-4 rounded-xl bg-[#2563EB] text-white font-bold text-base hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
          >
            Planejar minha mudança grátis →
          </Link>
          <a
            href="#features"
            className="px-8 py-4 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-base hover:bg-gray-50 transition-colors"
          >
            Ver como funciona
          </a>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
          <span>⭐ 4.9 de satisfação</span>
          <span>📦 +2.000 mudanças planejadas</span>
          <span>🛡️ Transportadoras verificadas</span>
        </div>
      </div>

      {/* Preview mockup */}
      <div className="max-w-5xl mx-auto mt-16 rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/10 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-gray-400 ml-2">mudafacil.com.br/app/mudanca</span>
        </div>
        <div className="h-72 bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col items-center justify-center gap-4">
          <div className="flex gap-6 text-5xl">
            <span title="Geladeira">🧊</span>
            <span title="Cama">🛏️</span>
            <span title="Sofá">🛋️</span>
            <span title="Caixa">📦</span>
            <span title="Mesa">🪑</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-24 h-0.5 bg-blue-200" />
            <span className="text-xl">→</span>
            <div className="text-3xl">🚛</div>
            <div className="w-24 h-0.5 bg-blue-200" />
          </div>
          <p className="text-gray-400 text-sm font-medium">Arraste · Compare caminhões · Receba cotações</p>
        </div>
      </div>
    </section>
  )
}

// ─── Features ──────────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: '🎯',
      title: 'Canvas de carga interativo',
      description:
        'Arraste ícones de móveis (geladeira, cama, sofá, caixas) para dentro de um container virtual. Cada item tem dimensão proporcional real e encaixa visualmente no espaço.',
    },
    {
      icon: '🚛',
      title: 'Seletor visual de caminhão',
      description:
        'Compare 4 tamanhos (Fiorino, HR, 3/4, Baú) com barra de ocupação em tempo real conforme você adiciona itens ao canvas. Sem suposições.',
    },
    {
      icon: '💰',
      title: 'Filtros de cotação avançados',
      description:
        'Filtre por preço, nota de avaliação, data disponível, seguro incluso e tipo de veículo. Ordene e compare lado a lado em cards claros.',
    },
    {
      icon: '📚',
      title: 'Catálogo visual de 40+ itens',
      description:
        'Biblioteca com ícones categorizados (quarto, cozinha, sala, escritório, caixas P/M/G) com peso e volume pré-estimados, editáveis pelo usuário.',
    },
    {
      icon: '📊',
      title: 'Resumo inteligente da carga',
      description:
        'Painel lateral com volume total (m³), peso estimado, percentual de ocupação do caminhão selecionado e alerta se estiver acima da capacidade.',
    },
    {
      icon: '⭐',
      title: 'Transportadoras avaliadas',
      description:
        'Apenas transportadoras verificadas com avaliações reais. Nota média, total de avaliações e histórico visíveis antes de contratar.',
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Tudo que você precisa para uma mudança perfeita
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Do planejamento visual à contratação em minutos. Sem planilhas, sem suposições.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl bg-white border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Como funciona ─────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { num: '01', title: 'Crie sua mudança', desc: 'Informe origem, destino e data desejada em segundos.' },
    { num: '02', title: 'Monte o canvas', desc: 'Arraste seus móveis do catálogo para o caminhão virtual.' },
    { num: '03', title: 'Escolha o veículo', desc: 'Veja em tempo real qual caminhão comporta exatamente sua carga.' },
    { num: '04', title: 'Receba cotações', desc: 'Compare preços e notas de transportadoras verificadas.' },
    { num: '05', title: 'Contrate e mude!', desc: 'Confirme com 1 clique e fique tranquilo no dia da mudança.' },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            5 passos para mover sem estresse
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          {steps.map((step) => (
            <div key={step.num} className="flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#2563EB] text-white font-extrabold text-sm flex items-center justify-center">
                {step.num}
              </div>
              <div className="pt-2">
                <h3 className="font-bold text-gray-900">{step.title}</h3>
                <p className="text-gray-500 text-sm mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ───────────────────────────────────────────────────────────────
function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Preço simples e justo</h2>
          <p className="text-gray-500 text-lg">Comece grátis. Assine quando precisar de mais.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Free */}
          <div className="p-6 rounded-2xl border border-gray-200 bg-white flex flex-col">
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Free</p>
              <p className="text-3xl font-extrabold text-gray-900">R$ 0</p>
              <p className="text-sm text-gray-400 mt-0.5">para sempre</p>
            </div>
            <ul className="flex flex-col gap-2.5 flex-1 mb-6">
              <PricingItem text="1 mudança ativa" />
              <PricingItem text="Até 15 itens no canvas" />
              <PricingItem text="3 cotações por mudança" />
              <PricingItem text="Filtros avançados" negative />
            </ul>
            <Link
              href="/login"
              className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold text-center hover:bg-gray-50 transition-colors"
            >
              Começar grátis
            </Link>
          </div>

          {/* Trial */}
          <div className="p-6 rounded-2xl border-2 border-[#F59E0B] bg-amber-50 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
              Mais popular
            </div>
            <div className="mb-5">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">Trial Gratuito</p>
              <p className="text-3xl font-extrabold text-gray-900">14 dias</p>
              <p className="text-sm text-amber-600 font-medium mt-0.5">grátis, sem cartão</p>
            </div>
            <ul className="flex flex-col gap-2.5 flex-1 mb-6">
              <PricingItem text="Mudanças ilimitadas" />
              <PricingItem text="Itens ilimitados" />
              <PricingItem text="Cotações ilimitadas" />
              <PricingItem text="Filtros avançados" />
              <PricingItem text="Suporte prioritário" />
            </ul>
            <Link
              href="/login"
              className="w-full py-2.5 rounded-xl bg-[#F59E0B] text-white text-sm font-bold text-center hover:bg-amber-600 transition-colors"
            >
              Começar trial grátis
            </Link>
          </div>

          {/* PRO */}
          <div className="p-6 rounded-2xl border-2 border-[#2563EB] bg-[#2563EB] flex flex-col">
            <div className="mb-5">
              <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2">PRO</p>
              <p className="text-3xl font-extrabold text-white">R$ 29,90</p>
              <p className="text-sm text-blue-200 mt-0.5">/mês</p>
            </div>
            <ul className="flex flex-col gap-2.5 flex-1 mb-6">
              <PricingItemInverse text="Mudanças ilimitadas" />
              <PricingItemInverse text="Itens ilimitados" />
              <PricingItemInverse text="Cotações ilimitadas" />
              <PricingItemInverse text="Filtros avançados" />
              <PricingItemInverse text="Suporte prioritário" />
            </ul>
            <Link
              href="/login"
              className="w-full py-2.5 rounded-xl bg-white text-[#2563EB] text-sm font-bold text-center hover:bg-blue-50 transition-colors"
            >
              Assinar PRO
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingItem({ text, negative }: { text: string; negative?: boolean }) {
  return (
    <li className={`text-sm flex items-center gap-2 ${negative ? 'text-gray-300' : 'text-gray-700'}`}>
      <span className={`font-bold flex-shrink-0 ${negative ? 'text-gray-300' : 'text-[#2563EB]'}`}>
        {negative ? '✗' : '✓'}
      </span>
      <span className={negative ? 'line-through' : ''}>{text}</span>
    </li>
  )
}

function PricingItemInverse({ text }: { text: string }) {
  return (
    <li className="text-sm flex items-center gap-2 text-blue-100">
      <span className="font-bold text-white flex-shrink-0">✓</span>
      {text}
    </li>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <span className="text-xl">🚛</span>
          <span>Muda<span className="text-[#2563EB]">Fácil</span></span>
        </div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="/termos" className="hover:text-gray-700 transition-colors">Termos de uso</a>
          <a href="/privacidade" className="hover:text-gray-700 transition-colors">Privacidade</a>
          <a href="mailto:suporte@mudafacil.com.br" className="hover:text-gray-700 transition-colors">Suporte</a>
        </div>
        <p className="text-xs text-gray-300">© {new Date().getFullYear()} MudaFácil. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
