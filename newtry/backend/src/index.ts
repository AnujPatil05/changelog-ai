import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

app.get('/', (req: Request, res: Response) => {
    res.send('Changelog AI API is running');
});

import webhookRoutes from './routes/webhooks';
import changelogRoutes from './routes/changelog';
import './worker'; // Start the worker

app.use('/webhook', webhookRoutes);
app.use('/api/changelog', changelogRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
