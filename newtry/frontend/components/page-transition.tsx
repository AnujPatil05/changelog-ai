"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageSlide } from "@/lib/motion";

interface PageTransitionProps {
    children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                variants={pageSlide}
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
