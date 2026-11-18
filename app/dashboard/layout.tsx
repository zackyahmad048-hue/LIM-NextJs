import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { SIDEBAR_COLLAPSED, SIDEBAR_COOKIE } from '@/components/layout/sidebar-state'
import { getUserScopeQuery } from '@/modules/authentication/presentation/queries/get-user-scope.query'
import type { Role, AccountType } from '@/generated/client'

// Halaman dashboard menarik data server di render; izinkan blocking saat prerender.
export const instant = false

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login?callbackUrl=/dashboard')
  const role = session.user.role as Role
  const [cookieStore, scope] = await Promise.all([
    cookies(),
    getUserScopeQuery({
      id: session.user.id,
      role,
      accountType: session.user.accountType as AccountType | undefined,
    }),
  ])
  const sidebarCollapsed = cookieStore.get(SIDEBAR_COOKIE)?.value === SIDEBAR_COLLAPSED
  return (
    <div className="flex min-h-screen">
      <a
        href="#konten-utama"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Lewati ke konten utama
      </a>
      <Sidebar role={role} defaultCollapsed={sidebarCollapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar email={session.user.email} role={role} scope={scope} />
        <main id="konten-utama" className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
