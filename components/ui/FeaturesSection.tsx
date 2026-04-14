'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  IconTarget,
  IconTruck,
  IconCurrencyDollar,
  IconBooks,
  IconChartBar,
  IconStar,
} from '@tabler/icons-react'

const ICONS = [IconTarget, IconTruck, IconCurrencyDollar, IconBooks, IconChartBar, IconStar]

export function FeaturesSection() {
  const t = useTranslations('features')
  const items = t.raw('items') as Array<{ title: string; description: string }>

  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [visibleCards, setVisibleCards] = useState<boolean[]>(Array(ICONS.length).fill(false))

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

  return (
    <section ref={sectionRef} id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(248,250,252,0.84)' }} />

      <div className="relative z-10 max-w-7xl mx-auto">

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
            {t('title')}
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = ICONS[i]
            return (
              <div
                key={i}
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
                  <Icon size={24} stroke={1.5} className="text-[#E83500]" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
