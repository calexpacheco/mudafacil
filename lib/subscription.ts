import type { Plan } from '@/lib/prisma-types'

interface UserSubscription {
  plan: Plan
  trialEnd: Date | null
  subscriptionEnd: Date | null
}

export function isTrialActive(user: UserSubscription): boolean {
  if (user.plan !== 'TRIAL') return false
  if (!user.trialEnd) return false
  return new Date() < new Date(user.trialEnd)
}

export function isSubscribed(user: UserSubscription): boolean {
  if (user.plan !== 'PRO') return false
  if (!user.subscriptionEnd) return false
  return new Date() < new Date(user.subscriptionEnd)
}

export function hasAccess(user: UserSubscription): boolean {
  return isTrialActive(user) || isSubscribed(user)
}

export function daysLeftInTrial(user: UserSubscription): number {
  if (!user.trialEnd) return 0
  const diff = new Date(user.trialEnd).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function getPlanLabel(plan: Plan): string {
  const labels: Record<Plan, string> = {
    FREE: 'Gratuito',
    TRIAL: 'Trial',
    PRO: 'Pro',
  }
  return labels[plan]
}
