import { useEffect, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'

interface TokenBalance {
  symbol: string
  name: string
  balance: string
  decimals: number
  usdValue?: number
}

interface WalletBalance {
  eth: string
  tokens: TokenBalance[]
  totalUSD: number
  loading: boolean
  error: string | null
}

export function useWalletBalance() {
  const { address, isConnected } = useAccount()
  const { data: ethBalance, isLoading: ethLoading } = useBalance({
    address,
  })

  const [balance, setBalance] = useState<WalletBalance>({
    eth: '0',
    tokens: [],
    totalUSD: 0,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!isConnected || !address) {
      setBalance({
        eth: '0',
        tokens: [],
        totalUSD: 0,
        loading: false,
        error: 'Wallet not connected',
      })
      return
    }

    const fetchBalance = async () => {
      try {
        setBalance((prev) => ({ ...prev, loading: true, error: null }))

        // ETH Balance
        const ethValue = ethBalance ? formatEther(ethBalance.value) : '0'

        // Simulated token balances (in real app, fetch from contract)
        const tokens: TokenBalance[] = [
          {
            symbol: 'USDC',
            name: 'USD Coin',
            balance: '1000.00',
            decimals: 6,
            usdValue: 1000,
          },
          {
            symbol: 'USDT',
            name: 'Tether',
            balance: '500.00',
            decimals: 6,
            usdValue: 500,
          },
          {
            symbol: 'DAI',
            name: 'Dai Stablecoin',
            balance: '250.00',
            decimals: 18,
            usdValue: 250,
          },
        ]

        const ethUSD = parseFloat(ethValue) * 3500 // Simulated ETH price
        const tokensUSD = tokens.reduce((sum, t) => sum + (t.usdValue || 0), 0)
        const totalUSD = ethUSD + tokensUSD

        setBalance({
          eth: ethValue,
          tokens,
          totalUSD,
          loading: ethLoading,
          error: null,
        })
      } catch (err) {
        setBalance((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to fetch balance',
        }))
      }
    }

    fetchBalance()
  }, [address, isConnected, ethBalance, ethLoading])

  return balance
}
