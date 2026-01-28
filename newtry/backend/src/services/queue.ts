import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = process.env.REDIS_URL
    ? {
        href: process.env.REDIS_URL,
        tls: process.env.REDIS_URL.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined
    }
    : {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        ...(process.env.REDIS_HOST?.includes('upstash') ? { tls: { rejectUnauthorized: false } } : {})
    };

export const changelogQueue = new Queue('changelog', { connection });
