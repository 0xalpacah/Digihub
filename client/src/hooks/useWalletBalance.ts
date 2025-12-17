import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { useBlockscoutAPI } from './useBlockscoutAPI'

interface TokenBalance {
  symbol: string
  name: string
  balance: string
  decimals: number
  usdValue?: number
  address: string
}

interface WalletBalance {
  eth: string
  tokens: TokenBalance[]
  totalUSD: number
  loading: boolean
  error: string | null
}

// Simulated token prices (in real app, fetch from CoinGecko or similar)
const TOKEN_PRICES: Record<string, number> = {
  'USDC': 1.0,
  'USDT': 1.0,
  'DAI': 1.0,
  'ETH': 3500,
  'ARB': 0.8,
}

export function useWalletBalance() {
  const { address, isConnected } = useAccount()
  const { getNativeBalance, getTokenBalances } = useBlockscoutAPI()

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

        // Fetch native balance
        const nativeBalance = await getNativeBalance(address)
        const ethValue = nativeBalance ? formatEther(BigInt(nativeBalance)) : '0'

        // Fetch token balances from Blockscout
        const blockscoutTokens = await getTokenBalances(address)
        
        const tokens: TokenBalance[] = blockscoutTokens
          .map((tokenBalance) => {
            // tokenBalance has token object with symbol, decimals, etc
            const tokenInfo = (tokenBalance as any).token || tokenBalance
            const symbol = (tokenInfo as any).symbol || 'UNKNOWN'
            const decimals = (tokenInfo as any).decimals || 18
            const name = (tokenInfo as any).name || symbol
            const address = (tokenInfo as any).address || ''
            
            const balance = (BigInt((tokenBalance as any).value || 0) / BigInt(10 ** decimals)).toString()
            const price = TOKEN_PRICES[symbol] || 0
            const usdValue = parseFloat(balance) * price

            return {
              symbol,
              name,
              balance: parseFloat(balance).toFixed(2),
              decimals,
              usdValue,
              address,
            }
          })
          .filter((t) => t.symbol !== 'UNKNOWN') // Filter out invalid entries

        const ethUSD = parseFloat(ethValue) * (TOKEN_PRICES['ETH'] || 3500)
        const tokensUSD = tokens.reduce((sum, t) => sum + (t.usdValue || 0), 0)
        const totalUSD = ethUSD + tokensUSD

        setBalance({
          eth: ethValue,
          tokens,
          totalUSD,
          loading: false,
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
  }, [address, isConnected, getNativeBalance, getTokenBalances])

  return balance
}
