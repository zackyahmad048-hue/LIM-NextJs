// modules/letter/application/create-letter.ts
import type { CreateLetterData, LetterRepository } from '@/modules/letter/domain/letter.repository'
import type { CreateLetterInput } from '@/modules/letter/domain/letter.schema'

export async function createLetter(
  repo: LetterRepository,
  input: CreateLetterInput,
  createdById: string
) {
  const data: CreateLetterData = {
    type: input.type,
    pengirim: input.pengirim,
    penerima: input.penerima,
    perihal: input.perihal,
    isiSurat: input.isiSurat,
    createdById,
  }
  return repo.create(data)
}