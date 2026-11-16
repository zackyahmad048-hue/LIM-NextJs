import Link from 'next/link'
import { getSession } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getSession()
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Masuk sebagai: {session?.user.email ?? '-'}</p>
      <Link className="underline" href="/dashboard/security/mfa">Keamanan / MFA</Link>
    </div>
  )
}
