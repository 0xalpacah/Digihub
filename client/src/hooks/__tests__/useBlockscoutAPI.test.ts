import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBlockscoutAPI } from '../useBlockscoutAPI'

// Mock fetch
global.fetch = vi.fn()

describe('useBlockscoutAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch address info successfully', async () => {
    const mockAddressData = {
      hash: '0x1234567890123456789012345678901234567890',
      coin_balance: '1000000000000000000',
      transaction_count: 42,
      token_balances: [],
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAddressData,
    })

    const { result } = renderHook(() => useBlockscoutAPI())

    const addressInfo = await result.current.getAddressInfo('0x1234567890123456789012345678901234567890')

    expect(addressInfo).toEqual(mockAddressData)
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/addresses/0x1234567890123456789012345678901234567890')
    )
  })

  it('should fetch transactions successfully', async () => {
    const mockTransactions = {
      items: [
        {
          hash: '0xabc123',
          from: { hash: '0x1111' },
          to: { hash: '0x2222' },
          value: '1000000000000000000',
          gas_used: '21000',
          gas_price: '50000000000',
          block_number: 12345678,
          timestamp: '2025-12-16T21:00:00Z',
          status: 'ok',
          type: 'transaction',
        },
      ],
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTransactions,
    })

    const { result } = renderHook(() => useBlockscoutAPI())

    const transactions = await result.current.getAddressTransactions('0x1234567890123456789012345678901234567890', 10)

    expect(transactions).toHaveLength(1)
    expect(transactions[0].hash).toBe('0xabc123')
  })

  it('should handle fetch errors gracefully', async () => {
    ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useBlockscoutAPI())

    const addressInfo = await result.current.getAddressInfo('0x1234567890123456789012345678901234567890')

    expect(addressInfo).toBeNull()
  })

  it('should fetch token balances successfully', async () => {
    const mockTokenBalances = {
      items: [
        {
          token: {
            address: '0xusdc',
            symbol: 'USDC',
            decimals: 6,
            name: 'USD Coin',
          },
          value: '1000000000',
        },
      ],
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenBalances,
    })

    const { result } = renderHook(() => useBlockscoutAPI())

    const tokenBalances = await result.current.getTokenBalances('0x1234567890123456789012345678901234567890')

    expect(tokenBalances).toHaveLength(1)
    expect(tokenBalances[0].token.symbol).toBe('USDC')
  })

  it('should return empty array on API error', async () => {
    ;(global.fetch as any).mockRejectedValueOnce(new Error('API error'))

    const { result } = renderHook(() => useBlockscoutAPI())

    const transactions = await result.current.getAddressTransactions('0x1234567890123456789012345678901234567890')

    expect(transactions).toEqual([])
  })
})
