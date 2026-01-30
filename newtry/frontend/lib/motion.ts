"use client";

import { Variants } from "framer-motion";

// Spring configuration for premium feel
export const springConfig = {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
};

// Softer spring for larger movements
export const softSpring = {
    type: "spring" as const,
    stiffness: 200,
    damping: 25,
};

// Quick snap for micro-interactions
export const snapSpring = {
    type: "spring" as const,
    stiffness: 500,
    damping: 35,
};

// Fade in from bottom (staggered list items)
export const fadeInUp: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: softSpring,
    },
};

// Scale on hover (cards, buttons)
export const scaleOnHover: Variants = {
    initial: { scale: 1 },
    hover: {
        scale: 1.02,
        transition: springConfig,
    },
    tap: {
        scale: 0.98,
        transition: snapSpring,
    },
};

// 3D card tilt effect
export const card3D: Variants = {
    hidden: {
        opacity: 0,
        y: 40,
        rotateX: 10,
    },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            ...softSpring,
            delay: 0.1,
        },
    },
};

// Stagger children animation
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

// Page transition (slide in from right)
export const pageSlide: Variants = {
    initial: {
        opacity: 0,
        x: 20,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: softSpring,
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: { duration: 0.2 },
    },
};

// Mask reveal animation
export const maskReveal: Variants = {
    hidden: {
        clipPath: "inset(0 100% 0 0)",
    },
    visible: {
        clipPath: "inset(0 0% 0 0)",
        transition: {
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

// Glow pulse (for AI processing)
export const glowPulse: Variants = {
    initial: {
        boxShadow: "0 0 0px oklch(0.72 0.19 195 / 0)",
    },
    animate: {
        boxShadow: [
            "0 0 0px oklch(0.72 0.19 195 / 0)",
            "0 0 30px oklch(0.72 0.19 195 / 0.4)",
            "0 0 0px oklch(0.72 0.19 195 / 0)",
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};
