'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { usePathname as useNextPathname, useRouter as useNextRouter } from 'next/navigation'
import { useTransition, useState, useRef, useEffect } from 'react'
import { setLocaleAction } from '@/app/app/actions'

const LOCALES = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English',   flag: '🇺🇸' },
] as const

type Locale = typeof LOCALES[number]['code']

// Rotas de app não têm prefixo de locale na URL — troca via cookie
const APP_PREFIXES = ['/app', '/login', '/settings', '/dashboard']

export function LocaleSwitcher() {
  const locale      = useLocale()
  const intlRouter  = useRouter()
  const intlPathname = usePathname()
  const nextRouter  = useNextRouter()
  const nextPathname = useNextPathname()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]
  const isAppRoute = APP_PREFIXES.some((p) => nextPathname.startsWith(p))

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function switchLocale(newLocale: Locale) {
    setOpen(false)
    if (newLocale === locale) return

    startTransition(async () => {
      if (isAppRoute) {
        // Rotas de app: salva cookie e recarrega para aplicar o novo locale
        await setLocaleAction(newLocale)
        nextRouter.refresh()
      } else {
        // Landing page: next-intl troca o prefixo de URL automaticamente
        intlRouter.replace(intlPathname, { locale: newLocale })
      }
    })
  }

  return (
    <div ref={ref} className="relative">
      {/* Botão principal */}
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 cursor-pointer disabled:opacity-50"
        aria-label="Selecionar idioma"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-50">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => switchLocale(l.code)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors cursor-pointer
                ${l.code === locale
                  ? 'bg-[#FEF0EA] text-[#E83500] font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <span className="text-base">{l.flag}</span>
              <span>{l.label}</span>
              {l.code === locale && (
                <svg className="ml-auto w-3.5 h-3.5 text-[#E83500]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
