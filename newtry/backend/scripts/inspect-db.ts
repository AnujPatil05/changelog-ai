import { query } from '../src/db';

async function checkDb() {
    try {
        const res = await query('SELECT * FROM changelogs ORDER BY created_at DESC LIMIT 1');
        console.log('Latest Changelog:', JSON.stringify(res.rows[0], null, 2));
        if (res.rows[0]) {
            console.log('Changes Type:', typeof res.rows[0].changes);
            console.log('Changes Content:', res.rows[0].changes);
        }
    } catch (err) {
        console.error(err);
    }
}

checkDb();
