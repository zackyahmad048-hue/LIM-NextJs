import type { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-3xl p-6">{children}</main>
}
