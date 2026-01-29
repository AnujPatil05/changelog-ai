import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, Github, CheckCircle2, Sparkles } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-purple-900/20 bg-[#1a1625]/95 backdrop-blur-sm sticky top-0 z-50">
        <Link className="flex items-center justify-center font-bold text-xl text-white gap-2" href="#">
          <Sparkles className="h-5 w-5 text-purple-400" />
          Changelog AI
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium text-zinc-400 hover:text-purple-400 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-zinc-400 hover:text-purple-400 transition-colors" href="#security">
            Security
          </Link>
          <Link className="text-sm font-medium text-zinc-400 hover:text-purple-400 transition-colors" href="#pricing">
            Pricing
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-[#1a1625] via-[#1e1a2e] to-[#252232] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-full mb-4 border border-purple-500/30">
                <Sparkles className="h-8 w-8 text-purple-400" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                  Turn Commits into Changelogs, Instantly.
                </h1>
                <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl">
                  Stop writing changelogs manually. Connect your repo and let AI do the magic.
                </p>
              </div>
              <div className="space-x-4 pt-4">
                <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-600/25 px-8" asChild>
                  <Link href="/dashboard">Get Started</Link>
                </Button>
                <Button variant="outline" className="text-purple-300 border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-200">
                  View Demo
                </Button>
              </div>
              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-8 text-sm text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-purple-400" />
                  OAuth 2.0 Secured
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-purple-400" />
                  SSL Encrypted
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-purple-400" />
                  Read-Only Access
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              How it Works
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <div className="p-2 bg-black rounded-full text-white w-12 h-12 flex items-center justify-center font-bold">1</div>
                <h3 className="text-xl font-bold">Push Code</h3>
                <p className="text-sm text-gray-500 text-center">
                  Just push to your repository as usual. We listen to webhooks.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <div className="p-2 bg-black rounded-full text-white w-12 h-12 flex items-center justify-center font-bold">2</div>
                <h3 className="text-xl font-bold">AI Processing</h3>
                <p className="text-sm text-gray-500 text-center">
                  Our advanced AI analyzes your commits and categorizes them.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <div className="p-2 bg-black rounded-full text-white w-12 h-12 flex items-center justify-center font-bold">3</div>
                <h3 className="text-xl font-bold">Publish</h3>
                <p className="text-sm text-gray-500 text-center">
                  A beautiful changelog page is updated automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Privacy Section */}
        <section id="security" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Security & Privacy
              </h2>
              <p className="mt-4 max-w-[700px] text-gray-500 md:text-lg">
                Your code is yours. We take security seriously.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="shrink-0">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Read-Only Access</h3>
                    <p className="text-sm text-gray-500">
                      We only request read-only access to your commit history. We cannot modify your code.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="shrink-0">
                    <Lock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">No Source Code Storage</h3>
                    <p className="text-sm text-gray-500">
                      Your source code is never stored on our servers. We only process commit messages.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="shrink-0">
                    <Github className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">GitHub OAuth 2.0</h3>
                    <p className="text-sm text-gray-500">
                      Secure authentication via GitHub. Revoke access anytime from your GitHub settings.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">SOC 2 Ready Infrastructure</h3>
                    <p className="text-sm text-gray-500">
                      Hosted on Vercel & Railway with enterprise-grade security and encryption.
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy Promise */}
              <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-center">
                <p className="text-green-800 dark:text-green-200 font-medium">
                  🔒 Our Promise: We only read commit messages to generate your changelog.
                  Your code stays private. Always.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2026 Changelog AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

