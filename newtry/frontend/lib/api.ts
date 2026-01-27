export interface Changes {
    features: string[];
    fixes: string[];
    improvements: string[];
    [key: string]: string[]; // Add index signature for editor access
}

export interface Version {
    version: string;
    date: string;
    changes: Changes;
}

export interface ChangelogData {
    repo: string;
    versions: Version[];
}

const envUrl = process.env.NEXT_PUBLIC_API_URL;
const API_URL = (envUrl && envUrl.trim() !== '') ? envUrl : 'http://localhost:3001';

export async function getChangelog(username: string, repo: string): Promise<ChangelogData> {
    try {
        const res = await fetch(`${API_URL}/api/changelog/${username}/${repo}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }

        return await res.json();
    } catch (error) {
        console.error("API Error:", error);
        return {
            repo: `${username}/${repo}`,
            versions: []
        };
    }
}

export async function updateChangelog(username: string, repo: string, version: string, changes: Changes) {
    const res = await fetch(`${API_URL}/api/changelog/${username}/${repo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version, changes })
    });
    return res.json();
}

export async function getRepos(): Promise<string[]> {
    try {
        const res = await fetch(`${API_URL}/api/changelog/list`, { cache: 'no-store' });
        if (!res.ok) return [];
        const data = await res.json();
        return data.repos || [];
    } catch (e) {
        console.error(e);
        return [];
    }
}
