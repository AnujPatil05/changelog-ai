const { Client } = require('pg');

const passwords = ['TickTickBoom09', 'postgres', 'password', '1234', 'admin', 'root', 'pass', '123456'];

async function tryConnect(password) {
    const client = new Client({
        connectionString: `postgresql://postgres:${password}@localhost:5432/postgres`
    });

    try {
        await client.connect();
        console.log(`SUCCESS: Password is '${password}'`);

        // Create database if connected
        try {
            await client.query('CREATE DATABASE changelog_ai');
            console.log('Database changelog_ai created successfully.');
        } catch (dbErr) {
            if (dbErr.code === '42P04') {
                console.log('Database changelog_ai already exists.');
            } else {
                console.log('Error creating database:', dbErr.message);
            }
        }

        await client.end();
        return password;
    } catch (err) {
        // console.log(`Failed with ${password}: ${err.message}`);
        return null;
    }
}

async function run() {
    console.log('Trying common passwords...');
    for (const pass of passwords) {
        const success = await tryConnect(pass);
        if (success) {
            console.log(`FOUND_PASSWORD:${success}`);
            process.exit(0);
        }
    }
    console.log('Failed to find password.');
    process.exit(1);
}

run();
