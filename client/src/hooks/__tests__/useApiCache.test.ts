import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useApiCache, clearAllApiCache } from '../useApiCache'

describe('useApiCache', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    localStorage.clear()
  })

  it('should fetch data and cache it', async () => {
    const mockData = { id: 1, name: 'Test' }
    const fetcher = vi.fn().mockResolvedValue(mockData)

    const { result } = renderHook(() => useApiCache('test-key', fetcher, 5000))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockData)
    expect(fetcher).toHaveBeenCalledOnce()
  })

  it('should return cached data on subsequent calls', async () => {
    const mockData = { id: 1, name: 'Test' }
    const fetcher = vi.fn().mockResolvedValue(mockData)

    const { result: result1 } = renderHook(() => useApiCache('test-key', fetcher, 5000))

    await waitFor(() => {
      expect(result1.current.loading).toBe(false)
    })

    // Segunda chamada com a mesma chave
    const { result: result2 } = renderHook(() => useApiCache('test-key', fetcher, 5000))

    await waitFor(() => {
      expect(result2.current.loading).toBe(false)
    })

    expect(result2.current.data).toEqual(mockData)
    expect(fetcher).toHaveBeenCalledOnce() // Não deve chamar novamente
  })

  it('should expire cache after TTL', async () => {
    const mockData = { id: 1, name: 'Test' }
    const fetcher = vi.fn().mockResolvedValue(mockData)

    const { result: result1 } = renderHook(() => useApiCache('test-key', fetcher, 5000))

    await waitFor(() => {
      expect(result1.current.loading).toBe(false)
    })

    expect(fetcher).toHaveBeenCalledOnce()

    // Avançar tempo além do TTL
    vi.advanceTimersByTime(6000)

    const { result: result2 } = renderHook(() => useApiCache('test-key', fetcher, 5000))

    await waitFor(() => {
      expect(result2.current.loading).toBe(false)
    })

    expect(fetcher).toHaveBeenCalledTimes(2) // Deve chamar novamente
  })

  it('should handle fetch errors', async () => {
    const error = new Error('Fetch failed')
    const fetcher = vi.fn().mockRejectedValue(error)

    const { result } = renderHook(() => useApiCache('test-key', fetcher, 5000))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toEqual(error)
    expect(result.current.data).toBeNull()
  })

  it('should clear cache on demand', async () => {
    const mockData = { id: 1, name: 'Test' }
    const fetcher = vi.fn().mockResolvedValue(mockData)

    const { result } = renderHook(() => useApiCache('test-key', fetcher, 5000))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(fetcher).toHaveBeenCalledOnce()

    result.current.clearCache()

    // Segunda chamada após limpar cache
    const { result: result2 } = renderHook(() => useApiCache('test-key', fetcher, 5000))

    await waitFor(() => {
      expect(result2.current.loading).toBe(false)
    })

    expect(fetcher).toHaveBeenCalledTimes(2) // Deve chamar novamente
  })

  it('should clear all cache', async () => {
    const mockData1 = { id: 1, name: 'Test 1' }
    const mockData2 = { id: 2, name: 'Test 2' }
    const fetcher1 = vi.fn().mockResolvedValue(mockData1)
    const fetcher2 = vi.fn().mockResolvedValue(mockData2)

    const { result: result1 } = renderHook(() => useApiCache('key1', fetcher1, 5000))
    const { result: result2 } = renderHook(() => useApiCache('key2', fetcher2, 5000))

    await waitFor(() => {
      expect(result1.current.loading).toBe(false)
      expect(result2.current.loading).toBe(false)
    })

    clearAllApiCache()

    // Novas chamadas após limpar tudo
    const { result: result3 } = renderHook(() => useApiCache('key1', fetcher1, 5000))
    const { result: result4 } = renderHook(() => useApiCache('key2', fetcher2, 5000))

    await waitFor(() => {
      expect(result3.current.loading).toBe(false)
      expect(result4.current.loading).toBe(false)
    })

    expect(fetcher1).toHaveBeenCalledTimes(2)
    expect(fetcher2).toHaveBeenCalledTimes(2)
  })
})
