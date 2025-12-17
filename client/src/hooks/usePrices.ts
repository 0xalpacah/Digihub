import { useEffect, useState } from 'react'

interface Prices {
  ethereum?: { usd: number }
  bitcoin?: { usd: number }
  usd_coin?: { usd: number }
  [key: string]: any
}

export function usePrices() {
  const [prices, setPrices] = useState<Prices>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,usd_coin&vs_currencies=usd'
        )
        if (!response.ok) throw new Error('Failed to fetch prices')
        const data = await response.json()
        setPrices(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setPrices({})
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return { prices, loading, error }
}
