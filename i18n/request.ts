import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { routing } from './routing'

type Locale = typeof routing.locales[number]

function isValidLocale(v: unknown): v is Locale {
  return routing.locales.includes(v as Locale)
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Para rotas com [locale] no segmento (landing page), usa o valor da URL.
  // Para rotas sem prefixo (/app/*), lê o cookie NEXT_LOCALE.
  let locale = await requestLocale

  if (!isValidLocale(locale)) {
    const jar = await cookies()
    const fromCookie = jar.get('NEXT_LOCALE')?.value
    locale = isValidLocale(fromCookie) ? fromCookie : routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
