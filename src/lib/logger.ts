/**
 * Secure logger utility - prevents sensitive data exposure in production
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

interface LogContext {
  userId?: string | number;
  action?: string;
  resource?: string;
  [key: string]: any;
}

export const logger = {
  /**
   * Log errors - safe for production
   * Errors are logged internally, generic message sent to client
   */
  error: (message: string, context?: LogContext, error?: unknown) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, context, error);
    } else {
      // In production, log minimal info to secure logging service
      const timestamp = new Date().toISOString();
      const safeContext = {
        userId: context?.userId,
        action: context?.action,
        resource: context?.resource,
        // Don't log sensitive data
      };
      console.error(`[${timestamp}] ${message}`, safeContext);
    }
  },

  /**
   * Log info - safe for production
   */
  info: (message: string, context?: LogContext) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, context);
    } else {
      const timestamp = new Date().toISOString();
      const safeContext = {
        userId: context?.userId,
        action: context?.action,
      };
      console.log(`[${timestamp}] ${message}`, safeContext);
    }
  },

  /**
   * Log debug - only in development
   */
  debug: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, data);
    }
  },

  /**
   * Log security events
   */
  security: (event: string, context: LogContext) => {
    const timestamp = new Date().toISOString();
    console.warn(`[SECURITY] [${timestamp}] ${event}`, {
      userId: context.userId,
      action: context.action,
      resource: context.resource,
    });
  },
};

export default logger;
