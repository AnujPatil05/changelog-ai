"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.get('/list', async (req, res) => {
    try {
        const result = await (0, db_1.query)(`SELECT DISTINCT repo_name FROM changelogs ORDER BY repo_name ASC`);
        res.json({ repos: result.rows.map((r) => r.repo_name) });
    }
    catch (error) {
        console.error('Error fetching repo list:', error);
        res.status(500).json({ error: 'Failed to list repos' });
    }
});
router.get('/:username/:repo', async (req, res) => {
    const { username, repo } = req.params;
    const fullName = `${username}/${repo}`;
    try {
        const result = await (0, db_1.query)(`SELECT version, changes, created_at FROM changelogs WHERE repo_name = $1 ORDER BY created_at DESC`, [fullName]);
        // Format for frontend
        const versions = result.rows.map((row) => ({
            version: row.version,
            date: new Date(row.created_at).toISOString().split('T')[0],
            changes: row.changes // Postgres stores JSONB as object automatically
        }));
        res.json({ repo: fullName, versions });
    }
    catch (error) {
        console.error('Error fetching changelog:', error);
        res.status(500).json({ error: 'Failed to fetch changelog' });
    }
    router.put('/:username/:repo', async (req, res) => {
        const { username, repo } = req.params;
        const { version, changes } = req.body;
        const fullName = `${username}/${repo}`;
        try {
            await (0, db_1.query)(`UPDATE changelogs SET changes = $1 WHERE repo_name = $2 AND version = $3`, [JSON.stringify(changes), fullName, version]);
            res.json({ success: true });
        }
        catch (error) {
            console.error('Error updating changelog:', error);
            res.status(500).json({ error: 'Failed to update changelog' });
        }
    });
});
exports.default = router;
