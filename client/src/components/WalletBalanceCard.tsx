import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useAccount } from 'wagmi';
import { Wallet, TrendingUp, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function WalletBalanceCard() {
  const { address, isConnected } = useAccount();
  const balance = useWalletBalance();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Refetch balance - the hook will handle this
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (!isConnected || !address) {
    return (
      <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-cyan-500/30">
        <h3 className="text-cyan-400 mb-4 flex items-center gap-2 font-bold">
          <Wallet className="w-5 h-5" />
          Wallet Balance
        </h3>
        <p className="text-[var(--text-main)] text-sm opacity-70">Connect wallet to view balance</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-cyan-500/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-cyan-400 flex items-center gap-2 font-bold">
          <Wallet className="w-5 h-5" />
          Wallet Balance
        </h3>
        <button
          onClick={handleRefresh}
          disabled={balance.loading || isRefreshing}
          className="p-1 hover:text-cyan-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {balance.error && (
        <p className="text-red-400 text-sm mb-4">{balance.error}</p>
      )}

      {balance.loading ? (
        <p className="text-[var(--text-main)] text-sm opacity-70">Loading balance...</p>
      ) : (
        <div className="space-y-4">
          {/* Wallet Address */}
          <div className="p-3 bg-black/30 rounded border border-gray-700">
            <p className="text-gray-500 text-xs mb-1">Address</p>
            <p className="text-[var(--text-main)] font-mono text-sm break-all">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>

          {/* ETH Balance */}
          <div className="p-3 bg-black/30 rounded border border-cyan-500/20">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-main)] font-mono">ETH</span>
              <span className="text-cyan-400 font-bold">{balance.eth}</span>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              ≈ ${(parseFloat(balance.eth) * 2925.21).toFixed(2)} USD
            </p>
          </div>

          {/* Token Balances */}
          {balance.tokens.length > 0 && (
            <div className="space-y-2">
              {balance.tokens.map((token) => (
                <div key={token.symbol} className="p-3 bg-black/30 rounded border border-green-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-main)] font-mono">{token.symbol}</span>
                    <span className="text-green-400 font-bold">{token.balance}</span>
                  </div>
                  {token.usdValue && (
                    <p className="text-gray-500 text-xs mt-1">
                      ≈ ${token.usdValue.toFixed(2)} USD
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Total Value */}
          <div className="pt-3 border-t border-gray-700 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-main)] font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Total Value
              </span>
              <span className="text-cyan-400 font-mono font-bold">
                ${balance.totalUSD.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Last Updated */}
          <p className="text-gray-600 text-xs text-center mt-3">
            Updates every 10 seconds
          </p>
        </div>
      )}
    </div>
  );
}
