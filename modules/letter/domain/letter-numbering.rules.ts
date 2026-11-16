// modules/letter/domain/letter-numbering.rules.ts

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
    throw new Error(`Bulan tidak valid: ${month}. Harus integer 1-12`)
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

// Helper validasi internal (private di module ini)
function assertValidString(value: string, fieldName: string): void {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${fieldName} tidak boleh kosong`)
  }
  if (value.includes('/')) {
    throw new Error(`${fieldName} tidak boleh mengandung karakter '/'`)
  }
}

function assertValidPositiveInteger(value: number, fieldName: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${fieldName} harus integer positif. Diterima: ${value}`)
  }
}

export function generateLetterNumber(input: GenerateLetterNumberInput): string {
  const { seq, level, category, month, year, sequenceDigits } = input

  // Validasi semua input di layer domain (defense in depth)
  assertValidPositiveInteger(seq, 'Nomor urut (seq)')
  assertValidPositiveInteger(sequenceDigits, 'Jumlah digit (sequenceDigits)')
  assertValidPositiveInteger(year, 'Tahun')
  
  if (year < 1000 || year > 9999) {
    throw new Error(`Tahun harus 4 digit (1000-9999). Diterima: ${year}`)
  }

  assertValidString(level, 'Level (PP/PW/PC)')
  assertValidString(category, 'Kategori surat')

  // Generate nomor (fail-safe: padStart hanya menambah nol jika kurang digit)
  const paddedSeq = String(seq).padStart(sequenceDigits, '0')
  const romanMonth = formatBulanRomawi(month)

  return `${paddedSeq}/${level}/${category}/${romanMonth}/${year}`
}