import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { getSession, runWithSessionTenant } from '@/lib/auth'
import { getWkActionsForRole } from '@/modules/authorization/domain/matrix'
import { listPermohonanPending } from '@/modules/wajib-khidmah/presentation/queries/list-permohonan.query'
import { ReviewPermohonanDialog } from './review-permohonan-dialog'

export const instant = false

const dateFormat = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' })

export default async function WkPermohonanPage() {
  const session = await getSession()
  if (!session || !getWkActionsForRole(session.user.role).includes('approve')) {
    return <EmptyState title="Akses ditolak" description="Halaman ini hanya untuk reviewer wajib khidmah." />
  }

  const rows = await runWithSessionTenant(session, () => listPermohonanPending())

  return (
    <div className="space-y-4">
      <PageHeader
        title="Wajib Khidmah — Permohonan"
        description="Review permohonan guru bantu dari lembaga."
      />

      {rows.length === 0 ? (
        <EmptyState
          title="Belum ada permohonan"
          description="Permohonan yang masuk akan tampil di sini untuk direview."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3">Lembaga</th>
                <th className="p-3">Wilayah</th>
                <th className="p-3">Jumlah GB</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="p-3 font-medium">{row.namaLembagaPendidikan}</td>
                  <td className="p-3">{row.kabupatenKota}, {row.provinsi}</td>
                  <td className="p-3">{row.jumlahGuruDiminta}</td>
                  <td className="p-3">{dateFormat.format(row.createdAt)}</td>
                  <td className="p-3">
                    <ReviewPermohonanDialog permohonanId={row.id} namaLembaga={row.namaLembagaPendidikan} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
