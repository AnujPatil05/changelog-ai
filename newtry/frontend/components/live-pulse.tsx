"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

// Fake repo names for demo (anonymized)
const demoRepos = [
    "facebook/react",
    "vercel/next.js",
    "microsoft/vscode",
    "tailwindlabs/tailwindcss",
    "openai/whisper",
    "docker/compose",
    "kubernetes/kubernetes",
    "golang/go",
    "rust-lang/rust",
    "python/cpython",
    "nodejs/node",
    "angular/angular",
    "vuejs/vue",
    "sveltejs/svelte",
    "remix-run/remix",
];

interface PulseItem {
    id: number;
    repo: string;
    timeAgo: string;
    commits: number;
}

function generatePulseItem(id: number): PulseItem {
    const repo = demoRepos[Math.floor(Math.random() * demoRepos.length)];
    const seconds = Math.floor(Math.random() * 30) + 1;
    const commits = Math.floor(Math.random() * 50) + 5;
    return {
        id,
        repo,
        timeAgo: `${seconds}s ago`,
        commits,
    };
}

export function LivePulse() {
    const [pulses, setPulses] = useState<PulseItem[]>([]);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        // Initialize with a few items
        setPulses([
            generatePulseItem(0),
            generatePulseItem(1),
            generatePulseItem(2),
        ]);
        setCounter(3);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(prev => prev + 1);
            setPulses(prev => {
                const newPulse = generatePulseItem(counter);
                return [newPulse, ...prev.slice(0, 4)]; // Keep max 5 items
            });
        }, 3000); // New pulse every 3 seconds

        return () => clearInterval(interval);
    }, [counter]);

    return (
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <motion.div
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <Zap className="w-4 h-4 text-primary" />
                </motion.div>
                <div>
                    <h3 className="font-semibold text-sm">Live Pulse</h3>
                    <p className="text-xs text-muted-foreground">Real-time changelog generation</p>
                </div>
                <motion.span
                    className="ml-auto w-2 h-2 rounded-full bg-green-500"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            </div>

            {/* Pulse Feed */}
            <div className="space-y-2">
                <AnimatePresence mode="popLayout" initial={false}>
                    {pulses.map((pulse, index) => (
                        <motion.div
                            key={pulse.id}
                            layout
                            initial={{ opacity: 0, x: -20, height: 0 }}
                            animate={{
                                opacity: index === 0 ? 1 : 0.6 - index * 0.1,
                                x: 0,
                                height: "auto"
                            }}
                            exit={{ opacity: 0, x: 20, height: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 35,
                                opacity: { duration: 0.2 },
                            }}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50"
                        >
                            {index === 0 && (
                                <motion.div
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg"
                                    layoutId="pulse-indicator"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    Generated for <span className="text-primary">{pulse.repo}</span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {pulse.commits} commits analyzed · {pulse.timeAgo}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
        </div>
    );
}

// Compact version for landing page
export function LivePulseCompact() {
    const [currentRepo, setCurrentRepo] = useState(demoRepos[0]);
    const [timeAgo, setTimeAgo] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRepo(demoRepos[Math.floor(Math.random() * demoRepos.length)]);
            setTimeAgo(Math.floor(Math.random() * 10) + 1);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/80 backdrop-blur-sm border border-border text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <motion.span
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
            />
            <AnimatePresence mode="wait">
                <motion.span
                    key={currentRepo}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-muted-foreground"
                >
                    Generated for <span className="text-foreground font-medium">{currentRepo}</span>
                    <span className="text-muted-foreground ml-1">· {timeAgo}s ago</span>
                </motion.span>
            </AnimatePresence>
        </motion.div>
    );
}
