import { useState, useEffect } from 'react'
import { usePortfolio } from '@/hooks/usePortfolio'
import { usePrices } from '@/hooks/usePrices'
import { Briefcase, TrendingUp, Plus, Trash2 } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface PriceHistory {
  date: string
  btc: number
  eth: number
  usdc: number
}

export default function Portfolio() {
  const { portfolio, addAsset, removeAsset, clearPortfolio } = usePortfolio()
  const { prices, loading: pricesLoading } = usePrices()
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([])
  const [newAsset, setNewAsset] = useState({ symbol: '', amount: 0 })
  const [period, setPeriod] = useState<'1h' | '24h' | '7d'>('24h')

  // Simulate price history data
  useEffect(() => {
    const generateHistory = () => {
      const history: PriceHistory[] = []
      const now = new Date()
      const hours = period === '1h' ? 12 : period === '24h' ? 24 : 168

      for (let i = hours; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 60 * 60 * 1000)
        const variance = Math.random() * 0.1 - 0.05 // ±5% variance

        history.push({
          date: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          btc: (prices.bitcoin?.usd || 0) * (1 + variance),
          eth: (prices.ethereum?.usd || 0) * (1 + variance),
          usdc: (prices.usd_coin?.usd || 1) * (1 + variance * 0.1),
        })
      }
      setPriceHistory(history)
    }

    if (!pricesLoading) {
      generateHistory()
    }
  }, [period, prices, pricesLoading])

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault()
    if (newAsset.symbol && newAsset.amount > 0) {
      addAsset({
        symbol: newAsset.symbol.toUpperCase(),
        amount: newAsset.amount,
        value: newAsset.amount * (prices[newAsset.symbol.toLowerCase() as keyof typeof prices]?.usd || 0),
      })
      setNewAsset({ symbol: '', amount: 0 })
    }
  }

  const COLORS = ['#00e5ff', '#2775ca', '#7c3aed', '#00ff88', '#ff00ff']

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <a href="/" className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
          <img src="/digi-hub-logo-styled.png" alt="DIGI Hub" className="h-14 w-14 object-contain drop-shadow-lg" />
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="text-cyan-400 neon-cyan">[</span>
            <span className="text-cyan-400 neon-cyan">PORTFOLIO</span>
            <span className="text-cyan-400 neon-cyan">]</span>
          </h1>
        </a>
        <p className="text-gray-400 font-mono text-sm">Manage your crypto assets and track prices</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6 flex gap-2">
        {(['1h', '24h', '7d'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded font-mono text-sm transition-colors ${
              period === p
                ? 'bg-cyan-500 text-black'
                : 'border border-cyan-500 text-cyan-400 hover:bg-cyan-950'
            }`}
          >
            {p.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Price Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Line Chart - Price Trends */}
        <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-cyan-500/30">
          <h3 className="text-cyan-400 mb-4 flex items-center gap-2 font-bold">
            <TrendingUp className="w-5 h-5" />
            Price Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 229, 255, 0.1)" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #00e5ff' }} />
              <Legend />
              <Line type="monotone" dataKey="btc" stroke="#f7931a" name="BTC" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="eth" stroke="#627eea" name="ETH" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="usdc" stroke="#2775ca" name="USDC" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Price Comparison */}
        <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-purple-500/30">
          <h3 className="text-purple-400 mb-4 flex items-center gap-2 font-bold">
            <TrendingUp className="w-5 h-5" />
            Current Prices
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'BTC', value: prices.bitcoin?.usd || 0 },
                { name: 'ETH', value: prices.ethereum?.usd || 0 },
                { name: 'USDC', value: prices.usd_coin?.usd || 1 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 58, 237, 0.1)" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #7c3aed' }} />
              <Bar dataKey="value" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Asset Form & Portfolio */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Add Asset Form */}
        <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-green-500/30">
          <h3 className="text-green-400 mb-4 flex items-center gap-2 font-bold">
            <Plus className="w-5 h-5" />
            Add Asset
          </h3>
          <form onSubmit={handleAddAsset} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Symbol</label>
              <input
                type="text"
                value={newAsset.symbol}
                onChange={(e) => setNewAsset({ ...newAsset, symbol: e.target.value })}
                placeholder="BTC, ETH, USDC..."
                className="w-full px-3 py-2 bg-black border border-green-500/30 rounded text-white font-mono text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Amount</label>
              <input
                type="number"
                value={newAsset.amount}
                onChange={(e) => setNewAsset({ ...newAsset, amount: parseFloat(e.target.value) })}
                placeholder="0.00"
                step="0.0001"
                className="w-full px-3 py-2 bg-black border border-green-500/30 rounded text-white font-mono text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition-colors"
            >
              Add Asset
            </button>
          </form>
        </div>

        {/* Portfolio Overview */}
        <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-cyan-500/30 md:col-span-2">
          <h3 className="text-cyan-400 mb-4 flex items-center gap-2 font-bold">
            <Briefcase className="w-5 h-5" />
            Your Assets ({portfolio.assets.length})
          </h3>
          
          {portfolio.assets.length === 0 ? (
            <p className="text-gray-500 text-sm">No assets yet. Add one to get started!</p>
          ) : (
            <div className="space-y-3">
              {portfolio.assets.map((asset) => (
                <div key={asset.symbol} className="flex justify-between items-center p-3 bg-black/30 rounded border border-cyan-500/20">
                  <div>
                    <span className="text-cyan-400 font-mono font-bold">{asset.symbol}</span>
                    <span className="text-gray-500 text-sm ml-2">{asset.amount.toFixed(4)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-300 font-mono text-sm">${(asset.value || 0).toFixed(2)}</span>
                    <button
                      onClick={() => removeAsset(asset.symbol)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="pt-3 border-t border-cyan-500/20 mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-cyan-400 font-bold">Total Value</span>
                  <span className="text-cyan-300 font-mono font-bold">${portfolio.totalValue.toFixed(2)}</span>
                </div>
                <button
                  onClick={clearPortfolio}
                  className="w-full px-3 py-1 text-xs text-red-400 border border-red-500/30 rounded hover:border-red-500 transition-colors"
                >
                  Clear Portfolio
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Distribution Pie Chart */}
      {portfolio.assets.length > 0 && (
        <div className="mt-8 bg-[var(--bg-card)] p-6 rounded-xl border border-purple-500/30">
          <h3 className="text-purple-400 mb-4 flex items-center gap-2 font-bold">
            <TrendingUp className="w-5 h-5" />
            Asset Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={portfolio.assets.map((a) => ({ name: a.symbol, value: a.value || 0 }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} $${value.toFixed(0)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {portfolio.assets.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #7c3aed' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
