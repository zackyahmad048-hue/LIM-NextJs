// modules/dakwah-digital/domain/konten-dakwah.repository.ts
import type { KontenDakwah, PendaftaranEvent } from '@/generated/client'

export interface CreateKontenData {
  judul: string
  slug: string
  deskripsi: string
  jenisKonten: 'WEBINAR' | 'PODCAST' | 'KONTEN_MEDIASOS' | 'KULTUM_DIGITAL' | 'TANYA_JAWAB_ONLINE'
  thumbnailUrl?: string
  linkVideo?: string
  pengunggahId: string
  status: 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED'
}

export interface KontenDakwahRepository {
  create(data: CreateKontenData): Promise<KontenDakwah>
  findById(id: string): Promise<KontenDakwah | null>
  updateStatus(id: string, status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'REJECTED', extra?: { disetujuiOlehId?: string }): Promise<KontenDakwah>
  registerEvent(data: { kontenId: string; namaPeserta: string; email: string; noHp: string; asalInstansi?: string }): Promise<PendaftaranEvent>
}