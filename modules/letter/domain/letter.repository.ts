// modules/letter/domain/letter.repository.ts
import type { Letter, LetterStatus, LetterType } from "@/generated/client"

export interface CreateLetterData {
  type: LetterType
  pengirim: string
  penerima?: string
  perihal: string
  isiSurat: string
  createdById: string
}

export interface LetterRepository {
  create(data: CreateLetterData): Promise<Letter>
  findById(id: string): Promise<Letter | null>
  findMany(filter: {
    status?: LetterStatus
    type?: LetterType
    q?: string
    skip: number
    take: number
  }): Promise<{ items: Letter[]; total: number }>
  updateStatus(id: string, status: LetterStatus, extra?: Partial<Letter>): Promise<Letter>
}