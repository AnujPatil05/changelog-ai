import { getRepos } from "@/lib/api";
import { AddRepoDialog } from "@/components/add-repo-dialog";
import { RepoList } from "@/components/repo-list";

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
            <RepoList initialRepos={repos} />
        </div>
    );
}
