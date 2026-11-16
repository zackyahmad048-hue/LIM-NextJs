// modules/pesantren-ramadan/application/penugasan-pesantren.ts
import type { PenugasanPesantrenRepository, CreatePenugasanPesantrenData } from '@/modules/pesantren-ramadan/domain/penugasan-pesantren.repository'
import type { CreatePenugasanPesantrenInput } from '@/modules/pesantren-ramadan/domain/penugasan-pesantren.schema'

export async function createPenugasanPesantren(repo: PenugasanPesantrenRepository, input: CreatePenugasanPesantrenInput) {
  const data: CreatePenugasanPesantrenData = { ...input }
  return repo.create(data)
}