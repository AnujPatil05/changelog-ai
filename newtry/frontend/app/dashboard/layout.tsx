import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "@/components/sidebar";
import { DashboardContent } from "@/components/dashboard-content";
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
        <div className="flex min-h-screen bg-background">
            {/* Sidebar - stays locked during navigation */}
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b bg-card border-border flex items-center justify-between px-4 md:px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="font-bold text-lg md:hidden">
                            Changelog AI
                        </Link>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-3 pl-4 border-l border-border">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[150px]">{session.user?.email}</p>
                            </div>
                            <Avatar className="h-9 w-9 shrink-0">
                                <AvatarImage src={session.user?.image || ""} />
                                <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
                    <DashboardContent>
                        {children}
                    </DashboardContent>
                </main>
            </div>
        </div>
    );
}

