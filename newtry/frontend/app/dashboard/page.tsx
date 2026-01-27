import { getRepos } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

import { AddRepoDialog } from "@/components/add-repo-dialog";

export default async function DashboardHome() {
    const repos = await getRepos();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">My Repositories</h1>
                    <p className="text-zinc-500">Select a repository to manage its changelog.</p>
                </div>
                <AddRepoDialog />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {repos.map((repo) => (
                    <Link key={repo} href={`/dashboard/${repo}`}>
                        <Card className="hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors cursor-pointer h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    {repo}
                                    <ArrowRight className="w-4 h-4 text-zinc-400" />
                                </CardTitle>
                                <CardDescription>Manage changelogs for {repo}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}

                {repos.length === 0 && (
                    <div className="col-span-full text-center py-12 border border-dashed rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                        <p className="text-zinc-500">No repositories found. Configure a webhook to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
