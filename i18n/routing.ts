import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // Idiomas suportados
  locales: ['pt', 'en'],

  // Português é o padrão — sem prefixo na URL (/ = pt, /en = inglês)
  defaultLocale: 'pt',

  // PT não aparece na URL: / em vez de /pt/
  localePrefix: 'as-needed',
})
