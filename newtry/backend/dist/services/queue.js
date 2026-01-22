"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changelogQueue = void 0;
const bullmq_1 = require("bullmq");
const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
};
exports.changelogQueue = new bullmq_1.Queue('changelog', { connection });
