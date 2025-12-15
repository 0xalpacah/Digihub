import { ethers } from 'ethers';
import { getProvider } from './arc-rpc';
import ABI from '../contracts/ArcNetworkRegistry.abi.json';

/**
 * Arc Network Registry Integration
 * Reads on-chain data from ArcNetworkRegistry contract
 */

// Contract address - will be set after deployment
// For now, using a placeholder. Update after deploying to Arc Network
const REGISTRY_ADDRESS = process.env.ARC_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000';

// USDC on Arc Network
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b3EA6957D0f';

const USDC_ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function totalSupply() external view returns (uint256)',
  'function decimals() external view returns (uint8)',
];

/**
 * Get contract instance
 */
export function getRegistryContract(): ethers.Contract {
  const provider = getProvider();
  return new ethers.Contract(REGISTRY_ADDRESS, ABI, provider);
}

/**
 * Get USDC contract instance
 */
export function getUSDCContract(): ethers.Contract {
  const provider = getProvider();
  return new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);
}

/**
 * Get registry statistics
 */
export async function getRegistryStats() {
  try {
    if (REGISTRY_ADDRESS === '0x0000000000000000000000000000000000000000') {
      console.warn('Registry contract not deployed yet');
      return null;
    }

    const contract = getRegistryContract();
    const [contributorCount, projectCount, snapshotCount, usdcBalance] = await contract.getStats();

    return {
      contributorCount: Number(contributorCount),
      projectCount: Number(projectCount),
      snapshotCount: Number(snapshotCount),
      usdcBalance: ethers.formatUnits(usdcBalance, 6), // USDC has 6 decimals
    };
  } catch (error) {
    console.error('Error fetching registry stats:', error);
    return null;
  }
}

/**
 * Get all contributors
 */
export async function getContributors() {
  try {
    if (REGISTRY_ADDRESS === '0x0000000000000000000000000000000000000000') {
      return [];
    }

    const contract = getRegistryContract();
    const contributors = await contract.getContributors();

    return contributors.map((c: any) => ({
      wallet: c.wallet,
      name: c.name,
      role: c.role,
      joinedAt: new Date(Number(c.joinedAt) * 1000),
      active: c.active,
    }));
  } catch (error) {
    console.error('Error fetching contributors:', error);
    return [];
  }
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects() {
  try {
    if (REGISTRY_ADDRESS === '0x0000000000000000000000000000000000000000') {
      return [];
    }

    const contract = getRegistryContract();
    const projects = await contract.getFeaturedProjects();

    return projects.map((p: any) => ({
      name: p.name,
      description: p.description,
      creator: p.creator,
      url: p.url,
      createdAt: new Date(Number(p.createdAt) * 1000),
      featured: p.featured,
    }));
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

/**
 * Get latest network snapshot
 */
export async function getLatestSnapshot() {
  try {
    if (REGISTRY_ADDRESS === '0x0000000000000000000000000000000000000000') {
      return null;
    }

    const contract = getRegistryContract();
    const snapshot = await contract.getLatestSnapshot();

    return {
      timestamp: new Date(Number(snapshot.timestamp) * 1000),
      blockNumber: Number(snapshot.blockNumber),
      gasPrice: ethers.formatUnits(snapshot.gasPrice, 'gwei'),
      activeNodes: Number(snapshot.activeNodes),
      networkStatus: snapshot.networkStatus,
    };
  } catch (error) {
    console.error('Error fetching latest snapshot:', error);
    return null;
  }
}

/**
 * Get USDC balance of registry
 */
export async function getRegistryUSDCBalance() {
  try {
    const usdcContract = getUSDCContract();
    const balance = await usdcContract.balanceOf(REGISTRY_ADDRESS);
    return ethers.formatUnits(balance, 6);
  } catch (error) {
    console.error('Error fetching USDC balance:', error);
    return '0';
  }
}

/**
 * Get USDC total supply
 */
export async function getUSDCTotalSupply() {
  try {
    const usdcContract = getUSDCContract();
    const supply = await usdcContract.totalSupply();
    return ethers.formatUnits(supply, 6);
  } catch (error) {
    console.error('Error fetching USDC total supply:', error);
    return '0';
  }
}

/**
 * Get USDC holder count (approximation)
 * Note: This is a simplified version. For accurate holder count, use a data indexer
 */
export async function getUSDCHolderCount(): Promise<number> {
  // This would require querying a data indexer or block explorer API
  // For now, returning a placeholder
  return 0;
}

/**
 * Get comprehensive on-chain dashboard data
 */
export async function getOnChainDashboardData() {
  try {
    const [stats, contributors, projects, snapshot, usdcSupply] = await Promise.all([
      getRegistryStats(),
      getContributors(),
      getFeaturedProjects(),
      getLatestSnapshot(),
      getUSDCTotalSupply(),
    ]);

    return {
      registry: stats,
      contributors,
      projects,
      latestSnapshot: snapshot,
      usdcMetrics: {
        totalSupply: usdcSupply,
        registryBalance: stats?.usdcBalance || '0',
      },
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error fetching on-chain dashboard data:', error);
    return null;
  }
}

/**
 * Check if registry contract is deployed
 */
export async function isRegistryDeployed(): Promise<boolean> {
  try {
    if (REGISTRY_ADDRESS === '0x0000000000000000000000000000000000000000') {
      return false;
    }

    const provider = getProvider();
    const code = await provider.getCode(REGISTRY_ADDRESS);
    return code !== '0x';
  } catch (error) {
    console.error('Error checking registry deployment:', error);
    return false;
  }
}
