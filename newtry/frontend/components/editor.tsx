"use client";

import { useState } from "react";
import { updateChangelog } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditorProps {
    username: string;
    repo: string;
    versionData: any;
}

export default function Editor({ username, repo, versionData }: EditorProps) {
    const [changes, setChanges] = useState(versionData.changes);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const removeItem = (category: string, index: number) => {
        setChanges((prev: any) => ({
            ...prev,
            [category]: prev[category].filter((_: any, i: number) => i !== index)
        }));
    };

    const addItem = (category: string) => {
        const item = prompt(`Add new ${category} item:`);
        if (item) {
            setChanges((prev: any) => ({
                ...prev,
                [category]: [...(prev[category] || []), item]
            }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateChangelog(username, repo, versionData.version, changes);
            alert("Saved successfully!");
            router.refresh();
        } catch (e) {
            alert("Failed to save");
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">{versionData.version}</h2>
                    <p className="text-zinc-500">{versionData.date}</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
            </div>

            {['features', 'fixes', 'improvements'].map((category) => (
                <Card key={category}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="capitalize">{category}</CardTitle>
                        <Button size="sm" variant="outline" onClick={() => addItem(category)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Item
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(changes[category] || []).map((item: string, i: number) => (
                            <div key={i} className="flex gap-2 items-start">
                                <Input
                                    value={item}
                                    onChange={(e) => {
                                        const newItems = [...changes[category]];
                                        newItems[i] = e.target.value;
                                        setChanges({ ...changes, [category]: newItems });
                                    }}
                                />
                                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeItem(category, i)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        {(changes[category] || []).length === 0 && (
                            <div className="text-sm text-zinc-400 italic">No {category} yet.</div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
