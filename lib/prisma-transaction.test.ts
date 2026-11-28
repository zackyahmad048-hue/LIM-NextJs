import { describe, expect, it, vi, beforeEach } from 'vitest'

const txMock = vi.fn()
vi.mock('@/lib/prisma', () => ({ prisma: { $transaction: (...args: unknown[]) => txMock(...args) } }))

import { withRetrySerializable } from './prisma-transaction'

describe('withRetrySerializable', () => {
  beforeEach(() => txMock.mockReset())

  it('returns result on success', async () => {
    txMock.mockResolvedValueOnce('ok')
    await expect(withRetrySerializable(async () => 'ok')).resolves.toBe('ok')
    expect(txMock).toHaveBeenCalledTimes(1)
  })

  it('retries on P2034', async () => {
    txMock.mockRejectedValueOnce({ code: 'P2034' })
    txMock.mockResolvedValueOnce('ok2')
    await expect(withRetrySerializable(async () => 'ok2')).resolves.toBe('ok2')
    expect(txMock).toHaveBeenCalledTimes(2)
  })

  it('throws non-P2034', async () => {
    txMock.mockRejectedValueOnce(new Error('boom'))
    await expect(withRetrySerializable(async () => 'x')).rejects.toThrow('boom')
  })
})
