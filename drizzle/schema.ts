import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "creator"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Blog categories
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  color: varchar("color", { length: 7 }), // hex color for UI
  icon: varchar("icon", { length: 50 }), // lucide icon name
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Blog tags
 */
export const tags = mysqlTable("tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;

/**
 * Blog posts
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(), // markdown content
  excerpt: text("excerpt"),
  coverImage: varchar("coverImage", { length: 500 }), // S3 URL
  coverImageAlt: varchar("coverImageAlt", { length: 255 }),
  categoryId: int("categoryId").notNull(),
  authorId: int("authorId").notNull(),
  published: boolean("published").default(false).notNull(),
  featured: boolean("featured").default(false).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Post-tag junction table
 */
export const postTags = mysqlTable("post_tags", {
  postId: int("postId").notNull(),
  tagId: int("tagId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PostTag = typeof postTags.$inferSelect;
export type InsertPostTag = typeof postTags.$inferInsert;

/**
 * Comments on blog posts
 */
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  authorId: int("authorId").notNull(),
  content: text("content").notNull(),
  parentCommentId: int("parentCommentId"), // for nested replies
  approved: boolean("approved").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

/**
 * Creator projects showcase
 */
export const creatorProjects = mysqlTable("creator_projects", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  websiteUrl: varchar("websiteUrl", { length: 500 }),
  githubUrl: varchar("githubUrl", { length: 500 }),
  twitterUrl: varchar("twitterUrl", { length: 500 }),
  creatorName: varchar("creatorName", { length: 255 }).notNull(),
  featured: boolean("featured").default(false).notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CreatorProject = typeof creatorProjects.$inferSelect;
export type InsertCreatorProject = typeof creatorProjects.$inferInsert;

/**
 * Arc network metrics snapshots
 */
export const networkMetrics = mysqlTable("network_metrics", {
  id: int("id").autoincrement().primaryKey(),
  bestBlock: int("bestBlock").notNull(),
  uncleCount: int("uncleCount").notNull(),
  lastBlockTime: timestamp("lastBlockTime"),
  avgBlockTime: int("avgBlockTime"), // in milliseconds
  avgNetworkHashrate: varchar("avgNetworkHashrate", { length: 100 }),
  difficulty: varchar("difficulty", { length: 100 }),
  activeNodes: int("activeNodes"),
  totalNodes: int("totalNodes"),
  gasPrice: varchar("gasPrice", { length: 100 }),
  gasLimit: varchar("gasLimit", { length: 100 }),
  pageLatency: int("pageLatency"), // in milliseconds
  uptime: decimal("uptime", { precision: 5, scale: 2 }), // percentage
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type NetworkMetrics = typeof networkMetrics.$inferSelect;
export type InsertNetworkMetrics = typeof networkMetrics.$inferInsert;

/**
 * Network events (blocks, transactions, etc)
 */
export const networkEvents = mysqlTable("network_events", {
  id: int("id").autoincrement().primaryKey(),
  eventType: mysqlEnum("eventType", ["block", "transaction", "contract_deployment", "token_transfer"]).notNull(),
  blockNumber: int("blockNumber"),
  transactionHash: varchar("transactionHash", { length: 255 }),
  fromAddress: varchar("fromAddress", { length: 255 }),
  toAddress: varchar("toAddress", { length: 255 }),
  value: varchar("value", { length: 100 }),
  gasUsed: varchar("gasUsed", { length: 100 }),
  minerAddress: varchar("minerAddress", { length: 255 }),
  metadata: json("metadata"), // additional data as JSON
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type NetworkEvent = typeof networkEvents.$inferSelect;
export type InsertNetworkEvent = typeof networkEvents.$inferInsert;

/**
 * User alerts/notifications
 */
export const userAlerts = mysqlTable("user_alerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  alertType: mysqlEnum("alertType", ["network_event", "new_post", "creator_project", "protocol_update"]).notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserAlert = typeof userAlerts.$inferSelect;
export type InsertUserAlert = typeof userAlerts.$inferInsert;

/**
 * Arc network resources/tools documentation
 */
export const arcResources = mysqlTable("arc_resources", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["node_provider", "data_indexer", "block_explorer", "wallet", "dev_tool"]).notNull(),
  description: text("description"),
  url: varchar("url", { length: 500 }).notNull(),
  logoUrl: varchar("logoUrl", { length: 500 }),
  featured: boolean("featured").default(false).notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ArcResource = typeof arcResources.$inferSelect;
export type InsertArcResource = typeof arcResources.$inferInsert;
