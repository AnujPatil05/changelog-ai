"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Home,
    Settings,
    User,
    Moon,
    Sun,
    LogOut,
    GitBranch,
    FileText,
    Command
} from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";

interface CommandItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    shortcut?: string;
    action: () => void;
    category: string;
}

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    const commands: CommandItem[] = [
        {
            id: "home",
            label: "Go to Dashboard",
            icon: <Home className="h-4 w-4" />,
            shortcut: "G D",
            action: () => router.push("/dashboard"),
            category: "Navigation",
        },
        {
            id: "profile",
            label: "Go to Profile",
            icon: <User className="h-4 w-4" />,
            shortcut: "G P",
            action: () => router.push("/dashboard/profile"),
            category: "Navigation",
        },
        {
            id: "settings",
            label: "Go to Settings",
            icon: <Settings className="h-4 w-4" />,
            shortcut: "G S",
            action: () => router.push("/dashboard/settings"),
            category: "Navigation",
        },
        {
            id: "theme",
            label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
            icon: theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
            shortcut: "T",
            action: () => setTheme(theme === "dark" ? "light" : "dark"),
            category: "Preferences",
        },
        {
            id: "logout",
            label: "Sign Out",
            icon: <LogOut className="h-4 w-4" />,
            action: () => signOut(),
            category: "Account",
        },
    ];

    const filteredCommands = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(search.toLowerCase())
    );

    const groupedCommands = filteredCommands.reduce((acc, cmd) => {
        if (!acc[cmd.category]) acc[cmd.category] = [];
        acc[cmd.category].push(cmd);
        return acc;
    }, {} as Record<string, CommandItem[]>);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Open with CMD+K or CTRL+K
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            setIsOpen(prev => !prev);
            setSearch("");
            setSelectedIndex(0);
        }

        if (!isOpen) return;

        if (e.key === "Escape") {
            setIsOpen(false);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (filteredCommands[selectedIndex]) {
                filteredCommands[selectedIndex].action();
                setIsOpen(false);
            }
        }
    }, [isOpen, filteredCommands, selectedIndex]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Command Palette */}
                    <motion.div
                        className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-lg z-50"
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                                <Search className="h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Type a command or search..."
                                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    autoFocus
                                />
                                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted rounded font-mono">
                                    ESC
                                </kbd>
                            </div>

                            {/* Commands List */}
                            <div className="max-h-80 overflow-y-auto p-2">
                                {Object.entries(groupedCommands).map(([category, items]) => (
                                    <div key={category} className="mb-2">
                                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {category}
                                        </div>
                                        {items.map((cmd) => {
                                            const flatIndex = filteredCommands.indexOf(cmd);
                                            return (
                                                <button
                                                    key={cmd.id}
                                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${flatIndex === selectedIndex
                                                            ? "bg-primary/10 text-primary"
                                                            : "hover:bg-muted"
                                                        }`}
                                                    onClick={() => {
                                                        cmd.action();
                                                        setIsOpen(false);
                                                    }}
                                                    onMouseEnter={() => setSelectedIndex(flatIndex)}
                                                >
                                                    <span className={flatIndex === selectedIndex ? "text-primary" : "text-muted-foreground"}>
                                                        {cmd.icon}
                                                    </span>
                                                    <span className="flex-1">{cmd.label}</span>
                                                    {cmd.shortcut && (
                                                        <kbd className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                                                            {cmd.shortcut}
                                                        </kbd>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}

                                {filteredCommands.length === 0 && (
                                    <div className="px-4 py-8 text-center text-muted-foreground">
                                        No commands found
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/50 text-xs text-muted-foreground">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-background rounded">↑↓</kbd> navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-background rounded">↵</kbd> select
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Command className="h-3 w-3" />
                                    <span>K to toggle</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Keyboard hint component
export function KeyboardHint({ keys, className = "" }: { keys: string[]; className?: string }) {
    return (
        <span className={`inline-flex items-center gap-0.5 ${className}`}>
            {keys.map((key, i) => (
                <kbd
                    key={i}
                    className="inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 text-xs bg-muted border border-border rounded font-mono"
                >
                    {key}
                </kbd>
            ))}
        </span>
    );
}
