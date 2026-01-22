"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.worker = void 0;
const bullmq_1 = require("bullmq");
const ai_1 = require("./services/ai");
const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
};
exports.worker = new bullmq_1.Worker('changelog', async (job) => {
    if (job.name === 'process-commits') {
        console.log(`Processing commits for ${job.data.repo}...`);
        try {
            const changelog = await (0, ai_1.generateChangelog)(job.data.commits);
            console.log('Changelog generated:', changelog);
            // Save to database
            const repoFullName = job.data.repo;
            try {
                const { query } = await Promise.resolve().then(() => __importStar(require('./db')));
                // Delete existing draft for this version if exists (optional strategy)
                // For MVP, just insert.
                await query(`INSERT INTO changelogs (repo_name, version, changes, raw_commits) VALUES ($1, $2, $3, $4)`, [repoFullName, 'v1.0.0-draft', JSON.stringify(changelog), JSON.stringify(job.data.commits)]);
                console.log('Changelog saved to DB');
            }
            catch (dbErr) {
                console.error('Failed to save to DB:', dbErr);
            }
            return changelog;
        }
        catch (error) {
            console.error('Job failed:', error);
            throw error;
        }
    }
}, { connection });
exports.worker.on('completed', job => {
    console.log(`Job ${job.id} has completed!`);
});
exports.worker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} has failed with ${err.message}`);
});
