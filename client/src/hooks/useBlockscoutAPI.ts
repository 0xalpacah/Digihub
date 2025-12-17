import { useCallback } from 'react'

const BLOCKSCOUT_BASE_URL = 'https://blockscout.com/arbitrum/one/api/v2'

export interface BlockscoutTransaction {
  hash: string
  from: { hash: string; name?: string }
  to: { hash: string; name?: string } | null
  value: string
  gas_used: string
  gas_price: string
  block_number: number
  timestamp: string
  status: 'ok' | 'error'
  type: string
}

export interface BlockscoutAddress {
  hash: string
  coin_balance: string
  transaction_count: number
  token_balances: Array<{
    token: {
      address: string
      symbol: string
      decimals: number
      name: string
    }
    value: string
  }>
}

export interface BlockscoutToken {
  address: string
  symbol: string
  name: string
  decimals: number
  total_supply: string
  type: string
}

export interface BlockscoutNFT {
  token_id: string
  token: {
    address: string
    name: string
    symbol: string
    type: string
  }
  owner: {
    hash: string
    name?: string
  }
  image_url?: string
  metadata?: {
    name?: string
    description?: string
    image?: string
  }
}

export function useBlockscoutAPI() {
  /**
   * Buscar informações de um endereço
   */
  const getAddressInfo = useCallback(async (address: string): Promise<BlockscoutAddress | null> => {
    try {
      const response = await fetch(`${BLOCKSCOUT_BASE_URL}/addresses/${address}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching address info:', error)
      return null
    }
  }, [])

  /**
   * Buscar transações de um endereço
   */
  const getAddressTransactions = useCallback(
    async (address: string, limit: number = 10): Promise<BlockscoutTransaction[]> => {
      try {
        const response = await fetch(
          `${BLOCKSCOUT_BASE_URL}/addresses/${address}/transactions?items_count=${limit}`
        )
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        return data.items || []
      } catch (error) {
        console.error('Error fetching transactions:', error)
        return []
      }
    },
    []
  )

  /**
   * Buscar saldos de tokens de um endereço
   */
  const getTokenBalances = useCallback(async (address: string): Promise<BlockscoutToken[]> => {
    try {
      const response = await fetch(`${BLOCKSCOUT_BASE_URL}/addresses/${address}/token_balances`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      return data.items || []
    } catch (error) {
      console.error('Error fetching token balances:', error)
      return []
    }
  }, [])

  /**
   * Buscar informações de um token
   */
  const getTokenInfo = useCallback(async (tokenAddress: string): Promise<BlockscoutToken | null> => {
    try {
      const response = await fetch(`${BLOCKSCOUT_BASE_URL}/tokens/${tokenAddress}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching token info:', error)
      return null
    }
  }, [])

  /**
   * Buscar transação específica
   */
  const getTransaction = useCallback(async (txHash: string): Promise<BlockscoutTransaction | null> => {
    try {
      const response = await fetch(`${BLOCKSCOUT_BASE_URL}/transactions/${txHash}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching transaction:', error)
      return null
    }
  }, [])

  /**
   * Buscar NFTs de um endereço (se disponível)
   */
  const getAddressNFTs = useCallback(async (address: string): Promise<BlockscoutNFT[]> => {
    try {
      const response = await fetch(`${BLOCKSCOUT_BASE_URL}/addresses/${address}/nft`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      return data.items || []
    } catch (error) {
      console.error('Error fetching NFTs:', error)
      return []
    }
  }, [])

  /**
   * Buscar saldo nativo (ETH) de um endereço
   */
  const getNativeBalance = useCallback(async (address: string): Promise<string> => {
    try {
      const addressInfo = await getAddressInfo(address)
      return addressInfo?.coin_balance || '0'
    } catch (error) {
      console.error('Error fetching native balance:', error)
      return '0'
    }
  }, [getAddressInfo])

  return {
    getAddressInfo,
    getAddressTransactions,
    getTokenBalances,
    getTokenInfo,
    getTransaction,
    getAddressNFTs,
    getNativeBalance,
  }
}
