import { Router } from 'express';
import { query } from '../db';

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

// Manual trigger to initialize a repo
import fetch from 'node-fetch';
import { generateChangelog } from '../services/ai';

router.post('/init', async (req, res) => {
    const { username, repo, token } = req.body;

    try {
        // 1. Fetch recent commits from GitHub
        console.log(`[Init] Fetching commits for ${username}/${repo}`);
        const headers: any = { 'User-Agent': 'Changelog-AI' };
        if (token) headers['Authorization'] = `token ${token}`;

        const commitsRes = await fetch(`https://api.github.com/repos/${username}/${repo}/commits?per_page=5`, { headers });

        if (!commitsRes.ok) {
            const err: any = await commitsRes.json();
            return res.status(commitsRes.status).json({ error: err.message || 'Failed to fetch commits from GitHub' });
        }

        const commits: any[] = await commitsRes.json();

        // 2. Format commits for AI
        const commitData = commits.map(c => ({
            message: c.commit.message,
            id: c.sha.substring(0, 7),
            author: c.commit.author.name
        }));

        // 3. Generate Changelog
        console.log(`[Init] Generating changelog for ${commitData.length} commits...`);
        const aiResponse = await generateChangelog(commitData);
        if (!aiResponse) {
            return res.status(500).json({ error: 'AI failed to generate changelog' });
        }

        // 4. Save to DB
        const fullName = `${username}/${repo}`;
        // AI returns just the changes object { features: [], ... }, not { version, changes }.
        // We'll generate a generic version for initialization.
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

router.get('/:username/:repo', async (req, res) => {
    const { username, repo } = req.params;
    const fullName = `${username}/${repo}`;

    try {
        const result = await query(
            `SELECT version, changes, raw_commits, created_at FROM changelogs WHERE repo_name = $1 ORDER BY created_at DESC`,
            [fullName]
        );

        // Format for frontend
        const versions = result.rows.map((row: any) => ({
            version: row.version,
            date: new Date(row.created_at).toISOString().split('T')[0],
            changes: row.changes, // Postgres stores JSONB as object automatically
            raw_commits: row.raw_commits || []
        }));

        res.json({ repo: fullName, versions });
    } catch (error) {
        console.error('Error fetching changelog:', error);
        res.status(500).json({ error: 'Failed to fetch changelog' });
    }
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
});

export default router;
