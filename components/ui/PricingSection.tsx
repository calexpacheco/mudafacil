'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { IconCheck, IconX } from '@tabler/icons-react'

const cards = ['free', 'trial', 'pro'] as const

function PricingItem({ text, negative }: { text: string; negative?: boolean }) {
  return (
    <li className={`text-sm flex items-center gap-2 ${negative ? 'text-gray-300' : 'text-gray-700'}`}>
      {negative
        ? <IconX size={16} stroke={2} className="text-gray-300 flex-shrink-0" />
        : <IconCheck size={16} stroke={2} className="text-[#E83500] flex-shrink-0" />}
      <span className={negative ? 'line-through' : ''}>{text}</span>
    </li>
  )
}

function PricingItemInverse({ text }: { text: string }) {
  return (
    <li className="text-sm flex items-center gap-2 text-[#FDE0D4]">
      <IconCheck size={16} stroke={2} className="text-white flex-shrink-0" />
      {text}
    </li>
  )
}

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [visibleCards, setVisibleCards] = useState<boolean[]>(Array(cards.length).fill(false))

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const timers: ReturnType<typeof setTimeout>[] = []

    if (headerRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => setHeaderVisible(entry.isIntersecting),
        { threshold: 0.3 }
      )
      obs.observe(headerRef.current)
      observers.push(obs)
    }

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
    <section
      ref={sectionRef}
      id="pricing"
      className="py-20 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(248,250,252,0.84), rgba(248,250,252,0.84)), url('/bg-pricing.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-4xl mx-auto">

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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Preço simples e justo</h2>
          <p className="text-gray-500 text-lg">Comece grátis. Assine quando precisar de mais.</p>
        </div>

        {/* Cards com bounce staggered */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* Free */}
          <div
            data-card
            className="p-6 rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-sm flex flex-col"
            style={{
              opacity: visibleCards[0] ? 1 : 0,
              transform: visibleCards[0] ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.94)',
              transition: visibleCards[0]
                ? 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'opacity 0.3s ease, transform 0.3s ease',
            }}
          >
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
          <div
            data-card
            className="p-6 rounded-2xl border-2 border-[#F59E0B] bg-amber-50/60 backdrop-blur-sm flex flex-col relative"
            style={{
              opacity: visibleCards[1] ? 1 : 0,
              transform: visibleCards[1] ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.94)',
              transition: visibleCards[1]
                ? 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'opacity 0.3s ease, transform 0.3s ease',
            }}
          >
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
          <div
            data-card
            className="p-6 rounded-2xl border-2 border-[#E83500] bg-[#E83500]/80 backdrop-blur-sm flex flex-col"
            style={{
              opacity: visibleCards[2] ? 1 : 0,
              transform: visibleCards[2] ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.94)',
              transition: visibleCards[2]
                ? 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'opacity 0.3s ease, transform 0.3s ease',
            }}
          >
            <div className="mb-5">
              <p className="text-xs font-bold text-[#FCC1A9] uppercase tracking-widest mb-2">PRO</p>
              <p className="text-3xl font-extrabold text-white">R$ 29,90</p>
              <p className="text-sm text-[#FCC1A9] mt-0.5">/mês</p>
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
              className="w-full py-2.5 rounded-xl bg-white text-[#E83500] text-sm font-bold text-center hover:bg-[#FEF0EA] transition-colors"
            >
              Assinar PRO
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
