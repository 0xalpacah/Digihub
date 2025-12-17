import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Activity, Users, Zap, Coins, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import WalletConnector from '@/components/WalletConnector';
import MetricsTrendCharts from '@/components/MetricsTrendCharts';
import ConnectButton from '@/components/ConnectButton';
import PricesCard from '@/components/PricesCard';
import GasCard from '@/components/GasCard';
import PortfolioCard from '@/components/PortfolioCard';
import { useAuth } from '@/_core/hooks/useAuth';
import WalletDetails from '@/components/WalletDetails';

interface DashboardMetrics {
  networkMetrics: any;
  onChainData: any;
  loading: boolean;
  error: string | null;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    networkMetrics: null,
    onChainData: null,
    loading: true,
    error: null,
  });

  // Fetch network metrics
  const networkMetricsQuery = trpc.arcMetrics.getNetworkMetrics.useQuery();
  
  // Fetch on-chain data
  const onChainDataQuery = trpc.onChainData.getDashboardData.useQuery();

  useEffect(() => {
    setMetrics({
      networkMetrics: networkMetricsQuery.data?.data,
      onChainData: onChainDataQuery.data?.data,
      loading: networkMetricsQuery.isLoading || onChainDataQuery.isLoading,
      error: networkMetricsQuery.error?.message || onChainDataQuery.error?.message || null,
    });
  }, [networkMetricsQuery.data, onChainDataQuery.data, networkMetricsQuery.isLoading, onChainDataQuery.isLoading]);

  const refreshData = () => {
    networkMetricsQuery.refetch();
    onChainDataQuery.refetch();
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header with Wallet Connector */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
            <img src="/digi-hub-logo-styled.png" alt="DIGI Hub" className="h-16 w-16 object-contain drop-shadow-lg" />
          </a>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-cyan-400 neon-cyan">[</span>
              <span className="text-cyan-400 neon-cyan">DASHBOARD</span>
              <span className="text-cyan-400 neon-cyan">]</span>
            </h1>
            <p className="text-gray-400 font-mono text-sm">Arc Network Real-time Metrics & On-chain Data</p>
          </div>
        </div>
        <div className="hidden md:block">
          <WalletConnector />
        </div>
      </div>
      
      {/* Mobile Wallet Connector */}
      <div className="md:hidden mb-4">
        <WalletConnector />
      </div>

      {/* Error Alert */}
      {metrics.error && (
        <div className="mb-6 p-4 border border-red-500 bg-red-950 rounded">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200">{metrics.error}</span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="mb-6 flex justify-between items-center gap-4">
        <div className="flex gap-2">
          <a href="/contract" className="px-4 py-2 border border-green-500 text-green-400 rounded hover:border-green-400 hover:bg-green-950 transition-colors font-mono text-sm">
            CONTRACT INTERACTIONS
          </a>
        </div>
      </div>

      {/* Web3 Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <PricesCard />
        <GasCard />
        <PortfolioCard />
      </div>

      {/* Refresh Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={refreshData}
          disabled={metrics.loading}
          className="px-4 py-2 border border-cyan-500 text-cyan-400 rounded hover:border-cyan-400 hover:bg-cyan-950 transition-colors disabled:opacity-50 font-mono text-sm"
        >
          {metrics.loading ? 'LOADING...' : 'REFRESH'}
        </button>
      </div>

      {/* Network Metrics Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          <span className="text-magenta-400">&gt;</span> NETWORK METRICS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Best Block */}
          <div className="border border-cyan-500 bg-black p-4 rounded hover:border-cyan-400 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-cyan-400 font-mono text-xs">BEST BLOCK</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {metrics.networkMetrics?.bestBlock || '—'}
            </p>
            <p className="text-gray-500 font-mono text-xs mt-2">
              {metrics.networkMetrics?.bestBlockHash?.slice(0, 16)}...
            </p>
          </div>

          {/* Gas Price */}
          <div className="border border-magenta-500 bg-black p-4 rounded hover:border-magenta-400 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-magenta-400 font-mono text-xs">GAS PRICE</span>
              <TrendingUp className="w-4 h-4 text-magenta-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {metrics.networkMetrics?.gasPrice ? `${parseFloat(metrics.networkMetrics.gasPrice).toFixed(2)} Gwei` : '—'}
            </p>
            <p className="text-gray-500 font-mono text-xs mt-2">Current</p>
          </div>

          {/* Block Time */}
          <div className="border border-green-500 bg-black p-4 rounded hover:border-green-400 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 font-mono text-xs">BLOCK TIME</span>
              <Activity className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {metrics.networkMetrics?.blockTime ? `${metrics.networkMetrics.blockTime.toFixed(2)}s` : '—'}
            </p>
            <p className="text-gray-500 font-mono text-xs mt-2">Average</p>
          </div>

          {/* Recent Transactions */}
          <div className="border border-yellow-500 bg-black p-4 rounded hover:border-yellow-400 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-400 font-mono text-xs">RECENT TXS</span>
              <Activity className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {metrics.networkMetrics?.recentTransactions || '—'}
            </p>
            <p className="text-gray-500 font-mono text-xs mt-2">Last 10 blocks</p>
          </div>
        </div>

        {/* Network Status */}
        <div className="mt-4 p-4 border border-cyan-500 rounded bg-black">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-mono text-sm">Network Status:</span>
            <span className="text-green-400 font-mono text-sm">
              ● {metrics.networkMetrics?.networkStatus || 'UNKNOWN'}
            </span>
          </div>
        </div>
      </div>

      {/* On-chain Data Section */}
      {metrics.onChainData && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            <span className="text-magenta-400">&gt;</span> ON-CHAIN REGISTRY
          </h2>

          {/* Registry Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Contributors */}
            <div className="border border-cyan-500 bg-black p-4 rounded hover:border-cyan-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-cyan-400 font-mono text-xs">CONTRIBUTORS</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {metrics.onChainData?.registry?.contributorCount || 0}
              </p>
            </div>

            {/* Projects */}
            <div className="border border-magenta-500 bg-black p-4 rounded hover:border-magenta-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-magenta-400 font-mono text-xs">PROJECTS</span>
                <TrendingUp className="w-4 h-4 text-magenta-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {metrics.onChainData?.registry?.projectCount || 0}
              </p>
            </div>

            {/* Snapshots */}
            <div className="border border-green-500 bg-black p-4 rounded hover:border-green-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-mono text-xs">SNAPSHOTS</span>
                <Activity className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {metrics.onChainData?.registry?.snapshotCount || 0}
              </p>
            </div>

            {/* USDC Balance */}
            <div className="border border-yellow-500 bg-black p-4 rounded hover:border-yellow-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-400 font-mono text-xs">USDC BALANCE</span>
                <Coins className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                ${parseFloat(metrics.onChainData?.registry?.usdcBalance || '0').toFixed(2)}
              </p>
            </div>
          </div>

          {/* Contributors List */}
          {metrics.onChainData?.contributors && metrics.onChainData.contributors.length > 0 && (
            <div className="mb-6 border border-cyan-500 rounded bg-black p-4">
              <h3 className="text-lg font-bold mb-4 text-cyan-400">Active Contributors</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {metrics.onChainData.contributors.map((contributor: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 border-b border-gray-800 hover:bg-gray-950 transition-colors">
                    <div>
                      <p className="font-mono text-sm text-white">{contributor.name}</p>
                      <p className="font-mono text-xs text-gray-500">{contributor.wallet.slice(0, 10)}...{contributor.wallet.slice(-8)}</p>
                    </div>
                    <span className="text-xs text-green-400 font-mono">{contributor.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured Projects */}
          {metrics.onChainData?.projects && metrics.onChainData.projects.length > 0 && (
            <div className="border border-magenta-500 rounded bg-black p-4">
              <h3 className="text-lg font-bold mb-4 text-magenta-400">Featured Projects</h3>
              <div className="space-y-3">
                {metrics.onChainData.projects.map((project: any, idx: number) => (
                  <div key={idx} className="border border-gray-800 p-3 rounded hover:border-magenta-500 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-white">{project.name}</h4>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 text-xs font-mono"
                      >
                        VISIT →
                      </a>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{project.description}</p>
                    <p className="text-xs text-gray-500 font-mono">
                      By: {project.creator.slice(0, 10)}...{project.creator.slice(-8)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {metrics.loading && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin">
              <span className="text-cyan-400 font-mono text-2xl">[◆◆◆]</span>
            </div>
          </div>
          <p className="text-gray-400 font-mono mt-4">LOADING METRICS...</p>
        </div>
      )}

      {/* Metrics Trends Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          <span className="text-green-400">&gt;</span> METRICS TRENDS
        </h2>
        <MetricsTrendCharts hours={24} />
      </div>

      {/* Wallet Details Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          <span className="text-cyan-400">&gt;</span> WALLET DETAILS
        </h2>
        <WalletDetails />
      </div>
      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-800 text-center">
        <p className="text-gray-500 font-mono text-xs">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
        <p className="text-gray-600 font-mono text-xs mt-2">
          Arc Network Registry Dashboard • On-chain + Off-chain Data • Metrics Trends
        </p>
      </div>
    </div>
  )
}
