// modules/dakwah-digital/application/konten-dakwah.ts
import type { KontenDakwahRepository, CreateKontenData } from '@/modules/dakwah-digital/domain/konten-dakwah.repository'
import type { CreateKontenInput, PendaftaranEventInput } from '@/modules/dakwah-digital/domain/konten-dakwah.schema'

export class KontenError extends Error {
  constructor(message: string) { super(message); this.name = 'KontenError' }
}

export async function uploadKonten(repo: KontenDakwahRepository, input: CreateKontenInput, pengunggahId: string, isPusat: boolean) {
  const data: CreateKontenData = {
    judul: input.judul,
    slug: input.slug,
    deskripsi: input.deskripsi,
    jenisKonten: input.jenisKonten,
    thumbnailUrl: input.thumbnailUrl,
    linkVideo: input.linkVideo,
    pengunggahId,
    // PW/PC upload → pending review; pusat bisa langsung draft
    status: isPusat ? 'DRAFT' : 'PENDING_REVIEW',
  }
  return repo.create(data)
}

export async function approveKonten(repo: KontenDakwahRepository, id: string, approverId: string) {
  const k = await repo.findById(id)
  if (!k) throw new KontenError('Konten tidak ditemukan')
  if (k.status !== 'PENDING_REVIEW') throw new KontenError(`Status ${k.status} tidak dapat disetujui`)
  return repo.updateStatus(id, 'APPROVED', { disetujuiOlehId: approverId })
}

export async function publishKonten(repo: KontenDakwahRepository, id: string) {
  const k = await repo.findById(id)
  if (!k) throw new KontenError('Konten tidak ditemukan')
  if (k.status !== 'APPROVED') throw new KontenError(`Status ${k.status} tidak dapat dipublikasikan`)
  return repo.updateStatus(id, 'PUBLISHED')
}

export async function registerEvent(repo: KontenDakwahRepository, input: PendaftaranEventInput) {
  const k = await repo.findById(input.kontenId)
  if (!k) throw new KontenError('Konten tidak ditemukan')
  if (k.status !== 'PUBLISHED') throw new KontenError('Event belum dipublikasikan')
  return repo.registerEvent({
    kontenId: input.kontenId,
    namaPeserta: input.namaPeserta,
    email: input.email,
    noHp: input.noHp,
    asalInstansi: input.asalInstansi,
  })
}