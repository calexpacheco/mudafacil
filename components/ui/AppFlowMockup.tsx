'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  IconTruck, IconStar, IconPackage, IconCheck,
  IconCalendar, IconSearch, IconChevronRight,
  IconBed, IconSofa, IconArmchair, IconFridge,
} from '@tabler/icons-react'

// ─── Conteúdo dos steps ──────────────────────────────────────────────────────

function Step1() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nova mudança</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50">
          <div className="w-5 h-5 rounded-full bg-[#E83500] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[8px] font-bold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-gray-400 leading-none mb-0.5">Origem</div>
            <div className="text-[11px] font-semibold text-gray-800 truncate">Rua das Flores, 123 — SP</div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-px h-3 border-l-2 border-dashed border-gray-300" />
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50">
          <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[8px] font-bold">B</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-gray-400 leading-none mb-0.5">Destino</div>
            <div className="text-[11px] font-semibold text-gray-800 truncate">Av. Atlântica, 500 — RJ</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50">
          <IconCalendar size={14} stroke={1.5} className="text-gray-400 flex-shrink-0" />
          <div>
            <div className="text-[10px] text-gray-400 leading-none mb-0.5">Data</div>
            <div className="text-[11px] font-semibold text-gray-800">20 de abril, 2026</div>
          </div>
        </div>
      </div>
      <button className="w-full py-2 rounded-lg bg-[#E83500] text-white text-[11px] font-bold">
        Criar mudança →
      </button>
    </div>
  )
}

