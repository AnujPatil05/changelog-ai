"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Shield, Lock, Eye, CheckCircle2, Sparkles } from "lucide-react";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Logo & Brand */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20">
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Changelog AI</h1>
                    <p className="text-zinc-400">AI-powered changelogs for your GitHub repositories</p>
                </div>

                {/* Main Sign-in Card */}
                <Card className="border-zinc-700/50 bg-zinc-800/50 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl text-white">Welcome</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Sign in to start generating changelogs
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Sign-in Button */}
                        <Button
                            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                            className="w-full h-12 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold text-base gap-3"
                        >
                            <Github className="h-5 w-5" />
                            Continue with GitHub
                        </Button>

                        {/* Security Badges */}
                        <div className="flex items-center justify-center gap-4 pt-2">
                            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                <Lock className="h-3.5 w-3.5 text-green-400" />
                                <span>SSL Secured</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                <Shield className="h-3.5 w-3.5 text-blue-400" />
                                <span>OAuth 2.0</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Permissions Notice */}
                <Card className="border-zinc-700/30 bg-zinc-800/30 backdrop-blur">
                    <CardHeader className="pb-2 pt-4">
                        <CardTitle className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                            <Eye className="h-4 w-4 text-blue-400" />
                            What permissions do we request?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 pb-4">
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span><strong className="text-zinc-300">Read-only access</strong> to your repositories</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span><strong className="text-zinc-300">Commit messages only</strong> — we never access your code</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span><strong className="text-zinc-300">Email address</strong> for your account</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Trust Footer */}
                <div className="text-center text-xs text-zinc-500">
                    <p>By continuing, you agree to our Terms of Service</p>
                    <p className="mt-1">
                        🔒 Your data is encrypted and never shared
                    </p>
                </div>
            </div>
        </div>
    );
}
