import { eq, desc, and, like, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  blogPosts, BlogPost, InsertBlogPost,
  categories, Category, InsertCategory,
  tags, Tag, InsertTag,
  postTags, PostTag,
  comments, Comment, InsertComment,
  creatorProjects, CreatorProject, InsertCreatorProject,
  networkMetrics, NetworkMetrics, InsertNetworkMetrics,
  networkEvents, NetworkEvent, InsertNetworkEvent,
  userAlerts, UserAlert, InsertUserAlert,
  arcResources, ArcResource, InsertArcResource
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Blog Posts
export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(blogPosts).values(post);
  return result;
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPublishedBlogPosts(limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function getBlogPostsByCategory(categoryId: number, limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.categoryId, categoryId), eq(blogPosts.published, true)))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function searchBlogPosts(query: string, limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(blogPosts)
    .where(and(
      eq(blogPosts.published, true),
      like(blogPosts.title, `%${query}%`)
    ))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function updateBlogPost(id: number, updates: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(blogPosts).set(updates).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// Categories
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(categories).orderBy(categories.name);
}

export async function createCategory(category: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(categories).values(category);
}

// Tags
export async function getAllTags() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(tags).orderBy(tags.name);
}

export async function createTag(tag: InsertTag) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(tags).values(tag);
}

// Comments
export async function getCommentsByPostId(postId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(comments)
    .where(and(eq(comments.postId, postId), eq(comments.approved, true)))
    .orderBy(desc(comments.createdAt));
}

export async function createComment(comment: InsertComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(comments).values(comment);
}

export async function deleteComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(comments).where(eq(comments.id, id));
}

// Creator Projects
export async function getFeaturedCreatorProjects(limit = 6) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(creatorProjects)
    .where(eq(creatorProjects.featured, true))
    .orderBy(creatorProjects.order)
    .limit(limit);
}

export async function getAllCreatorProjects() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(creatorProjects)
    .orderBy(creatorProjects.order);
}

export async function createCreatorProject(project: InsertCreatorProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(creatorProjects).values(project);
}

// Network Metrics
export async function getLatestNetworkMetrics() {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(networkMetrics)
    .orderBy(desc(networkMetrics.timestamp))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getNetworkMetricsHistory(hours = 24) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(networkMetrics)
    .orderBy(desc(networkMetrics.timestamp))
    .limit(1000);
}

export async function createNetworkMetrics(metrics: InsertNetworkMetrics) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(networkMetrics).values(metrics);
}

// Network Events
export async function getRecentNetworkEvents(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(networkEvents)
    .orderBy(desc(networkEvents.timestamp))
    .limit(limit);
}

export async function createNetworkEvent(event: InsertNetworkEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(networkEvents).values(event);
}

// User Alerts
export async function getUserAlerts(userId: number, unreadOnly = false) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(userAlerts)
    .where(eq(userAlerts.userId, userId))
    .orderBy(desc(userAlerts.createdAt));
}

export async function createUserAlert(alert: InsertUserAlert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(userAlerts).values(alert);
}

export async function markAlertAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(userAlerts).set({ read: true }).where(eq(userAlerts.id, id));
}

// Arc Resources
export async function getArcResourcesByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(arcResources)
    .where(eq(arcResources.category, category as any))
    .orderBy(arcResources.order);
}

export async function getAllArcResources() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(arcResources)
    .orderBy(arcResources.category, arcResources.order);
}

export async function createArcResource(resource: InsertArcResource) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(arcResources).values(resource);
}
