# Arc Web3 Blog - Project TODO

## Phase 1: Database Schema & Core Infrastructure
- [ ] Design and implement database schema for blog posts, comments, categories, tags
- [ ] Create schema for Arc network metrics and real-time data storage
- [ ] Implement schema for user roles (admin, creator, viewer)
- [ ] Create migrations and test database connectivity

## Phase 2: Backend API & tRPC Procedures
- [ ] Create tRPC procedures for blog post CRUD operations
- [ ] Implement comment system procedures (create, read, delete)
- [ ] Build category and tag management procedures
- [ ] Create admin-only procedures for post moderation
- [ ] Implement search and filter procedures
- [ ] Build Arc network metrics fetching procedures
- [ ] Create procedures for real-time WebSocket connections

## Phase 3: Frontend - Core Pages & Layout
- [x] Design and implement cyberpunk-themed global layout with glitch effects
- [x] Clone design style from status.brisescan.com for dashboard (colors, shapes, layout)
- [x] Create Home/Landing page with hero section
- [x] Build Blog listing page with categories and filters
- [x] Implement individual blog post page with comments
- [x] Create Resources page for Arc tools documentation
- [x] Build Admin dashboard for post management

## Phase 4: Frontend - Dashboard & Real-time Features
- [ ] Implement Arc network metrics dashboard (best block, uncles, block time, etc.)
- [ ] Build real-time metrics updates using WebSockets/SSE
- [ ] Create recent activity feed (latest blocks, transactions, miners)
- [ ] Implement live gas price and network status indicators

## Phase 5: Advanced Features
- [ ] Implement email/in-app alert system for network events
- [ ] Build image generation for blog post covers (AI-powered)
- [ ] Create featured creator projects section
- [ ] Implement search functionality with full-text search
- [ ] Build tag cloud and category navigation

## Phase 6: Real-time Integration & Optimization
- [ ] Integrate Arc RPC endpoints for live data
- [ ] Set up WebSocket connections for real-time updates
- [ ] Implement data caching strategies
- [ ] Optimize database queries for performance
- [ ] Add rate limiting for API calls

## Phase 7: Testing & Quality Assurance
- [ ] Write Vitest tests for backend procedures
- [ ] Test API integrations with Arc Network
- [ ] Perform UI/UX testing on cyberpunk design
- [ ] Test real-time features and WebSocket connections
- [ ] Performance testing and optimization

## Phase 8: Presentation & Results
- [x] Build static presentation page for results (results.html)
- [x] Add interactive charts and data visualizations
- [x] Document key benefits: explore data intuitively, understand trends, save/share easily

## Phase 9: Deployment & Documentation
- [ ] Create deployment documentation
- [ ] Set up monitoring and logging
- [ ] Create user documentation

---

## Completed Items
(None yet)


## Phase 10: Arc Network RPC Integration
- [x] Research Arc Network RPC endpoints and documentation
- [x] Create tRPC procedures for fetching real-time metrics (best block, gas price, block time, etc.)
- [x] Implement Ethers.js integration for RPC calls
- [ ] Add caching strategy for metrics to avoid rate limiting
- [x] Create procedures for fetching recent blocks and transactions
- [x] Implement procedures for network statistics (active nodes, difficulty, hashrate)

## Phase 11: AI-Powered Image Generation for Blog Covers
- [x] Create tRPC procedure for generating blog post cover images
- [x] Integrate with Manus image generation API (generateImage helper)
- [x] Design prompt engineering for consistent cyberpunk aesthetic
- [x] Add image generation to admin post creation form
- [ ] Implement image preview and regeneration functionality
- [x] Store generated images in S3 with storagePut helper
- [ ] Add image metadata to blog_posts table

## Phase 12: Real-time Metrics Display
- [ ] Update NetworkDashboard component to use real tRPC data
- [ ] Implement auto-refresh for metrics (every 5-10 seconds)
- [ ] Add loading states and error handling
- [ ] Create metrics history tracking
- [ ] Build charts for metrics trends


## Phase 13: Dashboard On-chain + Off-chain
- [x] Create Solidity contract for Arc Network registry (ArcNetworkRegistry.sol)
- [ ] Deploy contract to Arc Network testnet/mainnet
- [x] Create tRPC procedures to read on-chain data (balances, supply, holders)
- [x] Integrate contract ABI and address in frontend
- [x] Build advanced Dashboard page with on-chain + off-chain data visualization
- [ ] Add real-time updates for on-chain metrics
- [ ] Create leaderboard of top holders/contributors
- [ ] Add blockchain explorer links for transactions


## Phase 14: Metrics Trends & Wallet Integration
- [x] Create metrics history storage module (metrics-history.ts)
- [x] Implement tRPC procedures for trend data (gas price, block time, transaction volume)
- [x] Create MetricsTrendCharts component with Recharts
- [x] Add time range selector (1h, 6h, 12h, 24h, 48h, 7d)
- [x] Display metrics statistics (average, min, max)
- [x] Implement useWalletConnection hook for MetaMask integration
- [x] Create WalletConnector component for UI
- [x] Add wallet connection to Dashboard header
- [x] Implement network switching to Arc Network (chainId 42161)
- [x] Add metrics trends charts to Dashboard
- [ ] Implement wallet transaction signing for contract interactions
- [ ] Add project registration form with wallet integration
- [ ] Add donation/tip functionality with USDC


## Phase 15: Contract Interactions (Register Projects & Donate USDC)
- [x] Create RegisterProjectForm component with validation
- [x] Create DonateUSDCForm component with USDC transfer logic
- [x] Implement registerProject contract interaction
- [x] Implement USDC approve and transfer logic
- [x] Create ContractInteractions page with tabs
- [x] Add form validation and error handling
- [x] Add success feedback and transaction confirmation
- [x] Integrate wallet connection checks
- [x] Add Arc Network verification
- [x] Display on-chain statistics (projects, donations, contributors)
- [x] Add refresh button to update data after transactions
- [ ] Deploy ArcNetworkRegistry contract to Arc Network
- [ ] Update ARC_REGISTRY_ADDRESS in environment variables
- [ ] Add contract interaction links to Home and Dashboard pages


## Bugs Reported
- [x] Dashboard button not working - FIXED: Changed from button to anchor tag with href
- [x] Wallet connector button not appearing - FIXED: Added useState/useEffect imports to useWalletConnection hook
