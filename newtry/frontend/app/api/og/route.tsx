import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const repo = searchParams.get('repo') || 'Repository';
    const version = searchParams.get('version') || 'v1.0.0';
    const features = parseInt(searchParams.get('features') || '0');
    const fixes = parseInt(searchParams.get('fixes') || '0');

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0a0a',
                    backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(14, 165, 233, 0.15), transparent)',
                }}
            >
                {/* Logo area */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '40px',
                    }}
                >
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: '#0ea5e9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                        }}
                    >
                        📝
                    </div>
                    <span style={{ color: '#71717a', fontSize: '24px', fontWeight: 500 }}>
                        Changelog AI
                    </span>
                </div>

                {/* Repo name */}
                <div
                    style={{
                        fontSize: '64px',
                        fontWeight: 700,
                        color: '#ffffff',
                        marginBottom: '16px',
                        textAlign: 'center',
                    }}
                >
                    {repo}
                </div>

                {/* Version badge */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'rgba(14, 165, 233, 0.2)',
                        border: '1px solid rgba(14, 165, 233, 0.4)',
                        borderRadius: '9999px',
                        padding: '8px 20px',
                        marginBottom: '40px',
                    }}
                >
                    <span style={{ color: '#0ea5e9', fontSize: '24px', fontWeight: 600 }}>
                        {version}
                    </span>
                </div>

                {/* Stats row */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '32px',
                    }}
                >
                    {features > 0 && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <span style={{ color: '#22c55e', fontSize: '32px' }}>✨</span>
                            <span style={{ color: '#a1a1aa', fontSize: '20px' }}>
                                {features} {features === 1 ? 'feature' : 'features'}
                            </span>
                        </div>
                    )}
                    {fixes > 0 && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <span style={{ color: '#f43f5e', fontSize: '32px' }}>🐛</span>
                            <span style={{ color: '#a1a1aa', fontSize: '20px' }}>
                                {fixes} {fixes === 1 ? 'fix' : 'fixes'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <span style={{ color: '#52525b', fontSize: '18px' }}>
                        Auto-generated changelog • changelog-ai.vercel.app
                    </span>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
