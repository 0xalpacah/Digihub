import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useBlockscoutAPI } from './useBlockscoutAPI'

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
  const { getAddressTransactions } = useBlockscoutAPI()

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

        // Fetch transactions from Blockscout
        const blockscoutTxs = await getAddressTransactions(address, limit)

        const transactions: Transaction[] = blockscoutTxs.map((tx) => {
          const isFrom = tx.from.hash.toLowerCase() === address.toLowerCase()
          const isTo = tx.to?.hash.toLowerCase() === address.toLowerCase()
          
          let type: 'sent' | 'received' | 'contract' = 'contract'
          if (isFrom && !isTo) type = 'sent'
          else if (isTo && !isFrom) type = 'received'

          return {
            hash: tx.hash,
            from: tx.from.hash,
            to: tx.to?.hash || null,
            value: (BigInt(tx.value) / BigInt(10 ** 18)).toString(), // Convert to ETH
            gasUsed: tx.gas_used,
            gasPrice: (BigInt(tx.gas_price) / BigInt(10 ** 9)).toString(), // Convert to Gwei
            blockNumber: tx.block_number,
            timestamp: new Date(tx.timestamp).getTime(),
            status: tx.status === 'ok' ? 'success' : 'failed',
            type,
          }
        })

        setTxs({
          transactions,
          loading: false,
          error: null,
          totalCount: transactions.length,
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
  }, [address, isConnected, limit, getAddressTransactions])

  return txs
}
