import React from 'react';
import { ExternalLink, Code2, Zap, Database, Server } from 'lucide-react';

interface Resource {
  title: string;
  description: string;
  category: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}

const resources: Resource[] = [
  // Node Providers
  {
    title: 'Alchemy',
    description: 'Developer platform providing scalable access to EVM networks with enhanced APIs, monitoring, and debugging tools.',
    category: 'Node Provider',
    url: 'https://www.alchemy.com/',
    icon: <Server className="w-6 h-6" />,
    color: 'cyan',
  },
  {
    title: 'Blockdaemon',
    description: 'Institutional-grade node provider offering secure and compliant infrastructure for Arc and other EVM chains.',
    category: 'Node Provider',
    url: 'https://blockdaemon.com/',
    icon: <Server className="w-6 h-6" />,
    color: 'cyan',
  },
  {
    title: 'dRPC',
    description: 'Decentralized RPC aggregator providing high-speed, load-balanced access to Arc nodes through a multi-provider architecture.',
    category: 'Node Provider',
    url: 'https://drpc.org/',
    icon: <Server className="w-6 h-6" />,
    color: 'cyan',
  },
  {
    title: 'QuickNode',
    description: 'High-performance blockchain infrastructure offering global endpoints and APIs for developers.',
    category: 'Node Provider',
    url: 'https://www.quicknode.com/',
    icon: <Server className="w-6 h-6" />,
    color: 'cyan',
  },
  // Data Indexers
  {
    title: 'Envio',
    description: 'Developer-first indexing framework for event-driven data and GraphQL APIs on Arc. Build production-ready APIs in minutes.',
    category: 'Data Indexer',
    url: 'https://envio.dev/',
    icon: <Database className="w-6 h-6" />,
    color: 'magenta',
  },
  {
    title: 'Goldsky',
    description: 'Managed subgraph and data pipeline platform for Arc contracts with autoscaling query engine and 99.9%+ uptime.',
    category: 'Data Indexer',
    url: 'https://goldsky.com/',
    icon: <Database className="w-6 h-6" />,
    color: 'magenta',
  },
  {
    title: 'The Graph',
    description: 'Decentralized indexing protocol for querying Arc\'s onchain data through APIs. Query smart contract data through multiple indexers.',
    category: 'Data Indexer',
    url: 'https://thegraph.com/',
    icon: <Database className="w-6 h-6" />,
    color: 'magenta',
  },
  {
    title: 'Thirdweb',
    description: 'Open-source blockchain data tooling. Retrieve Arc blockchain data, enrich it with metadata, and transform it using custom logic.',
    category: 'Data Indexer',
    url: 'https://thirdweb.com/',
    icon: <Database className="w-6 h-6" />,
    color: 'magenta',
  },
  // Block Explorers
  {
    title: 'Blockscout',
    description: 'Open-source explorer offering contract verification, token tracking, and API endpoints for custom integrations on Arc Testnet.',
    category: 'Block Explorer',
    url: 'https://testnet.arcscan.app/',
    icon: <Code2 className="w-6 h-6" />,
    color: 'green',
  },
  // Dev Tools
  {
    title: 'Arc RPC Endpoints',
    description: 'Direct access to Arc Network RPC endpoints for HTTP and WebSocket connections. Available through multiple providers.',
    category: 'Dev Tool',
    url: 'https://docs.arc.network/',
    icon: <Zap className="w-6 h-6" />,
    color: 'pink',
  },
];

