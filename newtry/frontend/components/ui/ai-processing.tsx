"use client";

import { motion } from "framer-motion";

interface AIScanLineProps {
    isScanning?: boolean;
    duration?: number;
}

// Animated scanning line that moves down a list
export function AIScanLine({ isScanning = true, duration = 1.5 }: AIScanLineProps) {
    if (!isScanning) return null;

    return (
        <motion.div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent pointer-events-none z-10"
            initial={{ top: 0, opacity: 0 }}
            animate={{
                top: ["0%", "100%"],
                opacity: [0, 1, 1, 0],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
            }}
        />
    );
}

interface ShimmerTextProps {
    children: React.ReactNode;
    isAnimating?: boolean;
    className?: string;
}

// Shimmer effect for "code-to-text" morph
export function ShimmerText({ children, isAnimating = true, className = "" }: ShimmerTextProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            {children}
            {isAnimating && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            )}
        </div>
    );
}

interface SuccessPulseProps {
    isActive?: boolean;
    children: React.ReactNode;
    className?: string;
}

// Success haptic-style pulse animation
export function SuccessPulse({ isActive = false, children, className = "" }: SuccessPulseProps) {
    return (
        <motion.div
            className={`relative ${className}`}
            animate={
                isActive
                    ? {
                        scale: [1, 1.02, 1],
                    }
                    : {}
            }
            transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
            {isActive && (
                <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-primary"
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                />
            )}
        </motion.div>
    );
}

interface AIProcessingCardProps {
    status: "idle" | "scanning" | "processing" | "complete";
    commitCount?: number;
}

// Full AI processing state component
export function AIProcessingCard({ status, commitCount = 0 }: AIProcessingCardProps) {
    const statusMessages = {
        idle: "Ready to analyze",
        scanning: "Scanning commits...",
        processing: "AI is generating changelog...",
        complete: "Changelog generated!",
    };

    return (
        <div className="relative p-6 rounded-xl bg-card border border-border overflow-hidden">
            {/* Scanning line when active */}
            <AIScanLine isScanning={status === "scanning"} />

            {/* Status display */}
            <div className="flex items-center gap-4">
                {/* Animated icon */}
                <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${status === "complete" ? "bg-primary/20" : "bg-muted"
                        }`}
                    animate={
                        status === "processing"
                            ? { rotate: 360 }
                            : status === "complete"
                                ? { scale: [1, 1.1, 1] }
                                : {}
                    }
                    transition={
                        status === "processing"
                            ? { duration: 2, repeat: Infinity, ease: "linear" }
                            : { duration: 0.3 }
                    }
                >
                    {status === "complete" ? (
                        <motion.svg
                            viewBox="0 0 24 24"
                            className="w-6 h-6 text-primary"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <motion.path
                                d="M5 13l4 4L19 7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </motion.svg>
                    ) : (
                        <motion.div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                    )}
                </motion.div>

                {/* Text content */}
                <div className="flex-1">
                    <ShimmerText isAnimating={status === "processing"}>
                        <p className="font-medium">{statusMessages[status]}</p>
                    </ShimmerText>
                    {commitCount > 0 && (
                        <p className="text-sm text-muted-foreground">
                            {status === "complete" ? "Processed" : "Analyzing"} {commitCount} commits
                        </p>
                    )}
                </div>
            </div>

            {/* Glow effect on complete */}
            {status === "complete" && (
                <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    initial={{ boxShadow: "0 0 0px oklch(0.72 0.19 195 / 0)" }}
                    animate={{
                        boxShadow: [
                            "0 0 0px oklch(0.72 0.19 195 / 0)",
                            "0 0 30px oklch(0.72 0.19 195 / 0.3)",
                            "0 0 0px oklch(0.72 0.19 195 / 0)",
                        ],
                    }}
                    transition={{ duration: 1, repeat: 2 }}
                />
            )}
        </div>
    );
}
