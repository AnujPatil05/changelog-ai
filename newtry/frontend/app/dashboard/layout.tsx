import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <header className="border-b bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="font-bold text-xl">
                        Changelog AI <span className="text-zinc-500 font-normal">Dashboard</span>
                    </Link>
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-2 mr-4">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={session.user?.image || ""} />
                                <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{session.user?.name}</span>
                        </div>
                        <Button variant="ghost" asChild>
                            <Link href="/">View Public Page</Link>
                        </Button>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
