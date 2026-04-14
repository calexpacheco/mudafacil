import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// Helpers de navegação com consciência de locale
// Use estes em vez de next/navigation para rotas da landing page
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
