import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Wallet, LogOut } from 'lucide-react'

export default function ConnectButton() {
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-4 py-2 rounded-xl border border-blue-500/30 bg-[var(--bg-card)] text-blue-400 font-mono text-sm flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          {formatAddress(address)}
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 rounded-xl border border-red-500/30 bg-[var(--bg-card)] text-red-400 hover:border-red-500 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="cyber-gradient px-6 py-2 rounded-xl text-black font-bold uppercase tracking-wider hover:shadow-lg transition-all"
    >
      Connect Wallet
    </button>
  )
}
