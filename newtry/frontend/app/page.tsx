import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeroSection, HowItWorksSection, SecuritySection } from "@/components/landing";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <Link className="flex items-center justify-center font-bold text-xl" href="#">
          Changelog AI
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#features">
            Features
          </Link>
          <Link className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#security">
            Security
          </Link>
          <span className="hidden md:block text-sm font-medium text-muted-foreground/60 cursor-not-allowed whitespace-nowrap">
            Pricing (Coming Soon)
          </span>
          <ThemeToggle />
        </nav>
      </header>

      <main className="flex-1">
        {/* Animated sections */}
        <HeroSection />
        <HowItWorksSection />
        <SecuritySection />
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2026 Changelog AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
