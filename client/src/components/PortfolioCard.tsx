import { usePortfolio } from '@/hooks/usePortfolio'
import { Briefcase, Trash2 } from 'lucide-react'

export default function PortfolioCard() {
  const { portfolio, removeAsset, clearPortfolio } = usePortfolio()

  return (
    <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-cyan-500/30">
      <h3 className="text-cyan-400 mb-4 flex items-center gap-2 font-bold">
        <Briefcase className="w-5 h-5" />
        My Portfolio
      </h3>
      
      {portfolio.assets.length === 0 ? (
        <p className="text-[var(--text-main)] text-sm opacity-70">No assets yet</p>
      ) : (
        <div className="space-y-3">
          {portfolio.assets.map((asset) => (
            <div key={asset.symbol} className="flex justify-between items-center p-2 bg-black/30 rounded">
              <div>
                <span className="text-[var(--text-main)] font-mono">{asset.symbol}</span>
                <span className="text-gray-500 text-sm ml-2">{asset.amount}</span>
              </div>
              <button
                onClick={() => removeAsset(asset.symbol)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <div className="pt-3 border-t border-gray-700 mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[var(--text-main)] font-bold">Total Value</span>
              <span className="text-cyan-400 font-mono">${portfolio.totalValue.toFixed(2)}</span>
            </div>
            <button
              onClick={clearPortfolio}
              className="w-full px-3 py-1 text-xs text-red-400 border border-red-500/30 rounded hover:border-red-500 transition-colors"
            >
              Clear Portfolio
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
