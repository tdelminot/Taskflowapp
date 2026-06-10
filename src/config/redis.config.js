const redis = require('redis');

let redisClient = null;

async function initRedis() {
    try {
        redisClient = redis.createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        console.warn('Redis max reconnection attempts reached');
                        return new Error('Redis connection failed');
                    }
                    return Math.min(retries * 100, 3000);
                }
            }
        });

        redisClient.on('error', (err) => {
            console.warn('Redis connection error:', err.message);
            // On ne fait pas planter l'app, on log juste
        });

        redisClient.on('connect', () => {
            console.log('✅ Redis connected');
        });

        await redisClient.connect();
        return redisClient;
    } catch (error) {
        console.warn('Redis not available, running without cache');
        return null;
    }
}

// Cache helper functions
const CacheService = {
    // Get cached data
    async get(key) {
        if (!redisClient) return null;
        try {
            const data = await redisClient.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    },

    // Set cached data with TTL (seconds)
    async set(key, data, ttl = 300) {
        if (!redisClient) return false;
        try {
            await redisClient.setEx(key, ttl, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Cache set error:', error);
            return false;
        }
    },

    // Delete cached data
    async del(key) {
        if (!redisClient) return false;
        try {
            await redisClient.del(key);
            return true;
        } catch (error) {
            console.error('Cache delete error:', error);
            return false;
        }
    },

    // Delete multiple keys by pattern
    async delPattern(pattern) {
        if (!redisClient) return false;
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
            return true;
        } catch (error) {
            console.error('Cache delete pattern error:', error);
            return false;
        }
    },

    // Increment a counter
    async incr(key, ttl = null) {
        if (!redisClient) return null;
        try {
            const value = await redisClient.incr(key);
            if (ttl && value === 1) {
                await redisClient.expire(key, ttl);
            }
            return value;
        } catch (error) {
            console.error('Cache incr error:', error);
            return null;
        }
    },

    // Check if Redis is available
    isAvailable() {
        return redisClient !== null && redisClient.isReady;
    }
};

module.exports = { initRedis, CacheService };