import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const changelogQueue = new Queue('changelog', { connection });
