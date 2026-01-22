import { Router } from 'express';
import { changelogQueue } from '../services/queue';

const router = Router();

router.post('/github', async (req, res) => {
    const event = req.headers['x-github-event'];
    const payload = req.body;

    console.log(`Received event: ${event}`);

    if (event === 'push') {
        // Basic enqueue
        try {
            await changelogQueue.add('process-commits', {
                repo: payload.repository?.full_name,
                commits: payload.commits,
                pusher: payload.pusher
            });
        } catch (error) {
            console.error('Queue add failed:', error);
        }
    }

    res.status(200).send('Webhook received');
});

export default router;
