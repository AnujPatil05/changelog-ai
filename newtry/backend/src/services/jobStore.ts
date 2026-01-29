import { Redis } from '@upstash/redis';
import { v4 as uuidv4 } from 'uuid';

// Initialize Redis client for job storage
const redis = process.env.UPSTASH_REDIS_REST_URL
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL.trim(),
        token: (process.env.UPSTASH_REDIS_REST_TOKEN || '').trim(),
    })
    : null;

// Job TTL: 1 hour (in seconds)
const JOB_TTL = 60 * 60;

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Job {
    id: string;
    status: JobStatus;
    repoName: string;
    createdAt: string;
    updatedAt: string;
    result?: any;
    error?: string;
    progress?: number;
}

/**
 * Create a new job and store in Redis
 */
export async function createJob(repoName: string): Promise<Job> {
    const job: Job = {
        id: uuidv4(),
        status: 'pending',
        repoName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: 0,
    };

    if (redis) {
        await redis.set(`job:${job.id}`, JSON.stringify(job), { ex: JOB_TTL });
    }

    // Also store in memory for fallback
    jobStore.set(job.id, job);

    return job;
}

/**
 * Update job status
 */
export async function updateJob(jobId: string, updates: Partial<Job>): Promise<Job | null> {
    let job = await getJob(jobId);

    if (!job) {
        return null;
    }

    job = {
        ...job,
        ...updates,
        updatedAt: new Date().toISOString(),
    };

    if (redis) {
        await redis.set(`job:${jobId}`, JSON.stringify(job), { ex: JOB_TTL });
    }

    jobStore.set(jobId, job);

    return job;
}

/**
 * Get job by ID
 */
export async function getJob(jobId: string): Promise<Job | null> {
    // Try Redis first
    if (redis) {
        try {
            const cached = await redis.get(`job:${jobId}`);
            if (cached) {
                return typeof cached === 'string' ? JSON.parse(cached) : cached as Job;
            }
        } catch (error) {
            console.error('[JobStore] Redis error:', error);
        }
    }

    // Fallback to in-memory store
    return jobStore.get(jobId) || null;
}

// In-memory fallback store (for when Redis is unavailable)
const jobStore = new Map<string, Job>();

/**
 * Clean up old jobs from memory
 */
export function cleanupJobStore(): void {
    const oneHourAgo = Date.now() - JOB_TTL * 1000;

    for (const [id, job] of jobStore.entries()) {
        if (new Date(job.createdAt).getTime() < oneHourAgo) {
            jobStore.delete(id);
        }
    }
}

// Clean up every 15 minutes
setInterval(cleanupJobStore, 15 * 60 * 1000);
