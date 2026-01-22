const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

async function initDb() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const schemaSql = fs.readFileSync(path.join(__dirname, '../src/db/schema.sql'), 'utf8');
        await client.query(schemaSql);
        console.log('Schema initialized successfully.');

        await client.end();
    } catch (err) {
        console.error('Database initialization failed:', err);
        process.exit(1);
    }
}

initDb();