function Step2() {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catálogo de itens</p>
      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-gray-200 bg-white">
        <IconSearch size={12} stroke={1.5} className="text-gray-400" />
        <span className="text-[10px] text-gray-300">Buscar item...</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { Icon: IconFridge, label: 'Geladeira' },
          { Icon: IconBed, label: 'Cama casal' },
          { Icon: IconSofa, label: 'Sofá 3L' },
          { Icon: IconArmchair, label: 'Poltrona' },
          { Icon: IconPackage, label: 'Caixa G' },
          { Icon: IconPackage, label: 'Caixa M' },
        ].map(({ Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 p-1.5 rounded-lg border border-gray-200 bg-white">
            <Icon size={18} stroke={1.5} className="text-gray-500" />
            <span className="text-[9px] text-gray-600 text-center leading-tight">{label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#FEF0EA] border border-[#FCC1A9]">
        <IconCheck size={12} stroke={2} className="text-[#E83500]" />
        <span className="text-[10px] text-[#E83500] font-semibold">6 itens selecionados</span>
      </div>
    </div>
  )
}

function Step3() {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Canvas — HR / Sprinter</p>
      <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-2 flex flex-col gap-1.5">
        <div className="flex items-center gap-1 mb-1">
          <IconTruck size={14} stroke={1.5} className="text-[#E83500]" />
          <span className="text-[10px] font-semibold text-gray-600">HR — 6m³</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[
            { Icon: IconFridge, label: 'Gelad.' },
            { Icon: IconBed, label: 'Cama' },
            { Icon: IconSofa, label: 'Sofá' },
            { Icon: IconArmchair, label: 'Poltr.' },
            { Icon: IconPackage, label: 'Cx. G' },
            { Icon: IconPackage, label: 'Cx. M' },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-0.5 p-1 rounded bg-[#FEF0EA] border border-[#FCC1A9]">
              <Icon size={14} stroke={1.5} className="text-[#E83500]" />
              <span className="text-[8px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-gray-500">Ocupação</span>
          <span className="font-bold text-[#E83500]">72%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#E83500] rounded-full" style={{ width: '72%' }} />
        </div>
        <span className="text-[10px] text-gray-400">4.32 m³ de 6 m³</span>
      </div>
    </div>
  )
}

function Step4() {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cotações recebidas</p>
      {[
        { name: 'MudaBR Express', price: 'R$ 890', stars: 4, tag: '⚡ Mais rápido' },
        { name: 'TransfácilSP', price: 'R$ 720', stars: 5, tag: '💰 Melhor preço' },
      ].map((c) => (
        <div key={c.name} className="p-2.5 rounded-lg bg-white border border-gray-200 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-800">{c.name}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#FEF0EA] text-[#E83500] font-semibold">{c.tag}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-extrabold text-gray-900">{c.price}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: c.stars }).map((_, i) => (
                <IconStar key={i} size={10} stroke={0} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
          </div>
          <button className="w-full py-1 rounded-lg bg-[#E83500] text-white text-[10px] font-bold">Contratar</button>
        </div>
      ))}
      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-green-50 border border-green-200">
        <IconCheck size={12} stroke={2} className="text-green-600" />
        <span className="text-[10px] text-green-700 font-semibold">Mudança confirmada!</span>
      </div>
    </div>
  )
}

const STEPS = [
  { n: '01', label: 'Criar mudança',    content: <Step1 /> },
  { n: '02', label: 'Selecionar itens', content: <Step2 /> },
  { n: '03', label: 'Montar carga',     content: <Step3 /> },
  { n: '04', label: 'Receber cotações', content: <Step4 /> },
]

// ─── Versão mobile: carrossel de steps ──────────────────────────────────────

function MobileFlow() {
  const [active, setActive] = useState(0)

  // Auto-avança a cada 3s, reinicia se o usuário interagir
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function resetTimer() {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActive((v) => (v + 1) % STEPS.length)
    }, 5000)
  }

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function goTo(i: number) {
    setActive(i)
    resetTimer() // reseta o timer ao interagir manualmente
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xl">
      {/* Browser chrome mini */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#2A2A2A]">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-2 bg-[#3A3A3A] rounded px-2 py-0.5">
          <span className="text-[10px] text-gray-400 font-mono">mudafacil.com.br</span>
        </div>
      </div>

      {/* Steps pills */}
      <div className="flex gap-1.5 px-3 py-2.5 bg-[#F8FAFC] border-b border-gray-200 overflow-x-auto">
        {STEPS.map((step, i) => (
          <button
            key={step.n}
            onClick={() => goTo(i)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold flex-shrink-0 transition-all cursor-pointer ${
              i === active
                ? 'bg-[#E83500] text-white shadow-sm'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 ${
              i === active ? 'bg-white text-[#E83500]' : 'bg-gray-300 text-gray-600'
            }`}>
              {step.n}
            </span>
            <span>{step.label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo do step ativo */}
      <div className="p-4 bg-white min-h-[280px]">
        {STEPS[active].content}
      </div>

      {/* Navegação prev/next */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
        <button
          onClick={() => goTo(Math.max(0, active - 1))}
          disabled={active === 0}
          className="flex items-center gap-1 text-xs font-semibold text-gray-500 disabled:opacity-30 cursor-pointer disabled:cursor-default"
        >
          ← Anterior
        </button>

        {/* Dots */}
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all cursor-pointer ${
                i === active ? 'w-4 h-2 bg-[#E83500]' : 'w-2 h-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(Math.min(STEPS.length - 1, active + 1))}
          disabled={active === STEPS.length - 1}
          className="flex items-center gap-1 text-xs font-semibold text-[#E83500] disabled:opacity-30 cursor-pointer disabled:cursor-default"
        >
          Próximo →
        </button>
      </div>
    </div>
  )
}

// ─── Versão desktop: layout 3D com 4 colunas ────────────────────────────────

function DesktopFlow() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [angle, setAngle] = useState(30)
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const el = wrapperRef.current
    if (!el) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const from = vh, to = vh * 0.35
      const p = Math.max(0, Math.min(1, (from - rect.top) / (from - to)))
      setProgress(p)
      setAngle(30 * (1 - p))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const glowStrength = mounted ? Math.max(0, (progress - 0.7) / 0.3) : 0
  const boxShadow = [
    '0 0 0 1px rgba(255,255,255,0.12)',
    '0 20px 60px rgba(0,0,0,0.45)',
    `0 0 60px 10px rgba(232,53,0,${(0.28 * glowStrength).toFixed(3)})`,
    `0 0 120px 30px rgba(232,53,0,${(0.14 * glowStrength).toFixed(3)})`,
    `0 0 200px 60px rgba(232,53,0,${(0.07 * glowStrength).toFixed(3)})`,
  ].join(', ')

  return (
    <div ref={wrapperRef} style={{ perspective: '1100px' }}>
      <div style={{
        transform: mounted ? `rotateX(${angle}deg)` : 'rotateX(30deg)',
        transformOrigin: 'center bottom',
        boxShadow, borderRadius: '16px', overflow: 'hidden', willChange: 'transform, box-shadow',
      }}>
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#2A2A2A]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-4 bg-[#3A3A3A] rounded-md px-3 py-1 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-gray-500 flex-shrink-0" />
            <span className="text-xs text-gray-400 font-mono">mudafacil.com.br</span>
          </div>
        </div>

        {/* Steps nav */}
        <div className="flex bg-[#F8FAFC] border-b border-gray-200">
          {STEPS.map((step, i) => (
            <div key={step.n} className="flex items-center flex-1 min-w-0">
              <div className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold flex-1 min-w-0 ${
                i === 0 ? 'bg-white border-b-2 border-b-[#E83500] text-[#E83500]' : 'text-gray-400'
              }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-[#E83500] text-white' : 'bg-gray-200 text-gray-500'
                }`}>{step.n}</span>
                <span className="truncate">{step.label}</span>
              </div>
              {i < 3 && <IconChevronRight size={14} stroke={2} className="text-gray-300 flex-shrink-0 -mx-1 z-10" />}
            </div>
          ))}
        </div>

        {/* 4 panels */}
        <div className="flex bg-white">
          <div className="p-4 flex flex-col gap-3 bg-white flex-1 min-w-0"><Step1 /></div>

          <div className="relative w-px bg-gray-100 flex-shrink-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#E83500] border-2 border-white shadow-md flex items-center justify-center z-10">
              <IconChevronRight size={18} stroke={2.5} className="text-white" />
            </div>
          </div>

          <div className="p-4 flex flex-col gap-2.5 bg-[#FAFAFA] flex-1 min-w-0"><Step2 /></div>

          <div className="relative w-px bg-gray-100 flex-shrink-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#E83500] border-2 border-white shadow-md flex items-center justify-center z-10">
              <IconChevronRight size={18} stroke={2.5} className="text-white" />
            </div>
          </div>

          <div className="p-4 flex flex-col gap-2.5 bg-white flex-1 min-w-0"><Step3 /></div>

          <div className="relative w-px bg-gray-100 flex-shrink-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#E83500] border-2 border-white shadow-md flex items-center justify-center z-10">
              <IconChevronRight size={18} stroke={2.5} className="text-white" />
            </div>
          </div>

          <div className="p-4 flex flex-col gap-2.5 bg-[#FAFAFA] flex-1 min-w-0"><Step4 /></div>
        </div>
      </div>
    </div>
  )
}

// ─── Export principal ────────────────────────────────────────────────────────

export function AppFlowMockup() {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <MobileFlow />
      </div>
      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopFlow />
      </div>
    </>
  )
}
