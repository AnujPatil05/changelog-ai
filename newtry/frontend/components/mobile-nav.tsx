"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Settings, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface MobileNavProps {
    userName?: string;
    userImage?: string;
}

export function MobileNav({ userName, userImage }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: Home },
        { href: "/dashboard/profile", label: "Profile", icon: User },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ];

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Slide-in Menu */}
                        <motion.div
                            className="fixed top-16 left-0 right-0 bg-card border-b border-border z-50 md:hidden"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        >
                            <nav className="p-4 space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                                }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            {item.label}
                                        </Link>
                                    );
                                })}

                                <hr className="my-2 border-border" />

                                <button
                                    onClick={() => signOut()}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Sign Out
                                </button>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
