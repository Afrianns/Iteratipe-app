/**
 * Audit logging utility for tracking sensitive operations
 * Provides accountability and helps detect unauthorized access
 */

import { logger } from './logger';

export interface AuditLogEntry {
  action: string;
  userId?: string | number;
  resourceType: string;
  resourceId: string | number;
  status: 'success' | 'failure';
  details?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
}

// In-memory audit log (for production, integrate with a persistent store)
const auditLogs: AuditLogEntry[] = [];

// Keep only last 1000 logs in memory
const MAX_LOGS = 1000;

/**
 * Log an audit event
 * Should be called for sensitive operations like:
 * - Project creation/modification/deletion
 * - User permission changes
 * - Comment moderation
 * - Admin actions
 */
export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    // Log to console for visibility
    logger.security(`${entry.action} on ${entry.resourceType}`, {
      userId: entry.userId,
      action: entry.action,
      resource: `${entry.resourceType}:${entry.resourceId}`,
    });

    // Store in memory (in production, store in database)
    auditLogs.push(entry);

    // Keep only recent logs
    if (auditLogs.length > MAX_LOGS) {
      auditLogs.shift();
    }

    // TODO: In production, persist to database:
    // await prisma.auditLogs.create({
    //   data: {
    //     action: entry.action,
    //     user_id: entry.userId,
    //     resource_type: entry.resourceType,
    //     resource_id: entry.resourceId,
    //     status: entry.status,
    //     details: entry.details ? JSON.stringify(entry.details) : null,
    //     ip_address: entry.ipAddress,
    //   }
    // });
  } catch (error) {
    logger.error('Failed to log audit entry', undefined, error);
  }
}

/**
 * Get audit logs (limited to recent entries)
 * In production, implement proper pagination and querying
 */
export function getAuditLogs(limit: number = 100): AuditLogEntry[] {
  return auditLogs.slice(-limit);
}

/**
 * Get audit logs for a specific user
 */
export function getAuditLogsByUser(userId: string | number, limit: number = 50): AuditLogEntry[] {
  return auditLogs
    .filter((log) => log.userId === userId)
    .slice(-limit);
}

/**
 * Get audit logs for a specific resource
 */
export function getAuditLogsByResource(
  resourceType: string,
  resourceId: string | number,
  limit: number = 50
): AuditLogEntry[] {
  return auditLogs
    .filter(
      (log) => log.resourceType === resourceType && log.resourceId === resourceId
    )
    .slice(-limit);
}

/**
 * Clear audit logs (use with caution!)
 */
export function clearAuditLogs(): void {
  if (process.env.NODE_ENV !== 'production') {
    auditLogs.length = 0;
  } else {
    logger.error('Attempted to clear audit logs in production', undefined);
  }
}
