"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
    shimmer?: boolean;
}

// Enhanced skeleton with optional shimmer effect
export function Skeleton({ className, shimmer = true }: SkeletonProps) {
    return (
        <div className={cn("relative overflow-hidden rounded-md bg-muted", className)}>
            {shimmer && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            )}
        </div>
    );
}

// Card skeleton for repo cards
export function CardSkeleton() {
    return (
        <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        </div>
    );
}

// List skeleton for commit/changelog lists
export function ListSkeleton({ items = 5 }: { items?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: items }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                >
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-3 w-2/5" />
                        </div>
                        <Skeleton className="w-16 h-6 rounded-full" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

interface ProgressBarProps {
    progress: number;
    className?: string;
}

// Spring physics progress bar
export function ProgressBar({ progress, className }: ProgressBarProps) {
    return (
        <div className={cn("h-2 bg-muted rounded-full overflow-hidden", className)}>
            <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                }}
            />
        </div>
    );
}

interface CircularProgressProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

// Circular progress with spring physics
export function CircularProgress({
    progress,
    size = 48,
    strokeWidth = 4,
    className,
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className={cn("relative", className)} style={{ width: size, height: size }}>
            {/* Background circle */}
            <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-muted"
                />
            </svg>

            {/* Progress circle */}
            <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className="text-primary"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{
                        type: "spring",
                        stiffness: 60,
                        damping: 15,
                    }}
                />
            </svg>

            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                    className="text-xs font-medium"
                    key={Math.round(progress)}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {Math.round(progress)}%
                </motion.span>
            </div>
        </div>
    );
}
