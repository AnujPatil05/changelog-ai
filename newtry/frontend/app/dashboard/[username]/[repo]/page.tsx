import { getChangelog } from "@/lib/api";
import Editor from "@/components/editor";

interface Props {
    params: Promise<{
        username: string;
        repo: string;
    }>;
}

export default async function DashboardPage({ params }: Props) {
    const { username, repo } = await params;
    const data = await getChangelog(username, repo);

    if (!data || data.versions.length === 0) {
        return <div>No changelogs found.</div>;
    }

    // Edit the latest version by default for MVP
    const latestVersion = data.versions[0];

    return (
        <Editor username={username} repo={repo} versionData={latestVersion} />
    );
}
