const { CacheService } = require('../config/redis.config');

class RateLimiter {
    constructor(options = {}) {
        this.windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
        this.max = options.max || 100; // Max requests per window
        this.message = options.message || 'Too many requests, please try again later.';
        this.statusCode = options.statusCode || 429;
        this.keyPrefix = options.keyPrefix || 'rate-limit:';
        
        // Fallback in-memory store (when Redis is down)
        this.memoryStore = new Map();
    }

    // Generate key based on IP or user ID
    getKey(req) {
        const identifier = req.userId || req.ip;
        return `${this.keyPrefix}${identifier}`;
    }

    // Check and update rate limit using Redis
    async checkLimit(req) {
        const key = this.getKey(req);
        const current = await CacheService.incr(key, Math.ceil(this.windowMs / 1000));
        
        if (current === null) {
            // Redis not available, fallback to in-memory
            return this.checkLimitMemory(req);
        }
        
        return {
            allowed: current <= this.max,
            current,
            limit: this.max,
            remaining: Math.max(0, this.max - current),
            resetTime: new Date(Date.now() + this.windowMs)
        };
    }

    // Fallback in-memory rate limiter (when Redis is down)
    checkLimitMemory(req) {
        const key = this.getKey(req);
        const now = Date.now();
        const record = this.memoryStore.get(key);
        
        if (!record) {
            this.memoryStore.set(key, {
                count: 1,
                resetTime: now + this.windowMs
            });
            return {
                allowed: true,
                current: 1,
                limit: this.max,
                remaining: this.max - 1,
                resetTime: new Date(now + this.windowMs)
            };
        }
        
        if (now > record.resetTime) {
            this.memoryStore.set(key, {
                count: 1,
                resetTime: now + this.windowMs
            });
            return {
                allowed: true,
                current: 1,
                limit: this.max,
                remaining: this.max - 1,
                resetTime: new Date(now + this.windowMs)
            };
        }
        
        record.count++;
        this.memoryStore.set(key, record);
        
        return {
            allowed: record.count <= this.max,
            current: record.count,
            limit: this.max,
            remaining: Math.max(0, this.max - record.count),
            resetTime: new Date(record.resetTime)
        };
    }

    // Express middleware
    middleware() {
        return async (req, res, next) => {
            const result = await this.checkLimit(req);
            
            // Add rate limit headers
            res.setHeader('X-RateLimit-Limit', result.limit);
            res.setHeader('X-RateLimit-Remaining', result.remaining);
            res.setHeader('X-RateLimit-Reset', Math.floor(result.resetTime.getTime() / 1000));
            
            if (!result.allowed) {
                return res.status(this.statusCode).json({
                    message: this.message,
                    retryAfter: Math.ceil((result.resetTime.getTime() - Date.now()) / 1000)
                });
            }
            
            next();
        };
    }
}

// Pre-configured rate limiters
const globalLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyPrefix: 'rate-limit:global:'
});

const authLimiter = new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 attempts per hour
    message: 'Too many authentication attempts, please try again after an hour.',
    keyPrefix: 'rate-limit:auth:'
});

const apiLimiter = new RateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute for authenticated users
    keyPrefix: 'rate-limit:api:'
});

module.exports = {
    RateLimiter,
    globalLimiter,
    authLimiter,
    apiLimiter
};