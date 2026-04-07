import type { Plan } from '@/lib/prisma-types'

export const PLAN_LIMITS = {
  FREE: {
    mudancasAtivas: 1,
    itensNoCanvas: 15,
    cotacoesPorMudanca: 3,
    filtrosAvancados: false,
  },
  TRIAL: {
    mudancasAtivas: Infinity,
    itensNoCanvas: Infinity,
    cotacoesPorMudanca: Infinity,
    filtrosAvancados: true,
  },
  PRO: {
    mudancasAtivas: Infinity,
    itensNoCanvas: Infinity,
    cotacoesPorMudanca: Infinity,
    filtrosAvancados: true,
  },
} as const

export type LimitKey = 'mudancasAtivas' | 'itensNoCanvas' | 'cotacoesPorMudanca' | 'filtrosAvancados'

export function checkUsageLimit(
  plan: Plan,
  resource: Exclude<LimitKey, 'filtrosAvancados'>,
  current: number
): { allowed: boolean; limit: number } {
  const limit = PLAN_LIMITS[plan][resource]
  return {
    allowed: current < (limit as number),
    limit: limit as number,
  }
}
