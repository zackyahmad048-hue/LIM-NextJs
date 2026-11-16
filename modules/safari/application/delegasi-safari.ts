// modules/safari/application/delegasi-safari.ts
import type { DelegasiRepository, CreateDelegasiData } from '@/modules/safari/domain/delegasi-safari.repository'
import type { CreateDelegasiInput, CreateJurnalInput } from '@/modules/safari/domain/delegasi-safari.schema'

export class DelegasiError extends Error {
  constructor(message: string) { super(message); this.name = 'DelegasiError' }
}

export async function createDelegasi(repo: DelegasiRepository, input: CreateDelegasiInput) {
  const data: CreateDelegasiData = {
    titikId: input.titikId,
    userId: input.userId,
    namaLengkap: input.namaLengkap,
    noHp: input.noHp,
    asalPondok: input.asalPondok,
  }
  return repo.createDelegasi(data)
}

export async function createJurnal(repo: DelegasiRepository, input: CreateJurnalInput, sessionUserId: string) {
  const delegasi = await repo.findDelegasiByUser(sessionUserId)
  if (!delegasi || delegasi.id !== input.delegasiId) {
    throw new DelegasiError('Anda tidak memiliki akses ke delegasi ini')
  }
  if (delegasi.status !== 'AKTIF') {
    throw new DelegasiError('Delegasi tidak aktif')
  }
  return repo.createJurnal({
    delegasiId: input.delegasiId,
    tanggal: input.tanggal,
    kegiatan: input.kegiatan,
    jumlahJamaah: input.jumlahJamaah,
    catatan: input.catatan,
  })
}