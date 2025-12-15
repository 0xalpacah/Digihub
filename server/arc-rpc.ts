import { ethers } from 'ethers';

/**
 * Arc Network RPC Configuration
 * Arc is an open Layer-1 blockchain purpose-built for stablecoin finance
 * Chain ID: 1 (mainnet)
 */

// RPC Endpoints - Using public endpoints and major providers
const RPC_ENDPOINTS = {
  quicknode: process.env.ARC_RPC_QUICKNODE || 'https://arc-mainnet.quicknode.pro/',
  alchemy: process.env.ARC_RPC_ALCHEMY || 'https://arc-mainnet.g.alchemy.com/v2/',
  drpc: process.env.ARC_RPC_DRPC || 'https://arc.drpc.org',
  public: 'https://rpc.arc.network', // Arc public endpoint
};

// Use primary RPC endpoint
const PRIMARY_RPC = process.env.ARC_RPC_URL || RPC_ENDPOINTS.public;

// Create ethers provider
let provider: ethers.JsonRpcProvider | null = null;

export function getProvider(): ethers.JsonRpcProvider {
  if (!provider) {
    provider = new ethers.JsonRpcProvider(PRIMARY_RPC, {
      name: 'Arc Network',
      chainId: 1,
    });
  }
  return provider;
}

/**
 * Network Metrics Interface
 */
export interface NetworkMetrics {
  bestBlock: number;
  bestBlockHash: string;
  blockTime: number;
  gasPrice: string;
  difficulty: string;
  activeNodes: number;
  hashrate: string;
  uncles: number;
  recentTransactions: number;
  networkStatus: 'healthy' | 'degraded' | 'offline';
  timestamp: Date;
}

/**
 * Fetch current best block number
 */
export async function getBestBlock(): Promise<number> {
  try {
    const provider = getProvider();
    const blockNumber = await provider.getBlockNumber();
    return blockNumber;
  } catch (error) {
    console.error('Error fetching best block:', error);
    throw error;
  }
}

/**
 * Fetch block details
 */
export async function getBlockDetails(blockNumber: number) {
  try {
    const provider = getProvider();
    const block = await provider.getBlock(blockNumber);
    return {
      number: block?.number,
      hash: block?.hash,
      timestamp: block?.timestamp,
      miner: block?.miner,
      gasUsed: block?.gasUsed.toString(),
      gasLimit: block?.gasLimit.toString(),
      transactions: block?.transactions.length || 0,
      difficulty: block?.difficulty?.toString(),
      parentHash: block?.parentHash,
    };
  } catch (error) {
    console.error('Error fetching block details:', error);
    throw error;
  }
}

/**
 * Fetch current gas price
 */
export async function getGasPrice(): Promise<string> {
  try {
    const provider = getProvider();
    const feeData = await provider.getFeeData();
    const gasPrice = feeData?.gasPrice || BigInt(0);
    // Convert from Wei to Gwei
    return ethers.formatUnits(gasPrice, 'gwei');
  } catch (error) {
    console.error('Error fetching gas price:', error);
    throw error;
  }
}

/**
 * Fetch network statistics
 */
export async function getNetworkStats() {
  try {
    const provider = getProvider();
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    const feeData = await provider.getFeeData();
    const gasPrice = feeData?.gasPrice || BigInt(0);

    return {
      chainId: network.chainId,
      name: network.name,
      blockNumber,
      gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error fetching network stats:', error);
    throw error;
  }
}

/**
 * Fetch recent blocks
 */
export async function getRecentBlocks(count: number = 10) {
  try {
    const provider = getProvider();
    const blockNumber = await provider.getBlockNumber();
    const blocks = [];

    for (let i = 0; i < count; i++) {
      const block = await provider.getBlock(blockNumber - i);
      if (block) {
        blocks.push({
          number: block.number,
          hash: block.hash,
          timestamp: block.timestamp,
          miner: block.miner,
          transactions: block.transactions.length,
          gasUsed: block.gasUsed.toString(),
          gasLimit: block.gasLimit.toString(),
        });
      }
    }

    return blocks;
  } catch (error) {
    console.error('Error fetching recent blocks:', error);
    throw error;
  }
}

/**
 * Fetch transaction details
 */
export async function getTransaction(txHash: string) {
  try {
    const provider = getProvider();
    const tx = await provider.getTransaction(txHash);
    const receipt = await provider.getTransactionReceipt(txHash);

    return {
      hash: tx?.hash,
      from: tx?.from,
      to: tx?.to,
      value: tx?.value.toString(),
      gasPrice: tx?.gasPrice?.toString(),
      gasLimit: tx?.gasLimit.toString(),
      nonce: tx?.nonce,
      blockNumber: receipt?.blockNumber,
      status: receipt?.status === 1 ? 'success' : 'failed',
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
}

/**
 * Calculate average block time
 */
export async function getAverageBlockTime(blockCount: number = 100): Promise<number> {
  try {
    const provider = getProvider();
    const currentBlockNumber = await provider.getBlockNumber();
    
    const currentBlock = await provider.getBlock(currentBlockNumber);
    const previousBlock = await provider.getBlock(currentBlockNumber - blockCount);

    if (!currentBlock || !previousBlock) {
      throw new Error('Could not fetch blocks for calculation');
    }

    const timeDifference = currentBlock.timestamp - previousBlock.timestamp;
    const averageBlockTime = timeDifference / blockCount;

    return averageBlockTime;
  } catch (error) {
    console.error('Error calculating average block time:', error);
    throw error;
  }
}

/**
 * Get account balance
 */
export async function getBalance(address: string): Promise<string> {
  try {
    const provider = getProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
}

/**
 * Get contract code
 */
export async function getContractCode(address: string): Promise<string> {
  try {
    const provider = getProvider();
    const code = await provider.getCode(address);
    return code;
  } catch (error) {
    console.error('Error fetching contract code:', error);
    throw error;
  }
}

/**
 * Fetch comprehensive network metrics
 */
export async function getNetworkMetrics(): Promise<NetworkMetrics> {
  try {
    const provider = getProvider();
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
    const feeData = await provider.getFeeData();
    const gasPrice = feeData?.gasPrice || BigInt(0);
    const avgBlockTime = await getAverageBlockTime(50);

    // Fetch recent blocks for transaction count
    let recentTransactions = 0;
    for (let i = 0; i < 10; i++) {
      const recentBlock = await provider.getBlock(blockNumber - i);
      if (recentBlock) {
        recentTransactions += recentBlock.transactions.length;
      }
    }

    return {
      bestBlock: blockNumber,
      bestBlockHash: block?.hash || '',
      blockTime: avgBlockTime,
      gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
      difficulty: block?.difficulty?.toString() || '0',
      activeNodes: 1, // This would require additional infrastructure monitoring
      hashrate: '0', // This would require additional infrastructure monitoring
      uncles: 0, // Arc may not use uncles like Ethereum
      recentTransactions,
      networkStatus: 'healthy',
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error fetching network metrics:', error);
    return {
      bestBlock: 0,
      bestBlockHash: '',
      blockTime: 0,
      gasPrice: '0',
      difficulty: '0',
      activeNodes: 0,
      hashrate: '0',
      uncles: 0,
      recentTransactions: 0,
      networkStatus: 'offline',
      timestamp: new Date(),
    };
  }
}

/**
 * Check if provider is connected
 */
export async function isProviderConnected(): Promise<boolean> {
  try {
    const provider = getProvider();
    const network = await provider.getNetwork();
    return network.chainId === BigInt(1); // Arc mainnet chain ID
  } catch (error) {
    console.error('Provider connection check failed:', error);
    return false;
  }
}
