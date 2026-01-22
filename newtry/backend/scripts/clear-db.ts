import { query } from '../src/db';

async function clearDb() {
    try {
        await query('DELETE FROM changelogs');
        console.log('Cleared all changelogs.');
    } catch (err) {
        console.error(err);
    }
}

clearDb();
