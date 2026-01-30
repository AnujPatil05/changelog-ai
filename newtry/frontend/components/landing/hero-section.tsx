"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye } from "lucide-react";
import { fadeInUp, staggerContainer, scaleOnHover } from "@/lib/motion";
import { LivePulseCompact } from "@/components/live-pulse";

export function HeroSection() {
    const containerRef = useRef<HTMLElement>(null);

    // Parallax effect: headline moves slower on scroll
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section
            ref={containerRef}
            className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background relative overflow-hidden"
        >
            {/* Radial gradient glow behind hero */}
            <div className="absolute inset-0 gradient-radial-glow pointer-events-none" />

            <div className="container px-4 md:px-6 relative">
                <motion.div
                    className="flex flex-col items-center space-y-4 text-center"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="space-y-4" style={{ y, opacity }}>
                        <motion.h1
                            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl font-serif"
                            variants={fadeInUp}
                        >
                            Turn Commits into Changelogs, Instantly.
                        </motion.h1>
                        <motion.p
                            className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
                            variants={fadeInUp}
                        >
                            Stop writing changelogs manually. Connect your repo and let AI do the magic.
                        </motion.p>
                    </motion.div>

                    <motion.div className="space-x-4 pt-4" variants={fadeInUp}>
                        <motion.div
                            className="inline-block"
                            variants={scaleOnHover}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Button asChild className="glow-cyan">
                                <Link href="/dashboard">Get Started</Link>
                            </Button>
                        </motion.div>
                        <motion.div
                            className="inline-block"
                            variants={scaleOnHover}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Button variant="outline">View Demo</Button>
                        </motion.div>
                    </motion.div>

                    {/* Trust Badges - stagger in */}
                    <motion.div
                        className="flex items-center gap-6 pt-8 text-sm text-muted-foreground"
                        variants={fadeInUp}
                    >
                        <span className="flex items-center gap-1.5">
                            <Shield className="h-4 w-4" />
                            OAuth 2.0 Secured
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Lock className="h-4 w-4" />
                            SSL Encrypted
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Eye className="h-4 w-4" />
                            Read-Only Access
                        </span>
                    </motion.div>

                    {/* Live Pulse - real-time activity indicator */}
                    <motion.div className="pt-6" variants={fadeInUp}>
                        <LivePulseCompact />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
