"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Shield, Lock, Eye, CheckCircle2 } from "lucide-react";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Logo & Brand */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Changelog AI</h1>
                    <p className="text-muted-foreground">AI-powered changelogs for your GitHub repositories</p>
                </div>

                {/* Main Sign-in Card */}
                <Card>
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl">Welcome</CardTitle>
                        <CardDescription>
                            Sign in to start generating changelogs
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Sign-in Button */}
                        <Button
                            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                            className="w-full h-12 gap-3"
                        >
                            <Github className="h-5 w-5" />
                            Continue with GitHub
                        </Button>

                        {/* Security Badges */}
                        <div className="flex items-center justify-center gap-4 pt-2">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Lock className="h-3.5 w-3.5" />
                                <span>SSL Secured</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Shield className="h-3.5 w-3.5" />
                                <span>OAuth 2.0</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Permissions Notice */}
                <Card>
                    <CardHeader className="pb-2 pt-4">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            What permissions do we request?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 pb-4">
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span><strong className="text-foreground">Read-only access</strong> to your repositories</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span><strong className="text-foreground">Commit messages only</strong> — we never access your code</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span><strong className="text-foreground">Email address</strong> for your account</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Trust Footer */}
                <div className="text-center text-xs text-muted-foreground">
                    <p>By continuing, you agree to our Terms of Service</p>
                    <p className="mt-1">
                        🔒 Your data is encrypted and never shared
                    </p>
                </div>
            </div>
        </div>
    );
}
