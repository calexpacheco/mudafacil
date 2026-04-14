'use client'

import { useEffect, useRef, useState } from 'react'
import {
  IconTarget,
  IconTruck,
  IconCurrencyDollar,
  IconBooks,
  IconChartBar,
  IconStar,
} from '@tabler/icons-react'

const features = [
  {
    Icon: IconTarget,
    title: 'Canvas de carga interativo',
    description:
      'Arraste ícones de móveis (geladeira, cama, sofá, caixas) para dentro de um container virtual. Cada item tem dimensão proporcional real e encaixa visualmente no espaço.',
  },
  {
    Icon: IconTruck,
    title: 'Seletor visual de caminhão',
    description:
      'Compare 4 tamanhos (Fiorino, HR, 3/4, Baú) com barra de ocupação em tempo real conforme você adiciona itens ao canvas. Sem suposições.',
  },
  {
    Icon: IconCurrencyDollar,
    title: 'Filtros de cotação avançados',
    description:
      'Filtre por preço, nota de avaliação, data disponível, seguro incluso e tipo de veículo. Ordene e compare lado a lado em cards claros.',
  },
  {
    Icon: IconBooks,
    title: 'Catálogo visual de 40+ itens',
    description:
      'Biblioteca com ícones categorizados (quarto, cozinha, sala, escritório, caixas P/M/G) com peso e volume pré-estimados, editáveis pelo usuário.',
  },
  {
    Icon: IconChartBar,
    title: 'Resumo inteligente da carga',
    description:
      'Painel lateral com volume total (m³), peso estimado, percentual de ocupação do caminhão selecionado e alerta se estiver acima da capacidade.',
  },
  {
    Icon: IconStar,
    title: 'Transportadoras avaliadas',
    description:
      'Apenas transportadoras verificadas com avaliações reais. Nota média, total de avaliações e histórico visíveis antes de contratar.',
  },
]

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [visibleCards, setVisibleCards] = useState<boolean[]>(Array(features.length).fill(false))

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const timers: ReturnType<typeof setTimeout>[] = []

    // Observer do header — liga e desliga
    if (headerRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => setHeaderVisible(entry.isIntersecting),
        { threshold: 0.3 }
      )
      obs.observe(headerRef.current)
      observers.push(obs)
    }

    // Observer de cada card — liga e desliga com stagger
    const cardEls = sectionRef.current?.querySelectorAll('[data-card]')
    cardEls?.forEach((el, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const t = setTimeout(() => {
              setVisibleCards(prev => {
                const next = [...prev]
                next[i] = true
                return next
              })
            }, i * 100)
            timers.push(t)
          } else {
            setVisibleCards(prev => {
              const next = [...prev]
              next[i] = false
              return next
            })
          }
        },
        { threshold: 0.15 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => {
      observers.forEach(o => o.disconnect())
      timers.forEach(t => clearTimeout(t))
    }
  }, [])

  return (
    <section ref={sectionRef} id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background invertido horizontalmente */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('/bg-pricing.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scaleX(-1)',
        }}
      />
      {/* Overlay */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(248,250,252,0.84)' }} />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header com fade */}
        <div
          ref={headerRef}
          className="text-center mb-14"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Tudo que você precisa para uma mudança perfeita
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Do planejamento visual à contratação em minutos. Sem planilhas, sem suposições.
          </p>
        </div>

        {/* Cards com bounce staggered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              data-card
              className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200 hover:border-[#E83500]/30 hover:shadow-md hover:shadow-[#E83500]/5 transition-all"
              style={{
                opacity: visibleCards[i] ? 1 : 0,
                transform: visibleCards[i] ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.94)',
                transition: visibleCards[i]
                  ? 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  : 'opacity 0.3s ease, transform 0.3s ease',
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#FEF0EA] flex items-center justify-center mb-4">
                <feature.Icon size={24} stroke={1.5} className="text-[#E83500]" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
