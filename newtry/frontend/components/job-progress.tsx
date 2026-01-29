"use client";

import { useState, useEffect, useCallback } from "react";
import { getJobStatus, JobStatus } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, Sparkles } from "lucide-react";

interface JobProgressProps {
    jobId: string;
    onComplete?: (result: any) => void;
    onError?: (error: string) => void;
}

export default function JobProgress({ jobId, onComplete, onError }: JobProgressProps) {
    const [job, setJob] = useState<JobStatus | null>(null);
    const [polling, setPolling] = useState(true);

    const pollStatus = useCallback(async () => {
        if (!jobId || !polling) return;

        try {
            const status = await getJobStatus(jobId);
            if (status) {
                setJob(status);

                if (status.status === 'completed') {
                    setPolling(false);
                    onComplete?.(status.result);
                } else if (status.status === 'failed') {
                    setPolling(false);
                    onError?.(status.error || 'Unknown error');
                }
            }
        } catch (error) {
            console.error('Error polling job status:', error);
        }
    }, [jobId, polling, onComplete, onError]);

    useEffect(() => {
        if (!polling) return;

        // Initial poll
        pollStatus();

        // Poll every 2 seconds
        const interval = setInterval(pollStatus, 2000);

        return () => clearInterval(interval);
    }, [pollStatus, polling]);

    const getStatusIcon = () => {
        switch (job?.status) {
            case 'completed':
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'failed':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'processing':
                return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
            default:
                return <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />;
        }
    };

    const getStatusText = () => {
        switch (job?.status) {
            case 'completed':
                return 'Changelog generated successfully!';
            case 'failed':
                return job.error || 'Generation failed';
            case 'processing':
                return 'Generating changelog with AI...';
            default:
                return 'Starting generation...';
        }
    };

    const getProgressColor = () => {
        switch (job?.status) {
            case 'completed':
                return 'bg-green-500';
            case 'failed':
                return 'bg-red-500';
            default:
                return 'bg-blue-500';
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    {getStatusIcon()}
                    <CardTitle className="text-lg">AI Changelog Generation</CardTitle>
                </div>
                <CardDescription>{getStatusText()}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <Progress
                        value={job?.progress || 0}
                        className={`h-2 ${getProgressColor()}`}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Progress</span>
                        <span>{job?.progress || 0}%</span>
                    </div>

                    {job?.status === 'completed' && job.result && (
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm">
                            <p className="text-green-700 dark:text-green-300">
                                ✨ Generated {job.result.changes?.features?.length || 0} features, {' '}
                                {job.result.changes?.fixes?.length || 0} fixes, {' '}
                                {job.result.changes?.improvements?.length || 0} improvements
                            </p>
                        </div>
                    )}

                    {job?.status === 'failed' && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm">
                            <p className="text-red-700 dark:text-red-300">
                                {job.error}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
