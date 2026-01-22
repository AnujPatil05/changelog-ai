import { Worker } from 'bullmq';
import { generateChangelog } from './services/ai';

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const worker = new Worker('changelog', async job => {
    if (job.name === 'process-commits') {
        console.log(`Processing commits for ${job.data.repo}...`);
        try {
            const changelog = await generateChangelog(job.data.commits);
            console.log('Changelog generated:', changelog);

            // Save to database
            const repoFullName = job.data.repo;
            try {
                const { query } = await import('./db');
                // Delete existing draft for this version if exists (optional strategy)
                // For MVP, just insert.
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
