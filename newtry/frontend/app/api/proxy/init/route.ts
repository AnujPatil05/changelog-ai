import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { username, repo, token } = await req.json();
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    const API_URL = (envUrl && envUrl.trim() !== '') ? envUrl : 'http://localhost:3001';

    try {
        const res = await fetch(`${API_URL}/api/changelog/init`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, repo, token })
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
