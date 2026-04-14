'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { IconCheck, IconX } from '@tabler/icons-react'

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
  const t = useTranslations('pricing')

  const freeFeatures  = t.raw('free.features')  as string[]
  const freeMissing   = t.raw('free.missing')   as string[]
  const popularFeatures = t.raw('popular.features') as string[]
  const proFeatures   = t.raw('pro.features')   as string[]

  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [visibleCards, setVisibleCards]   = useState<boolean[]>([false, false, false])

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
            const timer = setTimeout(() => {
              setVisibleCards(prev => {
                const next = [...prev]
                next[i] = true
                return next
              })
            }, i * 100)
            timers.push(timer)
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
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [])

  const cardStyle = (i: number) => ({
    opacity: visibleCards[i] ? 1 : 0,
    transform: visibleCards[i] ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.94)',
    transition: visibleCards[i]
      ? 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
      : 'opacity 0.3s ease, transform 0.3s ease',
  })

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

        <div
          ref={headerRef}
          className="text-center mb-14"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{t('title')}</h2>
          <p className="text-gray-500 text-lg">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* Free */}
          <div data-card className="p-6 rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-sm flex flex-col" style={cardStyle(0)}>
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('free.label')}</p>
              <p className="text-3xl font-extrabold text-gray-900">{t('free.price')}</p>
              <p className="text-sm text-gray-400 mt-0.5">{t('free.period')}</p>
            </div>
            <ul className="flex flex-col gap-2.5 flex-1 mb-6">
              {freeFeatures.map((f) => <PricingItem key={f} text={f} />)}
              {freeMissing.map((f)  => <PricingItem key={f} text={f} negative />)}
            </ul>
            <Link
              href="/login"
              className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold text-center hover:bg-gray-50 transition-colors"
            >
              {t('free.cta')}
            </Link>
          </div>

          {/* Mais escolhido */}
          <div data-card className="p-6 rounded-2xl border-2 border-[#E83500] bg-[#E83500]/80 backdrop-blur-sm flex flex-col relative" style={cardStyle(1)}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E83500] text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
              {t('popular.badge')}
            </div>
            <div className="mb-5">
              <p className="text-xs font-bold text-[#FCC1A9] uppercase tracking-widest mb-2">{t('popular.label')}</p>
              <p className="text-3xl font-extrabold text-white">{t('popular.price')}</p>
              <p className="text-sm text-[#FCC1A9] font-medium mt-0.5">{t('popular.period')}</p>
            </div>
            <ul className="flex flex-col gap-2.5 flex-1 mb-6">
              {popularFeatures.map((f) => <PricingItemInverse key={f} text={f} />)}
            </ul>
            <Link
              href="/login"
              className="w-full py-2.5 rounded-xl bg-white text-[#E83500] text-sm font-bold text-center hover:bg-[#FEF0EA] transition-colors"
            >
              {t('popular.cta')}
            </Link>
          </div>

          {/* PRO âncora */}
          <div data-card className="p-6 rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-sm flex flex-col" style={cardStyle(2)}>
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('pro.label')}</p>
              <p className="text-3xl font-extrabold text-gray-900">{t('pro.price')}</p>
              <p className="text-sm text-gray-400 mt-0.5">{t('pro.period')}</p>
            </div>
            <ul className="flex flex-col gap-2.5 flex-1 mb-6">
              {proFeatures.map((f) => <PricingItem key={f} text={f} />)}
            </ul>
            <Link
              href="/login"
              className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold text-center hover:bg-gray-50 transition-colors"
            >
              {t('pro.cta')}
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
