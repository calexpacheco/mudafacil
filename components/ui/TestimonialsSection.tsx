'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { IconStar } from '@tabler/icons-react'

// ─── Dados ─────────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: 'Ana Beatriz S.',
    city: 'São Paulo, SP',
    text: 'Organizei tudo em menos de 1 hora. A transparência nos preços me deu uma segurança que nunca tive em outras mudanças.',
    avatar: '/people-01.png',
  },
  {
    name: 'Rodrigo M.',
    city: 'Belo Horizonte, MG',
    text: 'O canvas de carga me surpreendeu — sabia exatamente o que caberia no caminhão antes mesmo de contratar.',
    avatar: '/people-05.png',
  },
  {
    name: 'Camila e Felipe T.',
    city: 'Curitiba, PR',
    text: 'Nossa primeira mudança e foi perfeita. Sem susto no preço final, sem improvisação. Recomendo demais!',
    avatar: '/people-09.png',
  },
]

const squareData = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  src: `/people-${String(i + 1).padStart(2, '0')}.png`,
}))

// ─── Shuffle ────────────────────────────────────────────────────────────────

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function generateSquares() {
  return shuffle(squareData).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: 'spring' }}
      className="w-full h-full rounded-lg overflow-hidden bg-gray-100"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    />
  ))
}

// ─── ShuffleGrid ────────────────────────────────────────────────────────────

function ShuffleGrid() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Inicia com ordem fixa (determinística) para evitar hydration mismatch.
  // O shuffle começa apenas no cliente, dentro do useEffect.
  const [squares, setSquares] = useState(() => squareData.map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: 'spring' }}
      className="w-full h-full rounded-lg overflow-hidden bg-gray-100"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    />
  )))

  useEffect(() => {
    function run() {
      setSquares(generateSquares())
      timeoutRef.current = setTimeout(run, 3000)
    }
    // Aguarda um tick para não conflitar com a hidratação inicial
    timeoutRef.current = setTimeout(run, 3000)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className="grid grid-cols-4 grid-rows-3 h-[260px] gap-1.5">
      {squares.slice(0, 12)}
    </div>
  )
}

// ─── Section Principal ──────────────────────────────────────────────────────

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    Array(testimonials.length).fill(false)
  )

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

    const cardEls = sectionRef.current?.querySelectorAll('[data-testimonial]')
    cardEls?.forEach((el, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const t = setTimeout(() => {
              setVisibleCards((prev) => {
                const next = [...prev]
                next[i] = true
                return next
              })
            }, i * 120)
            timers.push(t)
          } else {
            setVisibleCards((prev) => {
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
      observers.forEach((o) => o.disconnect())
      timers.forEach((t) => clearTimeout(t))
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* Linha de cima: header esquerda + grid direita */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Header */}
          <div
            ref={headerRef}
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}
          >
            <span className="inline-block mb-3 text-xs font-bold text-[#E83500] uppercase tracking-widest">
              Clientes satisfeitos
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              Quem usa,{' '}
              <span className="text-[#E83500]">recomenda</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-md">
              Milhares de pessoas já planejaram sua mudança com mais tranquilidade. Depois que usam, não querem mais fazer mudança do jeito antigo.
            </p>
          </div>

          {/* Shuffle grid — só desktop */}
          <div className="hidden lg:block">
            <ShuffleGrid />
          </div>
        </div>

        {/* Linha de baixo: 3 cards lado a lado */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              data-testimonial
              style={{
                opacity: visibleCards[i] ? 1 : 0,
                transform: visibleCards[i] ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
                transition: visibleCards[i]
                  ? `opacity 0.6s ease ${i * 120}ms, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 120}ms`
                  : 'opacity 0.3s ease, transform 0.3s ease',
              }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3"
            >
              {/* Avatar + autor */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"
                  style={{
                    backgroundImage: `url(${t.avatar})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                  }}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{t.name}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <IconStar key={s} size={11} className="text-[#F59E0B] fill-[#F59E0B]" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Quote */}
              <p className="text-gray-600 text-sm leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>

              <p className="text-xs text-gray-400">{t.city}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
