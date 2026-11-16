// modules/safari/application/titik-safari.ts
import type { TitikSafariRepository, CreateTitikSafariData } from '@/modules/safari/domain/titik-safari.repository'
import type { CreateTitikSafariInput } from '@/modules/safari/domain/titik-safari.schema'

export async function createTitikSafari(repo: TitikSafariRepository, input: CreateTitikSafariInput) {
  const data: CreateTitikSafariData = { ...input }
  return repo.create(data)
}