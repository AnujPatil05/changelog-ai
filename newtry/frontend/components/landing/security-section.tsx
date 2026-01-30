"use client";

import { motion } from "framer-motion";
import { Eye, Lock, Github, Shield } from "lucide-react";
import { fadeInUp, staggerContainer, maskReveal } from "@/lib/motion";

const securityFeatures = [
    {
        icon: Eye,
        title: "Read-Only Access",
        description:
            "We only request read-only access to your commit history. We cannot modify your code.",
    },
    {
        icon: Lock,
        title: "No Source Code Storage",
        description:
            "Your source code is never stored on our servers. We only process commit messages.",
    },
    {
        icon: Github,
        title: "GitHub OAuth 2.0",
        description:
            "Secure authentication via GitHub. Revoke access anytime from your GitHub settings.",
    },
    {
        icon: Shield,
        title: "SOC 2 Ready Infrastructure",
        description:
            "Hosted on Vercel & Railway with enterprise-grade security and encryption.",
    },
];

export function SecuritySection() {
    return (
        <section id="security" className="w-full py-12 md:py-24 lg:py-32 bg-card">
            <div className="container px-4 md:px-6">
                {/* Header with mask reveal */}
                <motion.div
                    className="flex flex-col items-center text-center mb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.h2
                        className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                        variants={maskReveal}
                    >
                        Security & Privacy
                    </motion.h2>
                    <motion.p
                        className="mt-4 max-w-[700px] text-muted-foreground md:text-lg"
                        variants={fadeInUp}
                    >
                        Your code is yours. We take security seriously.
                    </motion.p>
                </motion.div>

                {/* Feature grid with stagger */}
                <motion.div
                    className="max-w-3xl mx-auto"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    <div className="grid gap-6 md:grid-cols-2">
                        {securityFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className="flex gap-4 p-6 bg-muted/50 rounded-xl border border-border gradient-card-shine"
                                variants={fadeInUp}
                                custom={index}
                            >
                                <div className="shrink-0">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom promise banner */}
                    <motion.div
                        className="mt-8 p-6 bg-primary/10 rounded-xl text-center border border-primary/20"
                        variants={fadeInUp}
                    >
                        <p className="flex items-center justify-center gap-2 text-sm font-medium">
                            <Lock className="h-4 w-4 text-primary" />
                            Our Promise: We only read commit messages to generate your
                            changelog. Your code stays private. Always.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
