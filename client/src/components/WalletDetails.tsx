import { useAccount } from 'wagmi'
import { useWalletBalance } from '@/hooks/useWalletBalance'
import { useWalletTransactions } from '@/hooks/useWalletTransactions'
import { useWalletNFTs } from '@/hooks/useWalletNFTs'
import { Wallet, TrendingUp, Send, ArrowDownUp, Image as ImageIcon, Zap } from 'lucide-react'
import { useState } from 'react'

export default function WalletDetails() {
  const { address, isConnected } = useAccount()
  const balance = useWalletBalance()
  const { transactions, loading: txLoading } = useWalletTransactions(5)
  const { nfts, loading: nftLoading } = useWalletNFTs()
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'nfts'>('overview')

  if (!isConnected || !address) {
    return (
      <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-cyan-500/30">
        <div className="text-center py-8">
          <Wallet className="w-12 h-12 mx-auto text-cyan-400 mb-4 opacity-50" />
          <p className="text-gray-400 font-mono">Connect your wallet to view details</p>
        </div>
      </div>
    )
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-cyan-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Connected Wallet</p>
              <p className="text-cyan-400 font-mono font-bold">{formatAddress(address)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Total Value</p>
            <p className="text-cyan-400 font-bold text-2xl">${balance.totalUSD.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-cyan-500/20">
        {(['overview', 'transactions', 'nfts'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-mono text-sm uppercase transition-colors ${
              activeTab === tab
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-500 hover:text-cyan-400'
            }`}
          >
            {tab === 'overview' && 'Overview'}
            {tab === 'transactions' && 'Transactions'}
            {tab === 'nfts' && 'NFTs'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* ETH Balance */}
          <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-bold">ETH Balance</span>
              </div>
              <span className="text-blue-300 font-mono">{parseFloat(balance.eth).toFixed(4)} ETH</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">${(parseFloat(balance.eth) * 3500).toFixed(2)}</div>
          </div>

          {/* Tokens */}
          <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-purple-500/30">
            <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Token Balances
            </h3>
            <div className="space-y-3">
              {balance.tokens.map((token) => (
                <div key={token.symbol} className="flex justify-between items-center p-3 bg-black/30 rounded border border-purple-500/20">
                  <div>
                    <p className="text-purple-400 font-mono font-bold">{token.symbol}</p>
                    <p className="text-gray-500 text-sm">{token.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-300 font-mono">{token.balance}</p>
                    <p className="text-gray-500 text-sm">${token.usdValue?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-green-500/30">
              <p className="text-green-400 text-sm font-mono mb-2">Total Tokens</p>
              <p className="text-green-300 font-bold text-xl">{balance.tokens.length}</p>
            </div>
            <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-magenta-500/30">
              <p className="text-magenta-400 text-sm font-mono mb-2">Total Transactions</p>
              <p className="text-magenta-300 font-bold text-xl">42</p>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-cyan-500/30">
          <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
            <ArrowDownUp className="w-5 h-5" />
            Recent Transactions
          </h3>
          {txLoading ? (
            <p className="text-gray-500 text-center py-8">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions found</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.hash} className="flex items-center justify-between p-3 bg-black/30 rounded border border-cyan-500/20 hover:border-cyan-500/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'sent' ? 'bg-red-950' : tx.type === 'received' ? 'bg-green-950' : 'bg-blue-950'
                    }`}>
                      {tx.type === 'sent' && <Send className="w-5 h-5 text-red-400" />}
                      {tx.type === 'received' && <ArrowDownUp className="w-5 h-5 text-green-400" />}
                      {tx.type === 'contract' && <Zap className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div>
                      <p className="text-cyan-300 font-mono text-sm">{tx.hash.slice(0, 10)}...</p>
                      <p className="text-gray-500 text-xs">{new Date(tx.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-bold ${tx.type === 'sent' ? 'text-red-400' : 'text-green-400'}`}>
                      {tx.type === 'sent' ? '-' : '+'}{tx.value} ETH
                    </p>
                    <p className={`text-xs ${tx.status === 'success' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {tx.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NFTs Tab */}
      {activeTab === 'nfts' && (
        <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-purple-500/30">
          <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            NFT Collection ({nfts.length})
          </h3>
          {nftLoading ? (
            <p className="text-gray-500 text-center py-8">Loading NFTs...</p>
          ) : nfts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No NFTs found</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {nfts.map((nft) => (
                <div key={nft.id} className="rounded-lg overflow-hidden border border-purple-500/30 hover:border-purple-500/60 transition-colors">
                  <img src={nft.image} alt={nft.name} className="w-full h-40 object-cover" />
                  <div className="p-3 bg-black/50">
                    <p className="text-purple-300 font-mono text-sm font-bold truncate">{nft.name}</p>
                    <p className="text-gray-500 text-xs mb-2">{nft.collection}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded ${
                        nft.rarity === 'Rare' ? 'bg-red-950 text-red-400' : 
                        nft.rarity === 'Uncommon' ? 'bg-blue-950 text-blue-400' :
                        'bg-gray-950 text-gray-400'
                      }`}>
                        {nft.rarity}
                      </span>
                      {nft.floorPrice && (
                        <span className="text-purple-400 text-xs font-mono">{nft.floorPrice} ETH</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
