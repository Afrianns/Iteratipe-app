import Redis from 'ioredis';

const globalForRedis = global as unknown as { redis: Redis | undefined };

// Vercel Storage Upstash integration automatically creates process.env.REDIS_URL
const redisUrl = process.env.REDISKV_REDIS_URL;

// export const redis = new Redis()
export const redis =
  globalForRedis.redis ||
  new Redis(redisUrl || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    // Crucial for Upstash serverless stability:
    family: 0,
    connectTimeout: 10000,
    lazyConnect: true
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;