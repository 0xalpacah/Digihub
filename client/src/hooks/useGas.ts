import { useEffect, useState } from 'react'

interface GasData {
  fast?: number
  standard?: number
  slow?: number
  [key: string]: any
}

export function useGas() {
  const [gas, setGas] = useState<GasData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGas = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://ethgasstation.info/json/ethgasAPI.json')
        if (!response.ok) throw new Error('Failed to fetch gas prices')
        const data = await response.json()
        setGas({
          fast: data.fast / 10,
          standard: data.standard / 10,
          slow: data.safegasPrice / 10,
        })
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setGas({})
      } finally {
        setLoading(false)
      }
    }

    fetchGas()
    const interval = setInterval(fetchGas, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [])

  return { gas, loading, error }
}
