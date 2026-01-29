import { Redis } from '@upstash/redis';
import crypto from 'crypto';

// Initialize Redis client for caching (uses same Upstash instance as rate limiting)
const redis = process.env.UPSTASH_REDIS_REST_URL
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL.trim(),
        token: (process.env.UPSTASH_REDIS_REST_TOKEN || '').trim(),
    })
    : null;

// Cache TTL: 24 hours (in seconds)
const CACHE_TTL = 60 * 60 * 24;

/**
 * Generate a hash key from commit data for cache lookup
 * Uses SHA256 hash of sorted commit messages to ensure consistency
 */
export function generateCommitHash(commits: Array<{ message: string; id?: string }>): string {
    const normalized = commits
        .map(c => c.message.trim().toLowerCase())
        .sort()
        .join('|');

    return crypto.createHash('sha256').update(normalized).digest('hex').substring(0, 16);
}

/**
 * Get cached changelog for given commits
 * Returns null if no cache or cache miss
 */
export async function getCachedChangelog(commits: Array<{ message: string }>): Promise<any | null> {
    if (!redis) {
        console.log('[Cache] Redis not configured, skipping cache lookup');
        return null;
    }

    try {
        const hash = generateCommitHash(commits);
        const cacheKey = `changelog:${hash}`;

        const cached = await redis.get(cacheKey);

        if (cached) {
            console.log(`[Cache] HIT for ${cacheKey}`);
            return typeof cached === 'string' ? JSON.parse(cached) : cached;
        }

        console.log(`[Cache] MISS for ${cacheKey}`);
        return null;
    } catch (error) {
        console.error('[Cache] Error reading cache:', error);
        return null;
    }
}

/**
 * Store changelog in cache
 */
export async function setCachedChangelog(
    commits: Array<{ message: string }>,
    changelog: { features: string[]; fixes: string[]; improvements: string[] }
): Promise<void> {
    if (!redis) {
        return;
    }

    try {
        const hash = generateCommitHash(commits);
        const cacheKey = `changelog:${hash}`;

        await redis.set(cacheKey, JSON.stringify(changelog), { ex: CACHE_TTL });
        console.log(`[Cache] STORED ${cacheKey} (TTL: ${CACHE_TTL}s)`);
    } catch (error) {
        console.error('[Cache] Error writing cache:', error);
    }
}

/**
 * Invalidate cache for specific commits
 */
export async function invalidateCache(commits: Array<{ message: string }>): Promise<void> {
    if (!redis) {
        return;
    }

    try {
        const hash = generateCommitHash(commits);
        const cacheKey = `changelog:${hash}`;

        await redis.del(cacheKey);
        console.log(`[Cache] INVALIDATED ${cacheKey}`);
    } catch (error) {
        console.error('[Cache] Error invalidating cache:', error);
    }
}
