// src/modules/letter/domain/letter-numbering.rules.ts

const BULAN_ROMAWI = [
  '',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
] as const

export function formatBulanRomawi(month: number): string {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error('Bulan tidak valid (1-12)')
  }
  return BULAN_ROMAWI[month]
}

export interface GenerateLetterNumberInput {
  seq: number
  level: string
  category: string
  month: number
  year: number
  sequenceDigits: number
}

export function generateLetterNumber(input: GenerateLetterNumberInput): string {
  const { seq, level, category, month, year, sequenceDigits } = input
  const paddedSeq = String(seq).padStart(sequenceDigits, '0')
  const romanMonth = formatBulanRomawi(month)
  return `${paddedSeq}/${level}/${category}/${romanMonth}/${year}`
}
