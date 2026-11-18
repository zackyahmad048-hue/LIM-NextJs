import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { Badge } from '@/components/ui/badge'
import { getSession } from '@/lib/auth'
import { formatRoleLabel } from '@/components/layout/nav-config'
import { CREATABLE_ROLES } from '@/modules/authentication/domain/user.schema'
import { listUsers } from '@/modules/authentication/application/list-users'
import { createUserAction } from '@/modules/authentication/presentation/actions/create-user.action'
import type { LIMSession } from '@/types/auth'

// Halaman daftar akun berisi email — khusus OWNER (Server Action juga memeriksa ulang).
export default async function PenggunaPage() {
  const session = (await getSession()) as LIMSession | null
  if (!session || session.user.role !== 'OWNER') redirect('/dashboard')

  const users = await listUsers()

  return (
    <div className="space-y-8">
      <PageHeader title="Pengguna" description="Buat akun baru dan lihat akun yang terdaftar." />

      <section className="max-w-2xl space-y-3">
        <h2 className="font-medium">Buat Akun</h2>
        <ActionForm action={createUserAction} submitLabel="Buat Akun">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nama" name="name">
              <input name="name" required maxLength={120} className="w-full rounded-md border bg-transparent px-3 py-2" />
            </FormField>
            <FormField label="Email" name="email">
              <input name="email" type="email" required autoComplete="off" className="w-full rounded-md border bg-transparent px-3 py-2" />
            </FormField>
            <FormField label="Password awal" name="password">
              <input name="password" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className="w-full rounded-md border bg-transparent px-3 py-2" />
            </FormField>
            <FormField label="Role" name="role">
              <select name="role" required defaultValue="" className="w-full rounded-md border bg-transparent px-3 py-2">
                <option value="">— Pilih role —</option>
                {CREATABLE_ROLES.map((role) => (
                  <option key={role} value={role}>{formatRoleLabel(role)}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Tipe akun" name="accountType">
              <select name="accountType" required defaultValue="PERSONAL" className="w-full rounded-md border bg-transparent px-3 py-2">
                <option value="PERSONAL">Personal</option>
                <option value="ORGANIZATIONAL">Organisasi (PW/PC/Pondok/Lembaga)</option>
              </select>
            </FormField>
          </div>
        </ActionForm>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Akun Terdaftar ({users.length})</h2>
        {users.length === 0 ? (
          <EmptyState title="Belum ada akun" />
        ) : (
          <ul className="rounded-lg border divide-y text-sm">
            {users.map((user) => (
              <li key={user.id} className="flex flex-wrap items-center justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{user.name || '—'}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{formatRoleLabel(user.role)}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {user.accountType === 'ORGANIZATIONAL' ? 'Organisasi' : 'Personal'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
