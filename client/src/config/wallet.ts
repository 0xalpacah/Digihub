import { createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum, sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'
import type { Chain } from 'wagmi/chains'

// Arc Network Configuration
const arcNetwork: Chain = {
  id: 42161,
  name: 'Arc Network',
  nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.arc.network'] },
    public: { http: ['https://rpc.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://blockscout.com/arbitrum/one' },
  },
  testnet: false,
}

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

export const config = createConfig({
  chains: [arcNetwork, mainnet, polygon, arbitrum, sepolia],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [arcNetwork.id]: http('https://rpc.arc.network'),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [sepolia.id]: http(),
  },
})

export { arcNetwork }
