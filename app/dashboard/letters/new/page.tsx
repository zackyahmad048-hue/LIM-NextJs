import { PageHeader } from '@/components/layout/page-header'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { createLetterAction } from '@/modules/letter/presentation/actions/create-letter.action'

export default function NewLetterPage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <PageHeader title="Buat Surat" description="Surat dibuat sebagai draft DIKETIK." />
      <ActionForm action={createLetterAction} submitLabel="Simpan Draft">
        <div className="space-y-4">
          <FormField label="Tipe" name="type">
            <select name="type" className="w-full rounded-md border bg-transparent px-3 py-2">
              <option value="KELUAR">KELUAR</option>
              <option value="MASUK">MASUK</option>
            </select>
          </FormField>
          <FormField label="Pengirim" name="pengirim">
            <input name="pengirim" required className="w-full rounded-md border bg-transparent px-3 py-2" />
          </FormField>
          <FormField label="Penerima" name="penerima">
            <input name="penerima" className="w-full rounded-md border bg-transparent px-3 py-2" />
          </FormField>
          <FormField label="Perihal" name="perihal">
            <input name="perihal" required className="w-full rounded-md border bg-transparent px-3 py-2" />
          </FormField>
          <FormField label="Isi Surat" name="isiSurat">
            <textarea name="isiSurat" required rows={8} className="w-full rounded-md border bg-transparent px-3 py-2" />
          </FormField>
        </div>
      </ActionForm>
    </div>
  )
}
