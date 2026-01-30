"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Twitter, Linkedin, Link2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialShareProps {
    url: string;
    title: string;
    description?: string;
}

export function SocialShare({ url, title, description }: SocialShareProps) {
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description || "");

    const shareLinks = [
        {
            name: "Twitter",
            icon: <Twitter className="h-4 w-4" />,
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            color: "hover:bg-sky-500/10 hover:text-sky-500",
        },
        {
            name: "LinkedIn",
            icon: <Linkedin className="h-4 w-4" />,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: "hover:bg-blue-600/10 hover:text-blue-600",
        },
    ];

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Share2 className="h-4 w-4" />
                Share
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            className="absolute right-0 top-full mt-2 z-50 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                            <div className="p-1.5">
                                {shareLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${link.color}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.icon}
                                        {link.name}
                                    </a>
                                ))}

                                <button
                                    onClick={copyToClipboard}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-muted"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span className="text-green-500">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Link2 className="h-4 w-4" />
                                            Copy Link
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// Inline share buttons for public changelog page
export function ShareButtons({ url, title }: { url: string; title: string }) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return (
        <div className="flex items-center gap-2">
            <a
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-sky-500/10 hover:text-sky-500 transition-colors"
                aria-label="Share on Twitter"
            >
                <Twitter className="h-4 w-4" />
            </a>
            <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-blue-600/10 hover:text-blue-600 transition-colors"
                aria-label="Share on LinkedIn"
            >
                <Linkedin className="h-4 w-4" />
            </a>
            <CopyButton url={url} />
        </div>
    );
}

function CopyButton({ url }: { url: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <button
            onClick={copyToClipboard}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
            aria-label="Copy link"
        >
            {copied ? (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                    <Check className="h-4 w-4 text-green-500" />
                </motion.div>
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </button>
    );
}
