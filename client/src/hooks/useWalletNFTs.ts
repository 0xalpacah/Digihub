import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

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

        // Simulated NFTs (in real app, fetch from Alchemy, Moralis, or OpenSea API)
        const simulatedNFTs: NFT[] = [
          {
            id: 'nft-1',
            name: 'Cyber Punk #1234',
            collection: 'Cyber Punks',
            image: 'https://via.placeholder.com/200?text=NFT1',
            contractAddress: '0x1111111111111111111111111111111111111111',
            tokenId: '1234',
            floorPrice: 2.5,
            rarity: 'Rare',
          },
          {
            id: 'nft-2',
            name: 'Digital Art #5678',
            collection: 'Digital Arts',
            image: 'https://via.placeholder.com/200?text=NFT2',
            contractAddress: '0x2222222222222222222222222222222222222222',
            tokenId: '5678',
            floorPrice: 1.2,
            rarity: 'Common',
          },
          {
            id: 'nft-3',
            name: 'Web3 Badge #9999',
            collection: 'Web3 Badges',
            image: 'https://via.placeholder.com/200?text=NFT3',
            contractAddress: '0x3333333333333333333333333333333333333333',
            tokenId: '9999',
            floorPrice: 0.5,
            rarity: 'Uncommon',
          },
        ]

        setNFTs({
          nfts: simulatedNFTs,
          loading: false,
          error: null,
          totalCount: simulatedNFTs.length,
        })
      } catch (err) {
        setNFTs((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to fetch NFTs',
        }))
      }
    }

    fetchNFTs()
  }, [address, isConnected])

  return nfts
}
