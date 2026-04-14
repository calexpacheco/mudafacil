'use client'

import { useEffect, useRef, useState } from 'react'

const steps = [
  { num: '01', title: 'Informe sua mudança', desc: 'Diga de onde para onde você vai e o que precisa levar.' },
  { num: '02', title: 'Organize seus itens', desc: 'Liste seus móveis e veja tudo de forma clara e organizada.' },
  { num: '03', title: 'Receba cotações', desc: 'Compare preços e escolha a melhor empresa.' },
  { num: '04', title: 'Agende com tranquilidade', desc: 'Combine tudo direto com a transportadora escolhida.' },
]

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(Array(steps.length).fill(false))

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const timers: ReturnType<typeof setTimeout>[] = []

    // Header fade
    if (headerRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => setHeaderVisible(entry.isIntersecting),
        { threshold: 0.3 }
      )
      obs.observe(headerRef.current)
      observers.push(obs)
    }

    // Cada step com stagger em ordem 01→05
    const stepEls = sectionRef.current?.querySelectorAll('[data-step]')
    stepEls?.forEach((el, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const t = setTimeout(() => {
              setVisibleSteps(prev => {
                const next = [...prev]
                next[i] = true
                return next
              })
            }, i * 120)
            timers.push(t)
          } else {
            setVisibleSteps(prev => {
              const next = [...prev]
              next[i] = false
              return next
            })
          }
        },
        { threshold: 0.2 }
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
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        backgroundImage: `url('https://images.openai.com/static-rsc-4/XQci5ofNgxvlCH3Z2sGtrCVbUSVMrfTchSrDgTieYdxkOwgffxj2-4HlqhvT39WHSaptikXte3HJvb9fpQp8jzubi9TESj0o7GPZwaz3QPr1Jf2c4S5a9Q6teEwB1bbIlgdQmNPQfUEKLfIHphRegfecXmblxJ8eZ9qDvI6EA6KDjmSSPkAgZEoNozumgXoX?purpose=fullsize')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[#1A0808]/88" />

      <div className="relative z-10 max-w-3xl mx-auto">

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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Organize sua mudança em poucos passos
          </h2>
          <p className="text-[#FA9370] text-base">Rápido, simples e sem complicação.</p>
        </div>

        {/* Steps com bounce staggered 01→05 */}
        <div className="flex flex-col gap-8">
          {steps.map((step, i) => (
            <div
              key={step.num}
              data-step
              className="flex items-start gap-5"
              style={{
                opacity: visibleSteps[i] ? 1 : 0,
                transform: visibleSteps[i] ? 'translateX(0) scale(1)' : 'translateX(-40px) scale(0.95)',
                transition: visibleSteps[i]
                  ? 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  : 'opacity 0.3s ease, transform 0.3s ease',
              }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#E83500] text-white font-extrabold text-sm flex items-center justify-center shadow-lg shadow-[#E83500]/40">
                {step.num}
              </div>
              <div className="pt-2">
                <h3 className="font-bold text-white">{step.title}</h3>
                <p className="text-gray-400 text-sm mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
