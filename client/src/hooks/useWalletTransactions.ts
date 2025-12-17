import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

export interface Transaction {
  hash: string
  from: string
  to: string | null
  value: string
  gasUsed: string
  gasPrice: string
  blockNumber: number
  timestamp: number
  status: 'success' | 'failed' | 'pending'
  type: 'sent' | 'received' | 'contract'
}

interface WalletTransactions {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  totalCount: number
}

export function useWalletTransactions(limit: number = 10) {
  const { address, isConnected } = useAccount()
  const [txs, setTxs] = useState<WalletTransactions>({
    transactions: [],
    loading: true,
    error: null,
    totalCount: 0,
  })

  useEffect(() => {
    if (!isConnected || !address) {
      setTxs({
        transactions: [],
        loading: false,
        error: 'Wallet not connected',
        totalCount: 0,
      })
      return
    }

    const fetchTransactions = async () => {
      try {
        setTxs((prev) => ({ ...prev, loading: true, error: null }))

        // Simulated transactions (in real app, fetch from Blockscout API or The Graph)
        const simulatedTxs: Transaction[] = [
          {
            hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            from: address,
            to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
            value: '1.5',
            gasUsed: '21000',
            gasPrice: '50',
            blockNumber: 12345678,
            timestamp: Date.now() - 3600000,
            status: 'success',
            type: 'sent',
          },
          {
            hash: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefab',
            from: '0x1111111111111111111111111111111111111111',
            to: address,
            value: '0.5',
            gasUsed: '21000',
            gasPrice: '45',
            blockNumber: 12345600,
            timestamp: Date.now() - 7200000,
            status: 'success',
            type: 'received',
          },
          {
            hash: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            from: address,
            to: '0x2222222222222222222222222222222222222222',
            value: '0',
            gasUsed: '150000',
            gasPrice: '55',
            blockNumber: 12345500,
            timestamp: Date.now() - 10800000,
            status: 'success',
            type: 'contract',
          },
        ]

        setTxs({
          transactions: simulatedTxs.slice(0, limit),
          loading: false,
          error: null,
          totalCount: simulatedTxs.length,
        })
      } catch (err) {
        setTxs((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to fetch transactions',
        }))
      }
    }

    fetchTransactions()
  }, [address, isConnected, limit])

  return txs
}
