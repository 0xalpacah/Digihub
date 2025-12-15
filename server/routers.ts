import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { arcMetricsRouter } from "./routers/arc-metrics";
import { blogImagesRouter } from "./routers/blog-images";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  arcMetrics: arcMetricsRouter,
  blogImages: blogImagesRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Blog Posts
  blog: router({
    // Get all published posts with pagination
    getPosts: publicProcedure
      .input(z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return await db.getPublishedBlogPosts(input.limit, input.offset);
      }),

    // Get post by slug
    getPostBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await db.getBlogPostBySlug(input.slug);
        if (!post) throw new TRPCError({ code: 'NOT_FOUND' });
        return post;
      }),

    // Get posts by category
    getPostsByCategory: publicProcedure
      .input(z.object({
        categoryId: z.number(),
        limit: z.number().default(10),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return await db.getBlogPostsByCategory(input.categoryId, input.limit, input.offset);
      }),

    // Search posts
    searchPosts: publicProcedure
      .input(z.object({
        query: z.string(),
        limit: z.number().default(10),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return await db.searchBlogPosts(input.query, input.limit, input.offset);
      }),

    // Create post (admin only)
    createPost: adminProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        content: z.string(),
        excerpt: z.string().optional(),
        coverImage: z.string().optional(),
        coverImageAlt: z.string().optional(),
        categoryId: z.number(),
        published: z.boolean().default(false),
        featured: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createBlogPost({
          ...input,
          authorId: ctx.user.id,
        });
      }),

    // Update post (admin only)
    updatePost: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        coverImage: z.string().optional(),
        coverImageAlt: z.string().optional(),
        published: z.boolean().optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        return await db.updateBlogPost(id, updates);
      }),

    // Delete post (admin only)
    deletePost: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteBlogPost(input.id);
      }),
  }),

  // Comments
  comments: router({
    // Get comments for a post
    getComments: publicProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCommentsByPostId(input.postId);
      }),

    // Create comment (protected)
    createComment: protectedProcedure
      .input(z.object({
        postId: z.number(),
        content: z.string(),
        parentCommentId: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createComment({
          ...input,
          authorId: ctx.user.id,
          approved: true,
        });
      }),

    // Delete comment (admin or author only)
    deleteComment: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return await db.deleteComment(input.id);
      }),
  }),

  // Categories
  categories: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllCategories();
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        color: z.string().optional(),
        icon: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createCategory(input);
      }),
  }),

  // Tags
  tags: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllTags();
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await db.createTag(input);
      }),
  }),

  // Creator Projects
  projects: router({
    getFeatured: publicProcedure.query(async () => {
      return await db.getFeaturedCreatorProjects();
    }),

    getAll: publicProcedure.query(async () => {
      return await db.getAllCreatorProjects();
    }),

    create: adminProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        websiteUrl: z.string().optional(),
        githubUrl: z.string().optional(),
        twitterUrl: z.string().optional(),
        creatorName: z.string(),
        featured: z.boolean().default(false),
        order: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        return await db.createCreatorProject(input);
      }),
  }),

  // Network Metrics
  metrics: router({
    getLatest: publicProcedure.query(async () => {
      return await db.getLatestNetworkMetrics();
    }),

    getHistory: publicProcedure
      .input(z.object({ hours: z.number().default(24) }))
      .query(async ({ input }) => {
        return await db.getNetworkMetricsHistory(input.hours);
      }),

    create: adminProcedure
      .input(z.object({
        bestBlock: z.number(),
        uncleCount: z.number(),
        lastBlockTime: z.date().optional(),
        avgBlockTime: z.number().optional(),
        avgNetworkHashrate: z.string().optional(),
        difficulty: z.string().optional(),
        activeNodes: z.number().optional(),
        totalNodes: z.number().optional(),
        gasPrice: z.string().optional(),
        gasLimit: z.string().optional(),
        pageLatency: z.number().optional(),
        uptime: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createNetworkMetrics(input);
      }),
  }),

  // Network Events
  events: router({
    getRecent: publicProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ input }) => {
        return await db.getRecentNetworkEvents(input.limit);
      }),

    create: adminProcedure
      .input(z.object({
        eventType: z.enum(['block', 'transaction', 'contract_deployment', 'token_transfer']),
        blockNumber: z.number().optional(),
        transactionHash: z.string().optional(),
        fromAddress: z.string().optional(),
        toAddress: z.string().optional(),
        value: z.string().optional(),
        gasUsed: z.string().optional(),
        minerAddress: z.string().optional(),
        metadata: z.record(z.string(), z.any()).optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createNetworkEvent(input);
      }),
  }),

  // User Alerts
  alerts: router({
    getAlerts: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserAlerts(ctx.user.id);
    }),

    create: adminProcedure
      .input(z.object({
        userId: z.number(),
        title: z.string(),
        content: z.string().optional(),
        alertType: z.enum(['network_event', 'new_post', 'creator_project', 'protocol_update']),
      }))
      .mutation(async ({ input }) => {
        return await db.createUserAlert(input);
      }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.markAlertAsRead(input.id);
      }),
  }),

  // Arc Resources
  resources: router({
    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await db.getArcResourcesByCategory(input.category);
      }),

    getAll: publicProcedure.query(async () => {
      return await db.getAllArcResources();
    }),

    create: adminProcedure
      .input(z.object({
        title: z.string(),
        category: z.enum(['node_provider', 'data_indexer', 'block_explorer', 'wallet', 'dev_tool']),
        description: z.string().optional(),
        url: z.string(),
        logoUrl: z.string().optional(),
        featured: z.boolean().default(false),
        order: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        return await db.createArcResource(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
