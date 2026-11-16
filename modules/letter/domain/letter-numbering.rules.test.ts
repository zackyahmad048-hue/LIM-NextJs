// src/modules/letter/domain/letter-numbering.rules.test.ts
import { describe, it, expect } from 'vitest'
import { generateLetterNumber, formatBulanRomawi } from './letter-numbering.rules'

describe('formatBulanRomawi', () => {
  it('converts month numbers to Roman numerals', () => {
    expect(formatBulanRomawi(1)).toBe('I')
    expect(formatBulanRomawi(4)).toBe('IV')
    expect(formatBulanRomawi(9)).toBe('IX')
    expect(formatBulanRomawi(11)).toBe('XI')
    expect(formatBulanRomawi(12)).toBe('XII')
  })

  it('throws for invalid month', () => {
    expect(() => formatBulanRomawi(0)).toThrow()
    expect(() => formatBulanRomawi(13)).toThrow()
  })
})

describe('generateLetterNumber', () => {
  it('generates correct format for PP level', () => {
    const result = generateLetterNumber({
      seq: 1,
      level: 'PP',
      category: 'H',
      month: 11,
      year: 2026,
      sequenceDigits: 3,
    })
    expect(result).toBe('001/PP/H/XI/2026')
  })

  it('pads sequence with zeros', () => {
    const result = generateLetterNumber({
      seq: 5,
      level: 'PC.I.8',
      category: 'A',
      month: 1,
      year: 2026,
      sequenceDigits: 4,
    })
    expect(result).toBe('0005/PC.I.8/A/I/2026')
  })

  it('handles large sequence numbers', () => {
    const result = generateLetterNumber({
      seq: 999,
      level: 'PW.I',
      category: 'K',
      month: 12,
      year: 2026,
      sequenceDigits: 3,
    })
    expect(result).toBe('999/PW.I/K/XII/2026')
  })

  it('handles sequence overflow boundary (999 -> 1000)', () => {
    const result = generateLetterNumber({
      seq: 1000,
      level: 'PP',
      category: 'H',
      month: 1,
      year: 2026,
      sequenceDigits: 3,
    })
    expect(result).toBe('1000/PP/H/I/2026')
  })
})
