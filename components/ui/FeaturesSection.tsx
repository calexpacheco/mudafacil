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
    title: 'Liste tudo que você precisa levar',
    description:
      'Adicione seus móveis e caixas de forma simples e veja tudo organizado em um só lugar. Sem planilhas, sem papel.',
  },
  {
    Icon: IconTruck,
    title: 'Escolha o tamanho ideal sem erro',
    description:
      'Descubra qual caminhão atende sua mudança sem pagar a mais por espaço desnecessário. A gente faz a conta por você.',
  },
  {
    Icon: IconCurrencyDollar,
    title: 'Compare e escolha com confiança',
    description:
      'Veja preços, avaliações e escolha a melhor opção para sua mudança. Tudo claro e transparente, sem surpresas.',
  },
  {
    Icon: IconBooks,
    title: 'Mais de 40 itens prontos para usar',
    description:
      'Cama, sofá, geladeira, caixas e muito mais — já cadastrados e organizados por cômodo. É só selecionar o que você tem.',
  },
  {
    Icon: IconChartBar,
    title: 'Veja o quanto já está organizado',
    description:
      'Acompanhe em tempo real o volume total e o espaço ocupado no caminhão. Você sabe exatamente o que cabe antes de contratar.',
  },
  {
    Icon: IconStar,
    title: 'Só empresas de confiança',
    description:
      'Todas as transportadoras são verificadas e têm avaliações reais de outros clientes. Você escolhe com segurança.',
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
            Tudo para organizar sua mudança sem estresse
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Do planejamento à escolha da empresa, tudo em um só lugar.
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
