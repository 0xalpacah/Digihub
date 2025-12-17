import { usePrices } from '@/hooks/usePrices'
import { TrendingUp } from 'lucide-react'

export default function PricesCard() {
  const { prices, loading, error } = usePrices()

  if (error) {
    return (
      <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-red-500/30">
        <h3 className="text-red-400 mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Prices
        </h3>
        <p className="text-red-300 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-blue-500/30">
      <h3 className="text-blue-400 mb-4 flex items-center gap-2 font-bold">
        <TrendingUp className="w-5 h-5" />
        Market Prices
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[var(--text-main)]">BTC</span>
          <span className={`font-mono ${loading ? 'animate-pulse' : ''}`}>
            ${prices.bitcoin?.usd?.toFixed(2) || '—'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-[var(--text-main)]">ETH</span>
          <span className={`font-mono ${loading ? 'animate-pulse' : ''}`}>
            ${prices.ethereum?.usd?.toFixed(2) || '—'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-[var(--text-main)]">USDC</span>
          <span className={`font-mono ${loading ? 'animate-pulse' : ''}`}>
            ${prices.usd_coin?.usd?.toFixed(2) || '—'}
          </span>
        </div>
      </div>
    </div>
  )
}
