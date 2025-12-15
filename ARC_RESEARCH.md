# Arc Network - Research & APIs Documentation

## Network Details

### Arc Testnet
- **Network Name:** Arc Testnet
- **Chain ID:** 5042002
- **Currency:** USDC
- **RPC Endpoints:**
  - https://rpc.testnet.arc.network
  - https://rpc.blockdaemon.testnet.arc.network
  - https://rpc.drpc.testnet.arc.network
  - https://rpc.quicknode.testnet.arc.network

### WebSocket Endpoints
- wss://rpc.testnet.arc.network
- wss://rpc.drpc.testnet.arc.network
- wss://rpc.quicknode.testnet.arc.network

### Block Explorers
- **Blockscout:** https://testnet.arcscan.app (Open-source explorer with contract verification, token tracking, API endpoints)

### Faucet
- https://faucet.circle.com

## Tools & Services

### Block Explorers
- **Blockscout:** Open-source explorer offering contract verification, token tracking, and API endpoints for custom integrations. Available for Arc Testnet.

### Data Indexers
Data indexers make it easy to query and analyze onchain data from Arc. They provide APIs and SDKs for tracking smart contract events, balances, and historical state changes without running your own indexing infrastructure.

#### Providers:
1. **Envio**
   - Developer-first indexing framework for event-driven data and GraphQL APIs on Arc
   - HyperIndex: Build production-ready APIs from Arc data in minutes
   - Stream live blockchain events with minimal latency

2. **Goldsky**
   - Managed subgraph and data pipeline platform for Arc contracts
   - Subgraphs: Autoscaling query engine with 99.9%+ uptime and up to 6× faster performance
   - Mirror: Stream Arc onchain data to your database with sub-second latency for combined on/offchain queries

3. **The Graph**
   - Decentralized indexing protocol for querying Arc's onchain data through APIs
   - Subgraphs: Query smart contract data on Arc through multiple indexers, reducing single points of failure
   - Graph Explorer: Discover and reuse subgraphs published by other developers on The Graph Network

4. **Thirdweb**
   - Open-source blockchain data tooling
   - Insight: Retrieve Arc blockchain data, enrich it with metadata, and transform it using custom logic

### Node Providers
Node providers offer RPC endpoints and infrastructure that allow developers to connect to the Arc network, submit transactions, and query blockchain data.

#### Providers:
1. **Alchemy**
   - Developer platform providing scalable access to EVM networks with enhanced APIs, monitoring, and debugging tools

2. **Blockdaemon**
   - Institutional-grade node provider offering secure and compliant infrastructure for Arc and other EVM chains

3. **dRPC**
   - Decentralized RPC aggregator providing high-speed, load-balanced access to Arc nodes through a multi-provider architecture

4. **QuickNode**
   - High-performance blockchain infrastructure offering global endpoints and APIs for developers

## Key Arc Features

### Core Architecture
- **EVM Compatibility:** Arc is fully EVM-compatible, allowing developers to query, transform, and combine onchain data using familiar APIs and tools
- **Account Abstraction:** Support for account abstraction enabling advanced user experience features
- **Deterministic Finality:** Ensures transaction finality with predictable block confirmation
- **Opt-in Privacy:** Privacy features for sensitive transactions
- **Stable Fee Design:** Predictable fee structure using USDC-based fees

## API Integration Points for Blog

1. **RPC Endpoints:** Query network metrics (block height, gas price, difficulty, hashrate)
2. **Block Explorer APIs:** Fetch recent transactions, miners, blocks
3. **Data Indexers:** Query contract events, token transfers, DeFi activity
4. **WebSocket Streams:** Real-time updates for blocks, transactions, and network events

## Content Categories for Blog

1. **Arc Network News:** Updates about protocol changes, network upgrades
2. **Creator Projects:** Showcasing projects built on Arc by community creators
3. **Web3 Discussions:** Technical discussions about Web3, DeFi, NFTs on Arc
4. **Technical Tutorials:** How-to guides for deploying and interacting with Arc
5. **Network Metrics:** Deep dives into network performance and statistics
