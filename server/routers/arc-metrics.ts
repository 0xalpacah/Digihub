import { router, publicProcedure } from "../_core/trpc";
import {
  getNetworkMetrics,
  getRecentBlocks,
  getGasPrice,
  getNetworkStats,
  getBestBlock,
  getAverageBlockTime,
  isProviderConnected,
} from "../arc-rpc";
import { z } from "zod";

/**
 * Arc Network Metrics Router
 * Provides tRPC procedures for fetching Arc Network data
 */
export const arcMetricsRouter = router({
  /**
   * Get comprehensive network metrics
   */
  getNetworkMetrics: publicProcedure.query(async () => {
    try {
      const metrics = await getNetworkMetrics();
      return {
        success: true,
        data: metrics,
      };
    } catch (error) {
      console.error("Error fetching network metrics:", error);
      return {
        success: false,
        error: "Failed to fetch network metrics",
      };
    }
  }),

  /**
   * Get current best block number
   */
  getBestBlock: publicProcedure.query(async () => {
    try {
      const blockNumber = await getBestBlock();
      return {
        success: true,
        blockNumber,
      };
    } catch (error) {
      console.error("Error fetching best block:", error);
      return {
        success: false,
        error: "Failed to fetch best block",
      };
    }
  }),

  /**
   * Get current gas price
   */
  getGasPrice: publicProcedure.query(async () => {
    try {
      const gasPrice = await getGasPrice();
      return {
        success: true,
        gasPrice,
      };
    } catch (error) {
      console.error("Error fetching gas price:", error);
      return {
        success: false,
        error: "Failed to fetch gas price",
      };
    }
  }),

  /**
   * Get network statistics
   */
  getNetworkStats: publicProcedure.query(async () => {
    try {
      const stats = await getNetworkStats();
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error("Error fetching network stats:", error);
      return {
        success: false,
        error: "Failed to fetch network stats",
      };
    }
  }),

  /**
   * Get recent blocks
   */
  getRecentBlocks: publicProcedure
    .input(
      z.object({
        count: z.number().int().min(1).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      try {
        const blocks = await getRecentBlocks(input.count);
        return {
          success: true,
          blocks,
        };
      } catch (error) {
        console.error("Error fetching recent blocks:", error);
        return {
          success: false,
          error: "Failed to fetch recent blocks",
        };
      }
    }),

  /**
   * Get average block time
   */
  getAverageBlockTime: publicProcedure
    .input(
      z.object({
        blockCount: z.number().int().min(10).max(1000).default(100),
      })
    )
    .query(async ({ input }) => {
      try {
        const avgBlockTime = await getAverageBlockTime(input.blockCount);
        return {
          success: true,
          averageBlockTime: avgBlockTime,
        };
      } catch (error) {
        console.error("Error calculating average block time:", error);
        return {
          success: false,
          error: "Failed to calculate average block time",
        };
      }
    }),

  /**
   * Check if provider is connected
   */
  isConnected: publicProcedure.query(async () => {
    try {
      const connected = await isProviderConnected();
      return {
        success: true,
        connected,
      };
    } catch (error) {
      console.error("Error checking provider connection:", error);
      return {
        success: false,
        connected: false,
        error: "Failed to check provider connection",
      };
    }
  }),
});
