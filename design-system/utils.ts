// Design System Utils — MudaFácil
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Converte objeto de tokens em variáveis CSS
export function tokensToCSS(obj: Record<string, unknown>, prefix = ''): string {
  const lines: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : `--${key}`
    if (typeof value === 'string') {
      lines.push(`  ${varName}: ${value};`)
    } else if (typeof value === 'object' && value !== null) {
      lines.push(...tokensToCSS(value as Record<string, unknown>, varName).split('\n').filter(Boolean))
    }
  }
  return lines.join('\n')
}

export function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}
