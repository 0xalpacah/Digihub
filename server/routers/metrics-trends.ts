import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  getGasPriceTrend,
  getBlockTimeTrend,
  getTransactionVolumeTrend,
  getAllTrends,
  getMetricsStats,
  addMetricsSnapshot,
} from "../metrics-history";
import { getNetworkMetrics } from "../arc-rpc";

/**
 * Metrics Trends Router
 * Provides tRPC procedures for metrics trend data and analysis
 */
export const metricsTrendsRouter = router({
  /**
   * Get gas price trend data
   */
  getGasPriceTrend: publicProcedure
    .input(
      z.object({
        hours: z.number().int().min(1).max(168).default(24),
      })
    )
    .query(async ({ input }) => {
      try {
        const trend = getGasPriceTrend(input.hours);
        return {
          success: true,
          trend,
        };
      } catch (error) {
        console.error("Error fetching gas price trend:", error);
        return {
          success: false,
          error: "Failed to fetch gas price trend",
        };
      }
    }),

  /**
   * Get block time trend data
   */
  getBlockTimeTrend: publicProcedure
    .input(
      z.object({
        hours: z.number().int().min(1).max(168).default(24),
      })
    )
    .query(async ({ input }) => {
      try {
        const trend = getBlockTimeTrend(input.hours);
        return {
          success: true,
          trend,
        };
      } catch (error) {
        console.error("Error fetching block time trend:", error);
        return {
          success: false,
          error: "Failed to fetch block time trend",
        };
      }
    }),

  /**
   * Get transaction volume trend data
   */
  getTransactionVolumeTrend: publicProcedure
    .input(
      z.object({
        hours: z.number().int().min(1).max(168).default(24),
      })
    )
    .query(async ({ input }) => {
      try {
        const trend = getTransactionVolumeTrend(input.hours);
        return {
          success: true,
          trend,
        };
      } catch (error) {
        console.error("Error fetching transaction volume trend:", error);
        return {
          success: false,
          error: "Failed to fetch transaction volume trend",
        };
      }
    }),

  /**
   * Get all metrics trends
   */
  getAllTrends: publicProcedure
    .input(
      z.object({
        hours: z.number().int().min(1).max(168).default(24),
      })
    )
    .query(async ({ input }) => {
      try {
        const trends = getAllTrends(input.hours);
        return {
          success: true,
          trends,
        };
      } catch (error) {
        console.error("Error fetching all trends:", error);
        return {
          success: false,
          error: "Failed to fetch trends",
        };
      }
    }),

  /**
   * Get metrics statistics
   */
  getMetricsStats: publicProcedure
    .input(
      z.object({
        hours: z.number().int().min(1).max(168).default(24),
      })
    )
    .query(async ({ input }) => {
      try {
        const stats = getMetricsStats(input.hours);
        return {
          success: true,
          stats,
        };
      } catch (error) {
        console.error("Error fetching metrics stats:", error);
        return {
          success: false,
          error: "Failed to fetch metrics stats",
        };
      }
    }),

  /**
   * Record current metrics snapshot
   */
  recordSnapshot: publicProcedure.mutation(async () => {
    try {
      const metrics = await getNetworkMetrics();

      if (metrics) {
        addMetricsSnapshot({
          timestamp: new Date(),
          blockNumber: metrics.bestBlock,
          gasPrice: parseFloat(metrics.gasPrice),
          blockTime: metrics.blockTime,
          transactionCount: metrics.recentTransactions,
        });
      }

      return {
        success: true,
        message: "Snapshot recorded",
      };
    } catch (error) {
      console.error("Error recording snapshot:", error);
      return {
        success: false,
        error: "Failed to record snapshot",
      };
    }
  }),
});
