import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PortfolioChart = () => {
  const [timeframe, setTimeframe] = useState<'1D' | '7D' | '30D' | '90D'>('7D');

  // Sample portfolio data
  const data = {
    '1D': [
      { time: '00:00', value: 5000 },
      { time: '04:00', value: 5150 },
      { time: '08:00', value: 5320 },
      { time: '12:00', value: 5280 },
      { time: '16:00', value: 5450 },
      { time: '20:00', value: 5600 },
      { time: '23:59', value: 5750 },
    ],
    '7D': [
      { time: 'Mon', value: 5000 },
      { time: 'Tue', value: 5150 },
      { time: 'Wed', value: 5320 },
      { time: 'Thu', value: 5280 },
      { time: 'Fri', value: 5450 },
      { time: 'Sat', value: 5600 },
      { time: 'Sun', value: 5750 },
    ],
    '30D': [
      { time: 'Week 1', value: 5000 },
      { time: 'Week 2', value: 5200 },
      { time: 'Week 3', value: 5400 },
      { time: 'Week 4', value: 5750 },
    ],
    '90D': [
      { time: 'Jan', value: 4500 },
      { time: 'Feb', value: 4800 },
      { time: 'Mar', value: 5200 },
      { time: 'Apr', value: 5750 },
    ],
  };

  const currentData = data[timeframe];
  const startValue = currentData[0].value;
  const endValue = currentData[currentData.length - 1].value;
  const change = endValue - startValue;
  const changePercent = ((change / startValue) * 100).toFixed(2);

  return (
    <div className="w-full bg-slate-900 border border-cyan-500 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-cyan-400 text-lg font-mono">📈 PORTFOLIO PERFORMANCE</h3>
          <p className="text-gray-400 text-sm mt-1">Track your wealth growth over time</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-cyan-400">${endValue.toFixed(2)}</p>
          <p className={`text-sm font-mono ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '+' : ''}{changePercent}% ({change >= 0 ? '+' : ''}${change.toFixed(2)})
          </p>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {(['1D', '7D', '30D', '90D'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 font-mono text-sm rounded border transition-all ${
              timeframe === tf
                ? 'bg-cyan-500 text-black border-cyan-500'
                : 'bg-transparent text-cyan-400 border-cyan-400 hover:bg-cyan-500/10'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={currentData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
          <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #06b6d4',
              borderRadius: '8px',
              color: '#06b6d4',
            }}
            formatter={(value) => `$${Number(value).toFixed(2)}`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#06b6d4"
            dot={{ fill: '#06b6d4', r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 text-center text-sm">
        <div className="border border-green-500 rounded p-3 bg-green-500/5">
          <p className="text-gray-400">Highest</p>
          <p className="text-green-400 font-bold">${Math.max(...currentData.map(d => d.value)).toFixed(2)}</p>
        </div>
        <div className="border border-cyan-500 rounded p-3 bg-cyan-500/5">
          <p className="text-gray-400">Average</p>
          <p className="text-cyan-400 font-bold">
            ${(currentData.reduce((a, d) => a + d.value, 0) / currentData.length).toFixed(2)}
          </p>
        </div>
        <div className="border border-yellow-500 rounded p-3 bg-yellow-500/5">
          <p className="text-gray-400">Lowest</p>
          <p className="text-yellow-400 font-bold">${Math.min(...currentData.map(d => d.value)).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart;
