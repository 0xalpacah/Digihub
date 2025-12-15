import { router, publicProcedure } from "../_core/trpc";
import {
  getRegistryStats,
  getContributors,
  getFeaturedProjects,
  getLatestSnapshot,
  getUSDCTotalSupply,
  getOnChainDashboardData,
  isRegistryDeployed,
} from "../arc-registry";

/**
 * On-Chain Data Router
 * Provides tRPC procedures for reading on-chain data from ArcNetworkRegistry
 */
export const onChainDataRouter = router({
  /**
   * Get comprehensive on-chain dashboard data
   */
  getDashboardData: publicProcedure.query(async () => {
    try {
      const data = await getOnChainDashboardData();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Error fetching on-chain dashboard data:", error);
      return {
        success: false,
        error: "Failed to fetch on-chain data",
      };
    }
  }),

  /**
   * Get registry statistics
   */
  getStats: publicProcedure.query(async () => {
    try {
      const stats = await getRegistryStats();
      return {
        success: true,
        stats,
      };
    } catch (error) {
      console.error("Error fetching registry stats:", error);
      return {
        success: false,
        error: "Failed to fetch registry stats",
      };
    }
  }),

  /**
   * Get all contributors
   */
  getContributors: publicProcedure.query(async () => {
    try {
      const contributors = await getContributors();
      return {
        success: true,
        contributors,
      };
    } catch (error) {
      console.error("Error fetching contributors:", error);
      return {
        success: false,
        error: "Failed to fetch contributors",
      };
    }
  }),

  /**
   * Get featured projects
   */
  getFeaturedProjects: publicProcedure.query(async () => {
    try {
      const projects = await getFeaturedProjects();
      return {
        success: true,
        projects,
      };
    } catch (error) {
      console.error("Error fetching featured projects:", error);
      return {
        success: false,
        error: "Failed to fetch featured projects",
      };
    }
  }),

  /**
   * Get latest network snapshot
   */
  getLatestSnapshot: publicProcedure.query(async () => {
    try {
      const snapshot = await getLatestSnapshot();
      return {
        success: true,
        snapshot,
      };
    } catch (error) {
      console.error("Error fetching latest snapshot:", error);
      return {
        success: false,
        error: "Failed to fetch latest snapshot",
      };
    }
  }),

  /**
   * Get USDC metrics
   */
  getUSDCMetrics: publicProcedure.query(async () => {
    try {
      const totalSupply = await getUSDCTotalSupply();
      return {
        success: true,
        totalSupply,
      };
    } catch (error) {
      console.error("Error fetching USDC metrics:", error);
      return {
        success: false,
        error: "Failed to fetch USDC metrics",
      };
    }
  }),

  /**
   * Check if registry is deployed
   */
  isDeployed: publicProcedure.query(async () => {
    try {
      const deployed = await isRegistryDeployed();
      return {
        success: true,
        deployed,
      };
    } catch (error) {
      console.error("Error checking registry deployment:", error);
      return {
        success: false,
        deployed: false,
      };
    }
  }),
});
