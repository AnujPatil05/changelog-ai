const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres'
});

async function testConnection() {
    try {
        await client.connect();
        console.log('Successfully connected to PostgreSQL!');
        await client.end();
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err.message);
        process.exit(1);
    }
}

testConnection();
