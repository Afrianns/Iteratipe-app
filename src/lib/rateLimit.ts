/**
 * Rate limiting utility for API security
 * Simple in-memory implementation for single-instance deployments
 * For distributed systems, upgrade to @upstash/ratelimit or similar
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limit tracking
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check rate limit for a given key
 * @param key - Unique identifier (e.g., user ID, IP address)
 * @param limit - Maximum requests allowed
 * @param windowSeconds - Time window in seconds
 * @returns RateLimitResult with success status
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // New entry or expired window
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowSeconds * 1000,
    });

    return {
      success: true,
      remaining: limit - 1,
      resetTime: now + windowSeconds * 1000,
    };
  }

  // Check if limit exceeded
  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment counter
  entry.count++;
  return {
    success: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get IP address from request
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

/**
 * Common rate limit configurations
 */
export const RATE_LIMITS = {
  // Image upload: 10 per hour
  IMAGE_UPLOAD: { limit: 10, windowSeconds: 3600 },
  // Image delete: 20 per hour
  IMAGE_DELETE: { limit: 20, windowSeconds: 3600 },
  // Comment creation: 30 per hour
  COMMENT_CREATE: { limit: 30, windowSeconds: 3600 },
  // Project creation: 5 per hour
  PROJECT_CREATE: { limit: 5, windowSeconds: 3600 },
  // Profile access: 100 per minute
  PROFILE_VIEW: { limit: 100, windowSeconds: 60 },
};
