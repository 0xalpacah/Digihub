import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useBlockscoutAPI } from './useBlockscoutAPI'

export interface NFT {
  id: string
  name: string
  collection: string
  image: string
  contractAddress: string
  tokenId: string
  floorPrice?: number
  rarity?: string
}

interface WalletNFTs {
  nfts: NFT[]
  loading: boolean
  error: string | null
  totalCount: number
}

export function useWalletNFTs() {
  const { address, isConnected } = useAccount()
  const { getAddressNFTs } = useBlockscoutAPI()

  const [nfts, setNFTs] = useState<WalletNFTs>({
    nfts: [],
    loading: true,
    error: null,
    totalCount: 0,
  })

  useEffect(() => {
    if (!isConnected || !address) {
      setNFTs({
        nfts: [],
        loading: false,
        error: 'Wallet not connected',
        totalCount: 0,
      })
      return
    }

    const fetchNFTs = async () => {
      try {
        setNFTs((prev) => ({ ...prev, loading: true, error: null }))

        // Fetch NFTs from Blockscout
        const blockscoutNFTs = await getAddressNFTs(address)

        const nfts: NFT[] = blockscoutNFTs.map((nft) => {
          const metadata = (nft as any).metadata || {}
          const token = (nft as any).token || {}
          
          return {
            id: `${token.address}-${nft.token_id}`,
            name: metadata.name || token.name || 'Unknown NFT',
            collection: token.name || 'Unknown Collection',
            image: metadata.image || (nft as any).image_url || 'https://via.placeholder.com/200?text=NFT',
            contractAddress: token.address || '',
            tokenId: nft.token_id,
            floorPrice: undefined, // Would need additional API call
            rarity: undefined, // Would need additional API call
          }
        })

        setNFTs({
          nfts,
          loading: false,
          error: null,
          totalCount: nfts.length,
        })
      } catch (err) {
        // NFTs endpoint might not be available on all chains
        // Fallback to empty array instead of error
        setNFTs({
          nfts: [],
          loading: false,
          error: err instanceof Error ? err.message : 'NFTs not available',
          totalCount: 0,
        })
      }
    }

    fetchNFTs()
  }, [address, isConnected, getAddressNFTs])

  return nfts
}
