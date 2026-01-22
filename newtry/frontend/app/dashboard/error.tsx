'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[50vh] w-full items-center justify-center p-4">
            <Card className="w-full max-w-md border-destructive/50">
                <CardHeader>
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-6 w-6" />
                        <CardTitle>Something went wrong!</CardTitle>
                    </div>
                    <CardDescription>
                        We encountered an unexpected error while loading this dashboard page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted rounded-md p-2 text-sm font-mono break-all">
                        {error.message || "Unknown error occurred"}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => reset()} variant="default">
                        Try again
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
