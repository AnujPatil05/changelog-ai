import Link from 'next/link'

export const dynamic = 'force-dynamic';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
            <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
            <p className="text-zinc-500 mb-8">Could not find requested resource</p>
            <Link href="/" className="px-4 py-2 bg-zinc-900 text-white rounded hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                Return Home
            </Link>
        </div>
    )
}
