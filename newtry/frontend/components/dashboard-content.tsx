"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface DashboardContentProps {
    children: React.ReactNode;
}

const contentVariants = {
    initial: {
        opacity: 0,
        x: 20,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 30,
        },
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: {
            duration: 0.15,
        },
    },
};

export function DashboardContent({ children }: DashboardContentProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex-1"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
