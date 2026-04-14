import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { AppShell } from '@/components/layout/AppShell'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  })

  const userName = user?.name ?? ''
  const userEmail = user?.email ?? ''

  return (
    <AppShell userName={userName} userEmail={userEmail}>
      {children}
    </AppShell>
  )
}
