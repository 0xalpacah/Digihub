import React, { useEffect, useState } from 'react';
import { Activity, Zap, TrendingUp, Users, Gauge, Clock, Cpu } from 'lucide-react';

interface NetworkMetrics {
  bestBlock: number;
  uncleCount: number;
  lastBlockTime?: Date;
  avgBlockTime?: number;
  avgNetworkHashrate?: string;
  difficulty?: string;
  activeNodes?: number;
  totalNodes?: number;
  gasPrice?: string;
  gasLimit?: string;
  pageLatency?: number;
  uptime?: string;
}

export default function NetworkDashboard() {
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data - will be replaced with actual API calls
    const mockMetrics: NetworkMetrics = {
      bestBlock: 15847293,
      uncleCount: 42,
      lastBlockTime: new Date(),
      avgBlockTime: 12500,
      avgNetworkHashrate: '850.5 TH/s',
      difficulty: '12.5 PH',
      activeNodes: 8547,
      totalNodes: 9200,
      gasPrice: '45.2 Gwei',
      gasLimit: '30000000',
      pageLatency: 127,
      uptime: '99.98%',
    };
    
    setMetrics(mockMetrics);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 bg-card border rounded flex items-center justify-center" style={{ borderColor: 'rgba(0, 255, 255, 0.3)' }}>
        <div className="text-cyan-400 font-mono animate-pulse">Loading network metrics...</div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-cyan-400 neon-cyan">
          [ ARC NETWORK STATUS ]
        </h2>
        <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-magenta-500 to-transparent opacity-50"></div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Best Block */}
        <div className="card-cyber group hover:scale-105 transition-transform">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-mono">
                Best Block
              </p>
              <p className="text-2xl font-bold text-cyan-400 neon-cyan mt-2">
                #{metrics.bestBlock.toLocaleString()}
              </p>
            </div>
            <div className="p-2 rounded border" style={{ backgroundColor: 'rgba(0, 255, 255, 0.1)', borderColor: 'rgba(0, 255, 255, 0.3)' }}>
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="text-green-400">↑ +2,847</span> in 24h
          </div>
        </div>

        {/* Uncle Count */}
        <div className="card-cyber group hover:scale-105 transition-transform">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-mono">
                Uncles (24h)
              </p>
              <p className="text-2xl font-bold text-magenta-400 neon-magenta mt-2">
                {metrics.uncleCount}
              </p>
            </div>
            <div className="p-2 rounded border" style={{ backgroundColor: 'rgba(255, 0, 255, 0.1)', borderColor: 'rgba(255, 0, 255, 0.3)' }}>
              <Activity className="w-5 h-5 text-magenta-400" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="text-green-400">↓ -3</span> from last period
          </div>
        </div>

        {/* Avg Block Time */}
        <div className="card-cyber group hover:scale-105 transition-transform">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-mono">
                Avg Block Time
              </p>
              <p className="text-2xl font-bold text-green-400 neon-green mt-2">
                {(metrics.avgBlockTime ? metrics.avgBlockTime / 1000 : 0).toFixed(2)}s
              </p>
            </div>
            <div className="p-2 rounded border" style={{ backgroundColor: 'rgba(0, 255, 0, 0.1)', borderColor: 'rgba(0, 255, 0, 0.3)' }}>
              <Clock className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Network average
          </div>
        </div>

        {/* Active Nodes */}
        <div className="card-cyber group hover:scale-105 transition-transform">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-mono">
                Active Nodes
              </p>
              <p className="text-2xl font-bold text-pink-400 mt-2">
                {metrics.activeNodes?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-2 rounded border" style={{ backgroundColor: 'rgba(255, 0, 127, 0.1)', borderColor: 'rgba(255, 0, 127, 0.3)' }}>
              <Users className="w-5 h-5 text-pink-400" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            of {metrics.totalNodes?.toLocaleString() || '0'} total
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Gas Price */}
        <div className="card-cyber">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-mono">
                Gas Price
              </p>
              <Gauge className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xl font-bold text-cyan-400 neon-cyan">
              {metrics.gasPrice}
            </p>
            <div className="h-1 bg-gradient-to-r from-cyan-500 to-transparent rounded"></div>
          </div>
        </div>

        {/* Difficulty */}
        <div className="card-cyber">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-mono">
                Difficulty
              </p>
              <TrendingUp className="w-4 h-4 text-magenta-400" />
            </div>
            <p className="text-xl font-bold text-magenta-400 neon-magenta">
              {metrics.difficulty}
            </p>
            <div className="h-1 bg-gradient-to-r from-magenta-500 to-transparent rounded"></div>
          </div>
        </div>

        {/* Network Hashrate */}
        <div className="card-cyber">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-mono">
                Hashrate
              </p>
              <Cpu className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-xl font-bold text-green-400 neon-green">
              {metrics.avgNetworkHashrate}
            </p>
            <div className="h-1 bg-gradient-to-r from-green-500 to-transparent rounded"></div>
          </div>
        </div>
      </div>

      {/* Network Stats Table */}
      <div className="card-cyber overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottomColor: 'rgba(0, 255, 255, 0.3)' }} className="border-b">
                <th className="px-4 py-3 text-left text-cyan-400 font-mono text-xs uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-4 py-3 text-right text-cyan-400 font-mono text-xs uppercase tracking-wider">
                  Value
                </th>
                <th className="px-4 py-3 text-right text-cyan-400 font-mono text-xs uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottomColor: 'rgba(0, 255, 255, 0.1)', backgroundColor: 'rgba(0, 255, 255, 0.02)' }} className="border-b hover:bg-cyan-500 transition-colors">
                <td className="px-4 py-3 text-muted-foreground">Gas Limit</td>
                <td className="px-4 py-3 text-right font-mono text-foreground">
                  {metrics.gasLimit}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-block px-2 py-1 text-green-400 text-xs rounded border" style={{ backgroundColor: 'rgba(0, 255, 0, 0.2)', borderColor: 'rgba(0, 255, 0, 0.3)' }}>
                    Normal
                  </span>
                </td>
              </tr>
              <tr style={{ borderBottomColor: 'rgba(0, 255, 255, 0.1)', backgroundColor: 'rgba(0, 255, 255, 0.02)' }} className="border-b hover:bg-cyan-500 transition-colors">
                <td className="px-4 py-3 text-muted-foreground">Page Latency</td>
                <td className="px-4 py-3 text-right font-mono text-foreground">
                  {metrics.pageLatency}ms
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-block px-2 py-1 text-green-400 text-xs rounded border" style={{ backgroundColor: 'rgba(0, 255, 0, 0.2)', borderColor: 'rgba(0, 255, 0, 0.3)' }}>
                    Optimal
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-cyan-500 transition-colors" style={{ backgroundColor: 'rgba(0, 255, 255, 0.02)' }}>
                <td className="px-4 py-3 text-muted-foreground">Network Uptime</td>
                <td className="px-4 py-3 text-right font-mono text-foreground">
                  {metrics.uptime}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-block px-2 py-1 text-green-400 text-xs rounded border" style={{ backgroundColor: 'rgba(0, 255, 0, 0.2)', borderColor: 'rgba(0, 255, 0, 0.3)' }}>
                    Excellent
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-xs text-muted-foreground text-center space-y-1 py-4 border-t" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
        <p>
          <span className="text-green-400">●</span> Last updated: {new Date().toLocaleTimeString()}
        </p>
        <p className="text-cyan-400">
          [ Arc Network Status Monitor - Real-time Metrics ]
        </p>
      </div>
    </div>
  );
}
