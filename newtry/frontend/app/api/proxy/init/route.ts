import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { username, repo, token } = await req.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
        const res = await fetch(`${API_URL}/api/changelog/init`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, repo, token })
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
