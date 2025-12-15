/**
 * Metrics History Storage
 * Stores historical metrics data for trend analysis
 * In production, this would use a database or time-series database
 */

interface MetricsSnapshot {
  timestamp: Date;
  blockNumber: number;
  gasPrice: number;
  blockTime: number;
  transactionCount: number;
}

// In-memory storage (will be cleared on server restart)
// For production, use a database like InfluxDB, TimescaleDB, or MongoDB
const metricsHistory: MetricsSnapshot[] = [];

// Keep only last 24 hours of data (1440 minutes)
const MAX_HISTORY_SIZE = 1440;

/**
 * Add a metrics snapshot to history
 */
export function addMetricsSnapshot(snapshot: MetricsSnapshot): void {
  metricsHistory.push(snapshot);

  // Remove old entries if we exceed max size
  if (metricsHistory.length > MAX_HISTORY_SIZE) {
    metricsHistory.shift();
  }
}

/**
 * Get metrics history for the last N hours
 */
export function getMetricsHistory(hours: number = 24): MetricsSnapshot[] {
  const now = new Date();
  const cutoffTime = new Date(now.getTime() - hours * 60 * 60 * 1000);

  return metricsHistory.filter((snapshot) => snapshot.timestamp >= cutoffTime);
}

/**
 * Get gas price trend data
 */
export function getGasPriceTrend(hours: number = 24) {
  const history = getMetricsHistory(hours);

  return history.map((snapshot) => ({
    timestamp: snapshot.timestamp.toISOString(),
    gasPrice: snapshot.gasPrice,
    time: snapshot.timestamp.toLocaleTimeString(),
  }));
}

/**
 * Get block time trend data
 */
export function getBlockTimeTrend(hours: number = 24) {
  const history = getMetricsHistory(hours);

  return history.map((snapshot) => ({
    timestamp: snapshot.timestamp.toISOString(),
    blockTime: snapshot.blockTime,
    time: snapshot.timestamp.toLocaleTimeString(),
  }));
}

/**
 * Get transaction volume trend data
 */
export function getTransactionVolumeTrend(hours: number = 24) {
  const history = getMetricsHistory(hours);

  return history.map((snapshot) => ({
    timestamp: snapshot.timestamp.toISOString(),
    transactions: snapshot.transactionCount,
    time: snapshot.timestamp.toLocaleTimeString(),
  }));
}

/**
 * Get all metrics trends
 */
export function getAllTrends(hours: number = 24) {
  const history = getMetricsHistory(hours);

  return {
    gasPrice: history.map((s) => ({
      time: s.timestamp.toLocaleTimeString(),
      value: s.gasPrice,
    })),
    blockTime: history.map((s) => ({
      time: s.timestamp.toLocaleTimeString(),
      value: s.blockTime,
    })),
    transactions: history.map((s) => ({
      time: s.timestamp.toLocaleTimeString(),
      value: s.transactionCount,
    })),
  };
}

/**
 * Get statistics for metrics
 */
export function getMetricsStats(hours: number = 24) {
  const history = getMetricsHistory(hours);

  if (history.length === 0) {
    return null;
  }

  const gasPrices = history.map((s) => s.gasPrice);
  const blockTimes = history.map((s) => s.blockTime);
  const transactions = history.map((s) => s.transactionCount);

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const max = (arr: number[]) => Math.max(...arr);
  const min = (arr: number[]) => Math.min(...arr);

  return {
    gasPrice: {
      average: avg(gasPrices),
      max: max(gasPrices),
      min: min(gasPrices),
    },
    blockTime: {
      average: avg(blockTimes),
      max: max(blockTimes),
      min: min(blockTimes),
    },
    transactions: {
      average: avg(transactions),
      max: max(transactions),
      min: min(transactions),
      total: transactions.reduce((a, b) => a + b, 0),
    },
  };
}

/**
 * Clear all history (for testing)
 */
export function clearHistory(): void {
  metricsHistory.length = 0;
}

/**
 * Get history size
 */
export function getHistorySize(): number {
  return metricsHistory.length;
}
