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
    raw_commits?: {
        message: string;
        id: string;
        author: string;
    }[];
}

export interface ChangelogData {
    repo: string;
    versions: Version[];
}

export interface JobStatus {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    repoName: string;
    createdAt: string;
    updatedAt: string;
    result?: any;
    error?: string;
    progress?: number;
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

export async function getRepos(username?: string): Promise<string[]> {
    try {
        const url = username
            ? `${API_URL}/api/changelog/list?username=${username}`
            : `${API_URL}/api/changelog/list`;

        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return [];
        const data = await res.json();
        return data.repos || [];
    } catch (e) {
        console.error(e);
        return [];
    }
}

/**
 * Start async changelog generation - returns job ID for polling
 */
export async function initRepoAsync(username: string, repo: string, token?: string): Promise<{ success: boolean; jobId?: string; error?: string }> {
    try {
        const res = await fetch(`${API_URL}/api/changelog/init-async`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, repo, token })
        });

        if (!res.ok) {
            const err = await res.json();
            return { success: false, error: err.error || 'Failed to start job' };
        }

        const data = await res.json();
        return { success: true, jobId: data.jobId };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: e.message };
    }
}

/**
 * Poll job status
 */
export async function getJobStatus(jobId: string): Promise<JobStatus | null> {
    try {
        const res = await fetch(`${API_URL}/api/changelog/job/${jobId}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}

