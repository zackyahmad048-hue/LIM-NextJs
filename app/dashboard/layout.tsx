import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import type { Role } from '@/generated/client'

// Halaman dashboard menarik data server di render; izinkan blocking saat prerender.
export const instant = false

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login?callbackUrl=/dashboard')
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar role={session.user.role as Role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar email={session.user.email} role={session.user.role as Role} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
