import { getRepos } from "@/lib/api";
import Link from "next/link";
import { AddRepoDialog } from "@/components/add-repo-dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardHome() {
    const repos = await getRepos();

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-4xl font-bold tracking-tight">Developer Repository Dashboard</h1>
                <AddRepoDialog />
            </div>

            {/* Repositories Section */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-lg font-medium text-zinc-500">Repositorys</h2>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Search"
                            className="pl-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {repos.map((repo) => (
                        <Link key={repo} href={`/dashboard/${repo}`}>
                            <Card className="hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-black dark:bg-white rounded-full">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white dark:text-black">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017C2 16.442 5.892 20.194 9.324 21.341C9.824 21.435 10.006 21.125 10.006 20.862C10.006 20.627 9.997 20.004 9.992 19.176C6.215 19.998 5.418 17.348 5.418 17.348C4.963 16.187 4.305 15.877 4.305 15.877C3.072 15.033 4.398 15.049 4.398 15.049C5.761 15.145 6.478 16.452 6.478 16.452C7.689 18.54 9.655 17.937 10.428 17.587C10.551 16.703 10.905 16.099 11.295 15.757C8.28 15.413 5.111 14.248 5.111 9.049C5.111 7.568 5.638 6.353 6.505 5.399C6.365 5.056 5.895 3.664 6.64 1.78C6.64 1.78 7.778 1.415 10.368 3.17C11.45 2.868 12.611 2.718 13.771 2.713C14.93 2.718 16.091 2.868 17.175 3.17C19.762 1.415 20.899 1.78 20.899 1.78C21.646 3.664 21.176 5.056 21.036 5.399C21.905 6.353 22.43 7.568 22.43 9.049C22.43 14.259 19.256 15.409 16.232 15.748C16.721 16.173 17.158 17.014 17.158 18.301C17.158 20.143 17.142 21.625 17.142 21.862C17.142 22.128 17.321 22.443 17.831 22.345C21.261 20.19 25.153 16.442 25.153 12.017C25.153 6.484 20.676 2 15.153 2H12Z" fill="currentColor" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg leading-none mb-1">{repo}</h3>
                                                <p className="text-sm text-zinc-500">Last sync: 2 hours ago</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-zinc-300 dark:text-zinc-600" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}

                    {repos.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                            <p className="text-zinc-500 font-medium mb-1">No repositories found</p>
                            <p className="text-zinc-400 text-sm">Use the button above to add your first repository</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
