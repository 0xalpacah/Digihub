# Arc Network RPC Integration Research

## Node Providers for Arc Network

Node providers offer RPC endpoints and infrastructure that allow developers to connect to the Arc network, submit transactions, and query blockchain data.

### Available Providers

| Provider | Description | Features |
|----------|-------------|----------|
| **Alchemy** | Developer platform providing scalable access to EVM networks with enhanced APIs, monitoring, and debugging tools | Scalable APIs, monitoring, debugging, enhanced tools |
| **Blockdaemon** | Institutional-grade node provider offering secure and compliant infrastructure for Arc and other EVM chains | Enterprise-grade, secure, compliant |
| **dRPC** | Decentralized RPC aggregator providing high-speed, load-balanced access to Arc nodes through a multi-provider architecture | Decentralized, load-balanced, high-speed |
| **QuickNode** | High-performance blockchain infrastructure offering global endpoints and APIs for developers | Global endpoints, high-performance, developer APIs |

### Connection Options

- **Direct Connection:** Connect directly to Arc's public RPC endpoint
- **Provider SDKs:** Use preferred SDK or web3 client with any infrastructure partner
- **HTTP & WebSocket:** Both HTTP and WebSocket connections supported for testnet and mainnet

### Key Information

- Arc is an open Layer-1 blockchain purpose-built for stablecoin finance
- EVM-compatible environment with reliable, scalable RPC access
- Supports both testnet and mainnet environments
- USDC used for gas fees on Arc

## JSON-RPC Methods Available

Arc Network supports standard Ethereum JSON-RPC API methods:

### Block Methods
- `eth_blockNumber` - Get the latest block number
- `eth_getBlockByNumber` - Get block details by number
- `eth_getBlockByHash` - Get block details by hash

### Transaction Methods
- `eth_sendTransaction` - Submit a transaction
- `eth_getTransactionByHash` - Get transaction details
- `eth_getTransactionReceipt` - Get transaction receipt
- `eth_pendingTransactions` - Get pending transactions

### Account Methods
- `eth_getBalance` - Get account balance
- `eth_getCode` - Get contract code
- `eth_getStorageAt` - Get storage value

### Network Methods
- `eth_gasPrice` - Get current gas price
- `eth_chainId` - Get chain ID
- `net_version` - Get network version
- `web3_clientVersion` - Get client version

## Implementation Strategy

### 1. Choose Primary RPC Provider
- QuickNode or Alchemy for production (reliable, well-documented)
- dRPC for decentralized approach
- Blockdaemon for enterprise needs

### 2. Setup Environment Variables
```
ARC_RPC_URL=https://[provider-endpoint]
ARC_RPC_BACKUP_URL=https://[backup-endpoint]
ARC_CHAIN_ID=1
```

### 3. Create Web3 Client
- Use Ethers.js or Web3.js for RPC interactions
- Implement error handling and retry logic
- Add caching to avoid rate limiting

### 4. Implement tRPC Procedures
- Create procedures for fetching metrics
- Add real-time data fetching
- Implement caching strategies

## Metrics to Fetch

- **Best Block:** Latest block number and hash
- **Block Time:** Average time between blocks
- **Gas Price:** Current gas price in Gwei
- **Active Nodes:** Number of active validator nodes
- **Difficulty:** Current network difficulty
- **Hashrate:** Network hashrate
- **Uncles:** Number of uncle blocks
- **Transaction Count:** Recent transaction count
- **Network Status:** Overall network health

## Data Indexers for Arc

### Available Indexers
1. **Envio** - Real-time data indexing
2. **Goldsky** - High-performance indexing
3. **The Graph** - Decentralized indexing
4. **Thirdweb** - Web3 development platform

These can be used for more complex queries and historical data analysis.
