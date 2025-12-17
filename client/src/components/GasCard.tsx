import { useGas } from '@/hooks/useGas'
import { Zap } from 'lucide-react'

export default function GasCard() {
  const { gas, loading, error } = useGas()

  if (error) {
    return (
      <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-red-500/30">
        <h3 className="text-red-400 mb-2 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Gas Prices
        </h3>
        <p className="text-red-300 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-purple-500/30">
      <h3 className="text-purple-400 mb-4 flex items-center gap-2 font-bold">
        <Zap className="w-5 h-5" />
        Gas Prices (Gwei)
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[var(--text-main)]">Fast</span>
          <span className={`font-mono text-green-400 ${loading ? 'animate-pulse' : ''}`}>
            {gas.fast?.toFixed(1) || '—'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-[var(--text-main)]">Standard</span>
          <span className={`font-mono text-yellow-400 ${loading ? 'animate-pulse' : ''}`}>
            {gas.standard?.toFixed(1) || '—'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-[var(--text-main)]">Slow</span>
          <span className={`font-mono text-blue-400 ${loading ? 'animate-pulse' : ''}`}>
            {gas.slow?.toFixed(1) || '—'}
          </span>
        </div>
      </div>
    </div>
  )
}
