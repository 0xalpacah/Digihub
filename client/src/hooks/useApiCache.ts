import { useCallback, useEffect, useState } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

const CACHE_STORAGE_KEY = 'api_cache'

/**
 * Hook para cachear respostas de API com TTL
 * @param key Chave única para o cache
 * @param fetcher Função que busca os dados
 * @param ttl Tempo de vida do cache em ms (default: 5 minutos)
 */
export function useApiCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const getCache = useCallback((): T | null => {
    try {
      const cache = localStorage.getItem(CACHE_STORAGE_KEY)
      if (!cache) return null

      const entries = JSON.parse(cache) as Record<string, CacheEntry<T>>
      const entry = entries[key]

      if (!entry) return null

      const isExpired = Date.now() - entry.timestamp > entry.ttl
      if (isExpired) {
        delete entries[key]
        localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(entries))
        return null
      }

      return entry.data
    } catch {
      return null
    }
  }, [key])

  const setCache = useCallback(
    (data: T) => {
      try {
        const cache = localStorage.getItem(CACHE_STORAGE_KEY)
        const entries = cache ? JSON.parse(cache) : {}

        entries[key] = {
          data,
          timestamp: Date.now(),
          ttl,
        }

        localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(entries))
      } catch {
        console.warn('Failed to set cache')
      }
    },
    [key, ttl]
  )

  const clearCache = useCallback(() => {
    try {
      const cache = localStorage.getItem(CACHE_STORAGE_KEY)
      if (!cache) return

      const entries = JSON.parse(cache) as Record<string, CacheEntry<T>>
      delete entries[key]
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(entries))
    } catch {
      console.warn('Failed to clear cache')
    }
  }, [key])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Tenta buscar do cache primeiro
        const cachedData = getCache()
        if (cachedData) {
          setData(cachedData)
          setLoading(false)
          return
        }

        // Se não estiver em cache, busca da API
        const freshData = await fetcher()
        setData(freshData)
        setCache(freshData)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [key, fetcher, getCache, setCache])

  return { data, loading, error, clearCache, refetch: () => clearCache() }
}

/**
 * Limpar todo o cache de API
 */
export function clearAllApiCache() {
  try {
    localStorage.removeItem(CACHE_STORAGE_KEY)
  } catch {
    console.warn('Failed to clear all cache')
  }
}
