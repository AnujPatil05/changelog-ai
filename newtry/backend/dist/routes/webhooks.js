"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const queue_1 = require("../services/queue");
const router = (0, express_1.Router)();
router.post('/github', async (req, res) => {
    const event = req.headers['x-github-event'];
    const payload = req.body;
    console.log(`Received event: ${event}`);
    if (event === 'push') {
        // Basic enqueue
        try {
            await queue_1.changelogQueue.add('process-commits', {
                repo: payload.repository?.full_name,
                commits: payload.commits,
                pusher: payload.pusher
            });
        }
        catch (error) {
            console.error('Queue add failed:', error);
        }
    }
    res.status(200).send('Webhook received');
});
exports.default = router;
