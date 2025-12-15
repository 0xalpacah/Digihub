import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { trpc } from '@/lib/trpc';

interface MetricsTrendChartsProps {
  hours?: number;
}

export default function MetricsTrendCharts({ hours = 24 }: MetricsTrendChartsProps) {
  const [selectedHours, setSelectedHours] = useState(hours);

  // Fetch trends data
  const trendsQuery = trpc.metricsTrends.getAllTrends.useQuery({ hours: selectedHours });
  const statsQuery = trpc.metricsTrends.getMetricsStats.useQuery({ hours: selectedHours });

  const trends = trendsQuery.data?.trends;
  const stats = statsQuery.data?.stats;

  const hourOptions = [1, 6, 12, 24, 48, 168];

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex gap-2 flex-wrap">
        {hourOptions.map((h) => (
          <button
            key={h}
            onClick={() => setSelectedHours(h)}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
              selectedHours === h
                ? 'bg-cyan-500 text-black border border-cyan-400'
                : 'border border-cyan-500 text-cyan-400 hover:border-cyan-400'
            }`}
          >
            {h}H
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gas Price Stats */}
          <div className="border border-cyan-500 bg-black p-4 rounded">
            <h4 className="text-cyan-400 font-mono text-sm mb-3">GAS PRICE STATS</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Average:</span>
                <span className="text-white font-mono">{stats.gasPrice.average.toFixed(2)} Gwei</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max:</span>
                <span className="text-red-400 font-mono">{stats.gasPrice.max.toFixed(2)} Gwei</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Min:</span>
                <span className="text-green-400 font-mono">{stats.gasPrice.min.toFixed(2)} Gwei</span>
              </div>
            </div>
          </div>

          {/* Block Time Stats */}
          <div className="border border-magenta-500 bg-black p-4 rounded">
            <h4 className="text-magenta-400 font-mono text-sm mb-3">BLOCK TIME STATS</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Average:</span>
                <span className="text-white font-mono">{stats.blockTime.average.toFixed(2)}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max:</span>
                <span className="text-red-400 font-mono">{stats.blockTime.max.toFixed(2)}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Min:</span>
                <span className="text-green-400 font-mono">{stats.blockTime.min.toFixed(2)}s</span>
              </div>
            </div>
          </div>

          {/* Transaction Stats */}
          <div className="border border-yellow-500 bg-black p-4 rounded">
            <h4 className="text-yellow-400 font-mono text-sm mb-3">TRANSACTION STATS</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Average:</span>
                <span className="text-white font-mono">{stats.transactions.average.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total:</span>
                <span className="text-green-400 font-mono">{stats.transactions.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Peak:</span>
                <span className="text-red-400 font-mono">{stats.transactions.max}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gas Price Trend Chart */}
      {trends?.gasPrice && trends.gasPrice.length > 0 && (
        <div className="border border-cyan-500 bg-black p-4 rounded">
          <h3 className="text-cyan-400 font-mono text-sm mb-4">GAS PRICE TREND</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trends.gasPrice}>
              <defs>
                <linearGradient id="colorGasPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{ backgroundColor: '#000', border: '1px solid #06b6d4' }}
                labelStyle={{ color: '#06b6d4' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#06b6d4"
                fillOpacity={1}
                fill="url(#colorGasPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Block Time Trend Chart */}
      {trends?.blockTime && trends.blockTime.length > 0 && (
        <div className="border border-magenta-500 bg-black p-4 rounded">
          <h3 className="text-magenta-400 font-mono text-sm mb-4">BLOCK TIME TREND</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends.blockTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{ backgroundColor: '#000', border: '1px solid #d946ef' }}
                labelStyle={{ color: '#d946ef' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#d946ef"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Transaction Volume Trend Chart */}
      {trends?.transactions && trends.transactions.length > 0 && (
        <div className="border border-yellow-500 bg-black p-4 rounded">
          <h3 className="text-yellow-400 font-mono text-sm mb-4">TRANSACTION VOLUME TREND</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trends.transactions}>
              <defs>
                <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{ backgroundColor: '#000', border: '1px solid #eab308' }}
                labelStyle={{ color: '#eab308' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#eab308"
                fillOpacity={1}
                fill="url(#colorTransactions)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Loading State */}
      {(trendsQuery.isLoading || statsQuery.isLoading) && (
        <div className="text-center py-8">
          <p className="text-gray-400 font-mono">LOADING TRENDS...</p>
        </div>
      )}

      {/* Error State */}
      {(trendsQuery.error || statsQuery.error) && (
        <div className="border border-red-500 bg-red-950 p-4 rounded">
          <p className="text-red-200 font-mono text-sm">
            Error loading trends: {trendsQuery.error?.message || statsQuery.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}
