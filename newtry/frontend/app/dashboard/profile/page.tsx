import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Calendar, Zap, ExternalLink } from "lucide-react";
import { getRepos, getChangelog } from "@/lib/api";
import Link from "next/link";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const user = session.user;
    const joinDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Fetch real data from API (Scoped to user)
    const repos = await getRepos(user?.name || undefined);

    // Calculate real stats
    let totalChangelogs = 0;
    let totalCommits = 0;

    // Fetch changelog data for each repo to get real stats
    for (const repo of repos) {
        try {
            const [username, repoName] = repo.split('/');
            const changelogData = await getChangelog(username, repoName);
            totalChangelogs += changelogData.versions.length;
            // Count commits from raw_commits if available
            changelogData.versions.forEach(version => {
                if (version.raw_commits) {
                    totalCommits += version.raw_commits.length;
                }
            });
        } catch (e) {
            // Skip if can't fetch
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground mt-1">Your account information</p>
            </div>

            {/* Profile Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start gap-6 flex-wrap">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user?.image || ""} />
                            <AvatarFallback className="text-2xl">{user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="text-2xl font-bold">{user?.name}</h2>
                                <Badge variant="secondary" className="gap-1">
                                    <Zap className="h-3 w-3" />
                                    Free Plan
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">{user?.email}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1">
                                    <Github className="h-4 w-4" />
                                    Connected via GitHub
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Joined {joinDate}
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" className="gap-2" asChild>
                            <a href={`https://github.com/${user?.name}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                GitHub Profile
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Usage Stats - Real Data */}
            <Card>
                <CardHeader>
                    <CardTitle>Usage Statistics</CardTitle>
                    <CardDescription>Your activity this month</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4 md:gap-6">
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <p className="text-3xl font-bold text-primary">{repos.length}</p>
                            <p className="text-sm text-muted-foreground mt-1">Repositories</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <p className="text-3xl font-bold text-green-600">{totalChangelogs}</p>
                            <p className="text-sm text-muted-foreground mt-1">Changelogs Generated</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <p className="text-3xl font-bold text-purple-600">{totalCommits}</p>
                            <p className="text-sm text-muted-foreground mt-1">Commits Processed</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Connected Repositories - Real Data */}
            <Card>
                <CardHeader>
                    <CardTitle>Connected Repositories</CardTitle>
                    <CardDescription>Repositories with changelog tracking enabled</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {repos.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">
                                No repositories connected yet.{" "}
                                <Link href="/dashboard" className="text-primary hover:underline">
                                    Add one now
                                </Link>
                            </p>
                        ) : (
                            repos.map((repo) => (
                                <Link
                                    key={repo}
                                    href={`/dashboard/${repo}`}
                                    className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Github className="h-5 w-5" />
                                        <span className="font-medium">{repo}</span>
                                    </div>
                                    <Badge>Active</Badge>
                                </Link>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