const categories = ['All', 'Node Provider', 'Data Indexer', 'Block Explorer', 'Dev Tool'];

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredResources = selectedCategory === 'All'
    ? resources
    : resources.filter(r => r.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Node Provider':
        return 'cyan';
      case 'Data Indexer':
        return 'magenta';
      case 'Block Explorer':
        return 'green';
      case 'Dev Tool':
        return 'pink';
      default:
        return 'cyan';
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'cyan':
        return 'text-cyan-400 border-cyan-500 bg-cyan-500';
      case 'magenta':
        return 'text-magenta-400 border-magenta-500 bg-magenta-500';
      case 'green':
        return 'text-green-400 border-green-500 bg-green-500';
      case 'pink':
        return 'text-pink-400 border-pink-500 bg-pink-500';
      default:
        return 'text-cyan-400 border-cyan-500 bg-cyan-500';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="border-b border-cyan-500 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-cyan-400 neon-cyan mb-4 font-mono">
            [ DEVELOPER RESOURCES ]
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Comprehensive tools and services for building on Arc Network. Access RPC endpoints, data indexers, and block explorers.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-cyan-500 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded font-mono text-sm uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-black border border-cyan-400'
                    : 'bg-transparent border border-cyan-500 text-cyan-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, idx) => {
              const colorClasses = getColorClasses(resource.color);
              return (
                <div key={idx} className="card-cyber group hover:scale-105 transition-transform">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded border ${colorClasses}`}>
                      {resource.icon}
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-cyan-500 rounded transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                    </a>
                  </div>

                  <h3 className={`text-lg font-bold mb-2 ${
                    resource.color === 'cyan' ? 'text-cyan-400' :
                    resource.color === 'magenta' ? 'text-magenta-400' :
                    resource.color === 'green' ? 'text-green-400' :
                    'text-pink-400'
                  }`}>
                    {resource.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4">
                    {resource.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-cyan-500">
                    <span className="text-xs px-2 py-1 bg-cyan-500 text-cyan-400 rounded border border-cyan-500">
                      {resource.category}
                    </span>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
                    >
                      Visit →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section className="border-t border-cyan-500 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-magenta-400 neon-magenta mb-8 font-mono">
            [ QUICK START ]
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RPC Endpoints */}
            <div className="card-cyber">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Arc Testnet RPC Endpoints</h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="bg-input p-3 rounded border border-cyan-500">
                  <p className="text-muted-foreground text-xs mb-1">HTTP</p>
                  <p className="text-cyan-300 break-all">https://rpc.testnet.arc.network</p>
                </div>
                <div className="bg-input p-3 rounded border border-cyan-500">
                  <p className="text-muted-foreground text-xs mb-1">WebSocket</p>
                  <p className="text-cyan-300 break-all">wss://rpc.testnet.arc.network</p>
                </div>
              </div>
            </div>

            {/* Network Info */}
            <div className="card-cyber">
              <h3 className="text-xl font-bold text-magenta-400 mb-4">Network Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network Name:</span>
                  <span className="text-magenta-300 font-mono">Arc Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chain ID:</span>
                  <span className="text-magenta-300 font-mono">5042002</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency:</span>
                  <span className="text-magenta-300 font-mono">USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Block Explorer:</span>
                  <a href="https://testnet.arcscan.app/" target="_blank" rel="noopener noreferrer" className="text-magenta-300 hover:text-magenta-200 font-mono">
                    Arcscan →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faucet Section */}
      <section className="border-t border-cyan-500 py-16">
        <div className="container mx-auto px-4">
          <div className="card-cyber bg-gradient-to-r from-green-500 from-opacity-5 to-cyan-500 to-opacity-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-green-400 neon-green mb-2">Get Testnet Tokens</h3>
                <p className="text-muted-foreground">
                  Use the Arc Network faucet to get USDC tokens for testing on the testnet.
                </p>
              </div>
              <a
                href="https://faucet.circle.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cyber whitespace-nowrap"
              >
                Open Faucet →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Guide */}
      <section className="border-t border-cyan-500 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-400 neon-green mb-8 font-mono">
            [ INTEGRATION GUIDE ]
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="card-cyber">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded border-2 border-cyan-400 text-cyan-400 font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-cyan-400 mb-2">Choose a Node Provider</h4>
                  <p className="text-muted-foreground">
                    Select from Alchemy, Blockdaemon, dRPC, or QuickNode for reliable RPC access to Arc Network.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card-cyber">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded border-2 border-magenta-400 text-magenta-400 font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-magenta-400 mb-2">Set Up Your Environment</h4>
                  <p className="text-muted-foreground">
                    Configure your development environment with the RPC endpoint and network details provided above.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="card-cyber">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded border-2 border-green-400 text-green-400 font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-green-400 mb-2">Deploy Your Smart Contracts</h4>
                  <p className="text-muted-foreground">
                    Use your preferred development framework (Hardhat, Truffle, etc.) to deploy contracts to Arc Network.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="card-cyber">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded border-2 border-pink-400 text-pink-400 font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-pink-400 mb-2">Index Your Data</h4>
                  <p className="text-muted-foreground">
                    Use data indexers like Envio, Goldsky, or The Graph to query and analyze your contract data efficiently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
