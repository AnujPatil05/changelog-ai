import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "@/components/sidebar";
import { Bell } from "lucide-react";

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
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Sidebar */}
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 border-b bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="font-bold text-lg md:hidden">
                            Changelog AI
                        </Link>
                    </div>

                    <div className="flex gap-4 items-center">
                        <Button variant="ghost" size="icon" className="text-zinc-500">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-zinc-800">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                <p className="text-xs text-zinc-500 truncate max-w-[150px]">{session.user?.email}</p>
                            </div>
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={session.user?.image || ""} />
                                <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
