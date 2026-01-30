"use client";

import { motion } from "framer-motion";
import { card3D, staggerContainer, fadeInUp } from "@/lib/motion";

interface Step {
    number: number;
    title: string;
    description: string;
}

const steps: Step[] = [
    {
        number: 1,
        title: "Push Code",
        description: "Just push to your repository as usual. We listen to webhooks.",
    },
    {
        number: 2,
        title: "AI Processing",
        description: "Our advanced AI analyzes your commits and categorizes them.",
    },
    {
        number: 3,
        title: "Publish",
        description: "A beautiful changelog page is updated automatically.",
    },
];

export function HowItWorksSection() {
    return (
        <section
            id="features"
            className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
        >
            <div className="container px-4 md:px-6">
                <motion.h2
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                >
                    How it Works
                </motion.h2>

                <motion.div
                    className="grid gap-10 sm:grid-cols-2 md:grid-cols-3"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            className="flex flex-col items-center space-y-2 p-6 rounded-xl bg-card border border-border gradient-card-shine"
                            variants={card3D}
                            custom={index}
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            <div className="p-2 bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                                {step.number}
                            </div>
                            <h3 className="text-xl font-bold">{step.title}</h3>
                            <p className="text-sm text-muted-foreground text-center">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
