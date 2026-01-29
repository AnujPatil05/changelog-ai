import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { Request, Response, NextFunction } from 'express';

// Initialize Redis client from environment variable
// UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN should be set
const redis = process.env.UPSTASH_REDIS_REST_URL
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    : null;

// Define different rate limiters for different endpoints
export const standardRateLimit = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
        analytics: true,
        prefix: 'ratelimit:standard',
    })
    : null;

export const strictRateLimit = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 requests per hour (for expensive operations)
        analytics: true,
        prefix: 'ratelimit:strict',
    })
    : null;

// Middleware factory
export function createRateLimitMiddleware(limiter: Ratelimit | null, fallbackLimit: number = 100) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // Skip rate limiting in development if no Upstash configured
        if (!limiter) {
            console.warn('Upstash Rate Limit not configured, skipping...');
            next();
            return;
        }

        try {
            // Use IP address or user ID as identifier
            const identifier = req.ip || req.headers['x-forwarded-for']?.toString() || 'anonymous';

            const result = await limiter.limit(identifier);

            // Add rate limit headers
            res.setHeader('X-RateLimit-Limit', result.limit);
            res.setHeader('X-RateLimit-Remaining', result.remaining);
            res.setHeader('X-RateLimit-Reset', result.reset);

            if (!result.success) {
                res.status(429).json({
                    error: 'Too Many Requests',
                    message: 'Rate limit exceeded. Please try again later.',
                    retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
                });
                return;
            }

            next();
        } catch (error) {
            console.error('Rate limit error:', error);
            // Fail open - allow request if rate limiter fails
            next();
        }
    };
}

// Pre-built middleware instances
export const standardRateLimitMiddleware = createRateLimitMiddleware(standardRateLimit);
export const strictRateLimitMiddleware = createRateLimitMiddleware(strictRateLimit);
