'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function AddRepoDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [repoInput, setRepoInput] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { data: session } = useSession();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Parse username/repo
        const parts = repoInput.split('/');
        if (parts.length !== 2) {
            setError('Invalid format. Use username/repo');
            setLoading(false);
            return;
        }
        const [username, repo] = parts;

        try {
            const res = await fetch('/api/proxy/init', { // We'll need a proxy or call backend directly? 
                // Next.js App Router usually calls Backend API directly from client if CORS allows, 
                // OR we create a Route Handler in Next.js to proxy to backend.
                // Let's assume we create a Proxy Route Handler to attach the token if needed, 
                // OR just call the backend Url if we expose it (which we did).
                // But we need the accessToken from session.
                // Let's create a Server Action or Route Handler?
                // Route Handler is easier for now: frontend/app/api/repo/init/route.ts
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    repo,
                    token: session?.accessToken
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to initialize repository');
            }

            setOpen(false);
            setRepoInput('');
            router.refresh(); // Refresh Server Components to show new repo
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Repository
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Repository</DialogTitle>
                        <DialogDescription>
                            Enter the full repository name (e.g., facebook/react) to fetch recent commits and generate an initial changelog.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="repo" className="text-right">
                                Repo
                            </Label>
                            <Input
                                id="repo"
                                placeholder="owner/repo"
                                className="col-span-3"
                                value={repoInput}
                                onChange={(e) => setRepoInput(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className="text-red-500 text-sm ml-auto mr-0">{error}</div>}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? 'Analyzing...' : 'Add Repository'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
