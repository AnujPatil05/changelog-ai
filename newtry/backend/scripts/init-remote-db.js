const { Client } = require('pg');

async function run() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('Error: DATABASE_URL environment variable is required.');
        process.exit(1);
    }

    console.log(`Connecting to database...`); // Don't log the full URL for security

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false } // Required for Railway/Neon/Supabase
    });

    try {
        await client.connect();
        console.log('Connected successfully.');

        console.log('Creating "changelogs" table if not exists...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS changelogs (
                id SERIAL PRIMARY KEY,
                repo_name VARCHAR(255) NOT NULL,
                version VARCHAR(50) NOT NULL,
                changes JSONB NOT NULL,
                raw_commits JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(repo_name, version)
            );
        `);
        console.log('Table "changelogs" ensured.');

        await client.end();
        console.log('Database initialization complete.');
    } catch (err) {
        console.error('Database initialization failed:', err);
        process.exit(1);
    }
}

run();
