import { drizzle } from 'drizzle-orm/mysql2'
import { mysqlTable, int, varchar, text, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core'
import { eq } from 'drizzle-orm'

/**
 * Tabela de audit logs
 */
export const auditLogs = mysqlTable('audit_logs', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('userId').notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  resource: varchar('resource', { length: 100 }).notNull(),
  resourceId: varchar('resourceId', { length: 255 }),
  status: mysqlEnum('status', ['success', 'failure']).default('success').notNull(),
  ipAddress: varchar('ipAddress', { length: 45 }),
  userAgent: text('userAgent'),
  details: text('details'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export type AuditLog = typeof auditLogs.$inferSelect
export type InsertAuditLog = typeof auditLogs.$inferInsert

/**
 * Registrar ação de auditoria
 */
export async function logAuditAction(
  db: ReturnType<typeof drizzle>,
  {
    userId,
    action,
    resource,
    resourceId,
    status = 'success',
    ipAddress,
    userAgent,
    details,
  }: Omit<InsertAuditLog, 'createdAt'>
) {
  try {
    await db.insert(auditLogs).values({
      userId,
      action,
      resource,
      resourceId,
      status,
      ipAddress,
      userAgent,
      details,
    })
  } catch (error) {
    console.error('Error logging audit action:', error)
  }
}

/**
 * Obter audit logs de um usuário
 */
export async function getUserAuditLogs(
  db: ReturnType<typeof drizzle>,
  userId: number,
  limit: number = 50
) {
  try {
    return await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, userId))
      .orderBy((t) => t.createdAt)
      .limit(limit)
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return []
  }
}

/**
 * Obter audit logs por ação
 */
export async function getAuditLogsByAction(
  db: ReturnType<typeof drizzle>,
  action: string,
  limit: number = 50
) {
  try {
    return await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.action, action))
      .orderBy((t) => t.createdAt)
      .limit(limit)
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return []
  }
}

/**
 * Tipos de ações auditáveis
 */
export enum AuditAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  FAILED_LOGIN = 'FAILED_LOGIN',
  CREATE_POST = 'CREATE_POST',
  UPDATE_POST = 'UPDATE_POST',
  DELETE_POST = 'DELETE_POST',
  CREATE_COMMENT = 'CREATE_COMMENT',
  DELETE_COMMENT = 'DELETE_COMMENT',
  ENABLE_2FA = 'ENABLE_2FA',
  DISABLE_2FA = 'DISABLE_2FA',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  CHANGE_EMAIL = 'CHANGE_EMAIL',
  REGISTER_PROJECT = 'REGISTER_PROJECT',
  DONATE = 'DONATE',
  ADMIN_ACTION = 'ADMIN_ACTION',
}
