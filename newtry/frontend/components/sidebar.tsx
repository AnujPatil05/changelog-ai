"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, Book, Settings, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const sidebarItems = [
    { name: "Home", icon: Home, href: "/dashboard" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
    { name: "Profile", icon: User, href: "/dashboard/profile" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-16 md:w-64 flex-col border-r bg-sidebar border-sidebar-border hidden md:flex h-screen sticky top-0 shrink-0 overflow-hidden">
            <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-sidebar-border shrink-0">
                <div className="bg-primary text-primary-foreground p-1 rounded-md mr-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <span className="font-bold text-lg hidden md:block">Changelog AI</span>
            </div>

            <div className="flex-1 py-4 flex flex-col gap-1 px-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href} draggable="false">
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-2",
                                    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="hidden md:block">{item.name}</span>
                            </Button>
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 border-t border-sidebar-border shrink-0">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    <LogOut className="h-5 w-5" />
                    <span className="hidden md:block">Logout</span>
                </Button>
            </div>
        </div>
    );
}
