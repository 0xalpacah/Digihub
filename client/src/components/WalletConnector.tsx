import React from 'react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { Wallet, LogOut, AlertCircle, CheckCircle } from 'lucide-react';

export default function WalletConnector() {
  const {
    address,
    isConnected,
    balance,
    chainId,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    isArcNetwork,
    switchToArcNetwork,
  } = useWalletConnection();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <div className="flex items-center gap-2">
          {/* Network Status */}
          {!isArcNetwork() && (
            <button
              onClick={switchToArcNetwork}
              className="px-3 py-2 text-xs font-mono border border-yellow-500 text-yellow-400 rounded hover:border-yellow-400 hover:bg-yellow-950 transition-colors flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              SWITCH NETWORK
            </button>
          )}

          {isArcNetwork() && (
            <div className="px-3 py-2 text-xs font-mono border border-green-500 text-green-400 rounded flex items-center gap-1 bg-green-950">
              <CheckCircle className="w-4 h-4" />
              ARC NETWORK
            </div>
          )}

          {/* Wallet Info */}
          <div className="px-3 py-2 text-xs font-mono border border-cyan-500 text-cyan-400 rounded bg-black">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span>{formatAddress(address!)}</span>
              {balance && <span className="text-gray-500">• {balance} ETH</span>}
            </div>
          </div>

          {/* Disconnect Button */}
          <button
            onClick={disconnectWallet}
            className="px-3 py-2 text-xs font-mono border border-red-500 text-red-400 rounded hover:border-red-400 hover:bg-red-950 transition-colors flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            DISCONNECT
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={loading}
          className="px-4 py-2 text-xs font-mono border border-cyan-500 text-cyan-400 rounded hover:border-cyan-400 hover:bg-cyan-950 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          {loading ? 'CONNECTING...' : 'CONNECT WALLET'}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-xs font-mono text-red-400 bg-red-950 px-2 py-1 rounded border border-red-500">
          {error}
        </div>
      )}
    </div>
  );
}
