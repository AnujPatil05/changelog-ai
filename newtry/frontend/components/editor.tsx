"use client";

import { useState } from "react";
import { updateChangelog, Changes, Version } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { X, Plus, Save, Loader2, GitCommit, Trash2, Edit2, Share } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface EditorProps {
    username: string;
    repo: string;
    versionData: Version;
}

export default function Editor({ username, repo, versionData }: EditorProps) {
    const [changes, setChanges] = useState<Changes>(versionData.changes);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const removeItem = (category: string, index: number) => {
        setChanges((prev: Changes) => ({
            ...prev,
            [category]: prev[category].filter((_: string, i: number) => i !== index)
        }));
    };

    const addItem = (category: string) => {
        // Simple prompt for MVP, could be a dialog
        const item = prompt(`Add new ${category} item:`);
        if (item) {
            setChanges((prev: Changes) => ({
                ...prev,
                [category]: [...(prev[category] || []), item]
            }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateChangelog(username, repo, versionData.version, changes);
            alert("Draft saved successfully!");
            router.refresh();
        } catch (e) {
            alert("Failed to save");
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const handleRelease = async () => {
        // For MVP, release just saves. In future, it could trigger GitHub Release or set a 'published' flag.
        if (confirm("Are you sure you want to release this changelog to the public page?")) {
            await handleSave();
            window.open(`/${username}/${repo}`, '_blank');
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
            {/* Header Info */}
            <div className="flex justify-between items-center px-1">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{repo}</h2>
                    <p className="text-zinc-500">Managing changelogs for {versionData.version}</p>
                </div>
                <div className="flex gap-2">
                    {/* Placeholder for future specific version actions */}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
                {/* Left Column: Source Commits */}
                <div className="flex flex-col gap-4 h-full min-h-0">
                    <Card className="flex flex-col h-full overflow-hidden bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <CardTitle className="text-lg">Source Commits</CardTitle>
                            <CardDescription>Raw commits from GitHub used for generation.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-0">
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {versionData.raw_commits?.map((commit, i) => (
                                    <div key={i} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 mb-1 line-clamp-2">
                                            {commit.message}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <span className="font-medium">{commit.author}</span>
                                            <span>•</span>
                                            <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">
                                                {commit.id}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {(!versionData.raw_commits || versionData.raw_commits.length === 0) && (
                                    <div className="p-8 text-center text-zinc-500 text-sm">
                                        No source commits available for this version.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: AI-Generated Draft */}
                <div className="flex flex-col gap-4 h-full min-h-0">
                    <Card className="flex flex-col h-full overflow-hidden bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">AI-Generated Draft</CardTitle>
                                <CardDescription>v1.0.0-2026-01-30</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
                            {['features', 'fixes', 'improvements'].map((category) => (
                                <div key={category} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-500">{category}</h3>
                                        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => addItem(category)}>
                                            <Plus className="w-3 h-3 mr-1" /> Add
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        {(changes[category] || []).map((item: string, i: number) => (
                                            <div key={i} className="group flex items-start gap-2 bg-white dark:bg-zinc-950 p-2 rounded-md border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm">
                                                <Input
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newItems = [...changes[category]];
                                                        newItems[i] = e.target.value;
                                                        setChanges({ ...changes, [category]: newItems });
                                                    }}
                                                    className="border-0 focus-visible:ring-0 px-0 h-auto py-1 shadow-none bg-transparent"
                                                />
                                                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-red-500" onClick={() => removeItem(category, i)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        {(changes[category] || []).length === 0 && (
                                            <div className="text-sm text-zinc-400 italic px-2">No items in {category}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>

                        {/* Action Bar */}
                        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end gap-3">
                            <Button variant="outline" onClick={handleSave} disabled={saving}>
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                <Save className="w-4 h-4 mr-2" />
                                Save Draft
                            </Button>
                            <Button onClick={handleRelease} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Share className="w-4 h-4 mr-2" />
                                Release to Public
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
