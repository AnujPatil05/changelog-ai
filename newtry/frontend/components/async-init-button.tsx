"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { initRepoAsync } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import JobProgress from "@/components/job-progress";
import { Sparkles, Loader2 } from "lucide-react";

interface AsyncInitButtonProps {
    username: string;
    repoName: string;
    onSuccess?: () => void;
    variant?: "default" | "outline" | "secondary" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
}

export default function AsyncInitButton({
    username,
    repoName,
    onSuccess,
    variant = "default",
    size = "default",
    className
}: AsyncInitButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleStart = async () => {
        setStarting(true);
        setError(null);

        try {
            const result = await initRepoAsync(
                username,
                repoName,
                (session as any)?.accessToken
            );

            if (result.success && result.jobId) {
                setJobId(result.jobId);
                setIsOpen(true);
            } else {
                setError(result.error || 'Failed to start generation');
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setStarting(false);
        }
    };

    const handleComplete = (result: any) => {
        // Wait a moment to show success, then close and refresh
        setTimeout(() => {
            setIsOpen(false);
            setJobId(null);
            onSuccess?.();
            router.refresh();
        }, 1500);
    };

    const handleError = (errorMsg: string) => {
        setError(errorMsg);
    };

    const handleClose = () => {
        setIsOpen(false);
        setJobId(null);
        setError(null);
    };

    return (
        <>
            <Button
                onClick={handleStart}
                disabled={starting}
                variant={variant}
                size={size}
                className={className}
            >
                {starting ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Starting...
                    </>
                ) : (
                    <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Changelog
                    </>
                )}
            </Button>

            {error && !isOpen && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
            )}

            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Generating Changelog</DialogTitle>
                        <DialogDescription>
                            AI is analyzing commits for {username}/{repoName}
                        </DialogDescription>
                    </DialogHeader>

                    {jobId && (
                        <JobProgress
                            jobId={jobId}
                            onComplete={handleComplete}
                            onError={handleError}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
