import { Worker } from 'bullmq';
import { generateChangelog } from './services/ai';

// Only initialize worker if REDIS_URL is configured
// This prevents crashes in environments without Redis
if (process.env.REDIS_URL) {
    const redisUrl = process.env.REDIS_URL.trim();

    const connection = {
        host: new URL(redisUrl).hostname,
        port: parseInt(new URL(redisUrl).port || '6379'),
        password: new URL(redisUrl).password || undefined,
        tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined
    };

    const worker = new Worker('changelog', async job => {
        if (job.name === 'process-commits') {
            console.log(`Processing commits for ${job.data.repo}...`);
            try {
                const changelog = await generateChangelog(job.data.commits);
                console.log('Changelog generated:', changelog);

                // Save to database
                const repoFullName = job.data.repo;
                try {
                    const { query } = await import('./db');
                    await query(
                        `INSERT INTO changelogs (repo_name, version, changes, raw_commits) VALUES ($1, $2, $3, $4)`,
                        [repoFullName, 'v1.0.0-draft', JSON.stringify(changelog), JSON.stringify(job.data.commits)]
                    );
                    console.log('Changelog saved to DB');
                } catch (dbErr) {
                    console.error('Failed to save to DB:', dbErr);
                }

                return changelog;
            } catch (error) {
                console.error('Job failed:', error);
                throw error;
            }
        }
    }, { connection });

    worker.on('completed', job => {
        console.log(`Job ${job.id} has completed!`);
    });

    worker.on('failed', (job, err) => {
        console.log(`Job ${job?.id} has failed with ${err.message}`);
    });

    console.log('BullMQ worker started');
} else {
    console.warn('REDIS_URL not configured - BullMQ worker disabled. Webhooks will not trigger background processing.');
}

