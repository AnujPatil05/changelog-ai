import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, Bell, Sparkles } from "lucide-react";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-zinc-500 mt-1">Manage your account preferences</p>
            </div>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                    </CardTitle>
                    <CardDescription>Configure how you receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                            <p className="text-sm text-zinc-500">Receive emails when new changelogs are generated</p>
                        </div>
                        <Switch id="email-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="webhook-notifications" className="font-medium">Webhook Alerts</Label>
                            <p className="text-sm text-zinc-500">Get notified when webhook processing fails</p>
                        </div>
                        <Switch id="webhook-notifications" defaultChecked />
                    </div>
                </CardContent>
            </Card>

            {/* AI Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        AI Preferences
                    </CardTitle>
                    <CardDescription>Customize changelog generation behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="auto-generate" className="font-medium">Auto-generate on Push</Label>
                            <p className="text-sm text-zinc-500">Automatically create changelog drafts when commits are pushed</p>
                        </div>
                        <Switch id="auto-generate" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="detailed-mode" className="font-medium">Detailed Mode</Label>
                            <p className="text-sm text-zinc-500">Generate more verbose changelog descriptions</p>
                        </div>
                        <Switch id="detailed-mode" />
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 dark:border-red-900">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-lg">
                        <div>
                            <p className="font-medium">Revoke GitHub Access</p>
                            <p className="text-sm text-zinc-500">Remove our access to your GitHub repositories</p>
                        </div>
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            Revoke
                        </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-lg">
                        <div>
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-zinc-500">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="destructive" className="gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
