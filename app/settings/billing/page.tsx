import { redirect } from 'next/navigation'

export default function OldBillingPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string }
}) {
  const params = new URLSearchParams()
  if (searchParams.success) params.set('success', '1')
  if (searchParams.canceled) params.set('canceled', '1')
  const qs = params.toString()
  redirect(`/app/billing${qs ? `?${qs}` : ''}`)
}
