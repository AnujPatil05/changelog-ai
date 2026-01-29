import { Router } from 'express';
import { query } from '../db';
import { strictRateLimitMiddleware } from '../middleware/rateLimit';
import fetch from 'node-fetch';
import { generateChangelog } from '../services/ai';
import { createJob, updateJob, getJob, Job } from '../services/jobStore';

const router = Router();

router.get('/list', async (req, res) => {
    try {
        const result = await query(
            `SELECT DISTINCT repo_name FROM changelogs ORDER BY repo_name ASC`
        );
        res.json({ repos: result.rows.map((r: any) => r.repo_name) });
    } catch (error) {
        console.error('Error fetching repo list:', error);
        res.status(500).json({ error: 'Failed to list repos' });
    }
});

// Synchronous init (original - for backwards compatibility)
router.post('/init', strictRateLimitMiddleware, async (req, res) => {
    const { username, repo, token } = req.body;

    try {
        console.log(`[Init] Fetching commits for ${username}/${repo}`);
        const headers: any = { 'User-Agent': 'Changelog-AI' };
        if (token) headers['Authorization'] = `token ${token}`;

        const commitsRes = await fetch(`https://api.github.com/repos/${username}/${repo}/commits?per_page=5`, { headers });

        if (!commitsRes.ok) {
            const err: any = await commitsRes.json();
            return res.status(commitsRes.status).json({ error: err.message || 'Failed to fetch commits from GitHub' });
        }

        const commits: any[] = await commitsRes.json();
        const commitData = commits.map(c => ({
            message: c.commit.message,
            id: c.sha.substring(0, 7),
            author: c.commit.author.name
        }));

        console.log(`[Init] Generating changelog for ${commitData.length} commits...`);
        const aiResponse = await generateChangelog(commitData);
        if (!aiResponse) {
            return res.status(500).json({ error: 'AI failed to generate changelog' });
        }

        const fullName = `${username}/${repo}`;
        const version = `v1.0.0-${new Date().toISOString().split('T')[0]}`;

        await query(
            `INSERT INTO changelogs (repo_name, version, changes, raw_commits) VALUES ($1, $2, $3, $4)
             ON CONFLICT (repo_name, version) DO UPDATE SET changes = $3, raw_commits = $4`,
            [fullName, version, JSON.stringify(aiResponse), JSON.stringify(commitData)]
        );

        res.json({ success: true, repo: fullName });
    } catch (error: any) {
        console.error('Error initializing repo:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Async init - returns job ID immediately, processes in background
router.post('/init-async', strictRateLimitMiddleware, async (req, res) => {
    const { username, repo, token } = req.body;
    const fullName = `${username}/${repo}`;

    try {
        // Create job immediately
        const job = await createJob(fullName);

        // Start async processing (don't await)
        processChangelogAsync(job.id, username, repo, token);

        // Return job ID for polling
        res.json({
            success: true,
            jobId: job.id,
            message: 'Changelog generation started. Poll /job/:id for status.'
        });
    } catch (error: any) {
        console.error('Error starting async init:', error);
        res.status(500).json({ error: 'Failed to start async job' });
    }
});

// Job status polling endpoint
router.get('/job/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const job = await getJob(id);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json(job);
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ error: 'Failed to fetch job status' });
    }
});

// Background processing function
async function processChangelogAsync(jobId: string, username: string, repo: string, token?: string) {
    const fullName = `${username}/${repo}`;

    try {
        await updateJob(jobId, { status: 'processing', progress: 10 });

        // 1. Fetch commits
        const headers: any = { 'User-Agent': 'Changelog-AI' };
        if (token) headers['Authorization'] = `token ${token}`;

        const commitsRes = await fetch(
            `https://api.github.com/repos/${username}/${repo}/commits?per_page=5`,
            { headers }
        );

        if (!commitsRes.ok) {
            const err: any = await commitsRes.json();
            await updateJob(jobId, {
                status: 'failed',
                error: err.message || 'Failed to fetch commits from GitHub'
            });
            return;
        }

        await updateJob(jobId, { progress: 30 });

        const commits: any[] = await commitsRes.json();
        const commitData = commits.map(c => ({
            message: c.commit.message,
            id: c.sha.substring(0, 7),
            author: c.commit.author.name
        }));

        await updateJob(jobId, { progress: 50 });

        // 2. Generate changelog (may be cached)
        const aiResponse = await generateChangelog(commitData);

        if (!aiResponse) {
            await updateJob(jobId, { status: 'failed', error: 'AI failed to generate changelog' });
            return;
        }

        await updateJob(jobId, { progress: 80 });

        // 3. Save to DB
        const version = `v1.0.0-${new Date().toISOString().split('T')[0]}`;

        await query(
            `INSERT INTO changelogs (repo_name, version, changes, raw_commits) VALUES ($1, $2, $3, $4)
             ON CONFLICT (repo_name, version) DO UPDATE SET changes = $3, raw_commits = $4`,
            [fullName, version, JSON.stringify(aiResponse), JSON.stringify(commitData)]
        );

        // 4. Job complete
        await updateJob(jobId, {
            status: 'completed',
            progress: 100,
            result: { repo: fullName, version, changes: aiResponse }
        });

        console.log(`[Async] Job ${jobId} completed for ${fullName}`);
    } catch (error: any) {
        console.error(`[Async] Job ${jobId} failed:`, error);
        await updateJob(jobId, {
            status: 'failed',
            error: error.message || 'Unknown error'
        });
    }
}

// Get changelog for a repo
router.get('/:username/:repo', async (req, res) => {
    const { username, repo } = req.params;
    const fullName = `${username}/${repo}`;

    try {
        const result = await query(
            `SELECT version, changes, raw_commits, created_at FROM changelogs WHERE repo_name = $1 ORDER BY created_at DESC`,
            [fullName]
        );

        const versions = result.rows.map((row: any) => ({
            version: row.version,
            date: new Date(row.created_at).toISOString().split('T')[0],
            changes: row.changes,
            raw_commits: row.raw_commits || []
        }));

        res.json({ repo: fullName, versions });
    } catch (error) {
        console.error('Error fetching changelog:', error);
        res.status(500).json({ error: 'Failed to fetch changelog' });
    }
});

// Update changelog
router.put('/:username/:repo', async (req, res) => {
    const { username, repo } = req.params;
    const { version, changes } = req.body;
    const fullName = `${username}/${repo}`;

    try {
        await query(
            `UPDATE changelogs SET changes = $1 WHERE repo_name = $2 AND version = $3`,
            [JSON.stringify(changes), fullName, version]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating changelog:', error);
        res.status(500).json({ error: 'Failed to update changelog' });
    }
});

export default router;

