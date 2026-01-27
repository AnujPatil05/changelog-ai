import { getChangelog, Version } from "@/lib/api";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
    params: Promise<{
        username: string;
        repo: string;
    }>;
}

export const dynamic = 'force-dynamic';

export default async function ChangelogPage({ params }: Props) {
    const { username, repo } = await params;
    const data = await getChangelog(username, repo);

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
            <header className="border-b dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-10">
                <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="font-bold text-xl tracking-tight">
                        {data.repo}
                    </Link>
                    <div className="text-sm text-zinc-500">
                        Changelog
                    </div>
                </div>
            </header>

            <main className="container max-w-4xl mx-auto px-4 py-12">
                <div className="space-y-12">
                    {data.versions.map((version: Version, i: number) => (
                        <div key={i} className="relative pl-8 sm:pl-0">
                            {/* Timeline Line (Desktop only) */}
                            <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800 -ml-px sm:left-[-2rem] md:left-[-3rem]" />

                            <div className="flex flex-col sm:flex-row gap-8">
                                {/* Version Header */}
                                <div className="sm:w-32 flex-shrink-0 flex sm:flex-col gap-2 sm:text-right">
                                    <div className="font-mono text-xl font-bold">{version.version}</div>
                                    <div className="text-sm text-zinc-500">{version.date}</div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-6">
                                    {version.changes.features && version.changes.features.length > 0 && (
                                        <div>
                                            <h3 className="flex items-center gap-2 font-semibold mb-3 text-emerald-600 dark:text-emerald-400">
                                                <span className="w-2 h-2 rounded-full bg-current" />
                                                Features
                                            </h3>
                                            <ul className="space-y-2">
                                                {version.changes.features.map((item: string, j: number) => (
                                                    <li key={j} className="text-zinc-600 dark:text-zinc-300 prose prose-sm dark:prose-invert max-w-none">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{item}</ReactMarkdown>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {version.changes.fixes && version.changes.fixes.length > 0 && (
                                        <div>
                                            <h3 className="flex items-center gap-2 font-semibold mb-3 text-rose-600 dark:text-rose-400">
                                                <span className="w-2 h-2 rounded-full bg-current" />
                                                Fixes
                                            </h3>
                                            <ul className="space-y-2">
                                                {version.changes.fixes.map((item: string, j: number) => (
                                                    <li key={j} className="text-zinc-600 dark:text-zinc-300 prose prose-sm dark:prose-invert max-w-none">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{item}</ReactMarkdown>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {version.changes.improvements && version.changes.improvements.length > 0 && (
                                        <div>
                                            <h3 className="flex items-center gap-2 font-semibold mb-3 text-blue-600 dark:text-blue-400">
                                                <span className="w-2 h-2 rounded-full bg-current" />
                                                Improvements
                                            </h3>
                                            <ul className="space-y-2">
                                                {version.changes.improvements.map((item: string, j: number) => (
                                                    <li key={j} className="text-zinc-600 dark:text-zinc-300 prose prose-sm dark:prose-invert max-w-none">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{item}</ReactMarkdown>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
